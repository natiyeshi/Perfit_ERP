// Small in-process TTL cache for expensive, read-heavy responses (analytics,
// list endpoints, the external Maraki dashboard).
//
// Why in-memory and not Redis: the API runs as a single Node process, so a Map
// gives the same hit rate with no extra infrastructure. The interface below is
// deliberately Redis-shaped (string keys, TTL, prefix invalidation) so it can be
// swapped for Redis once the API runs on more than one instance.
//
// Invalidation: DB data only changes through the hourly ERIS sync or a write
// request, and both call `invalidateDataCaches()`. The TTL is a safety net for
// writes made outside this process (e.g. the backfill script).

type Entry = {
  value: unknown;
  freshUntil: number;
  // Until this time a stale value may still be served while it is refreshed in
  // the background (stale-while-revalidate). Equal to freshUntil otherwise.
  staleUntil: number;
};

const store = new Map<string, Entry>();
// Requests for a key that is already being computed share the same promise,
// so a burst of dashboard loads triggers one DB query, not one per request.
const inFlight = new Map<string, Promise<unknown>>();
// Bumped on every invalidation. A computation that started before an
// invalidation must not store its (possibly pre-write) result afterwards.
let generation = 0;

// Upper bound on entries; per-page/per-search keys could otherwise grow
// without limit. Map iterates in insertion order, so the first key is oldest.
const MAX_ENTRIES = 500;

export const ANALYTICS_PREFIX = "analytics:";
export const PRODUCTS_PREFIX = "products:";
export const IMPORTS_TABLE_PREFIX = "imports-table:";
const DATA_PREFIXES = [ANALYTICS_PREFIX, PRODUCTS_PREFIX, IMPORTS_TABLE_PREFIX];

const setEntry = (key: string, value: unknown, freshMs: number, staleMs: number) => {
  if (store.size >= MAX_ENTRIES && !store.has(key)) {
    store.delete(store.keys().next().value as string);
  }
  const now = Date.now();
  store.set(key, { value, freshUntil: now + freshMs, staleUntil: now + freshMs + staleMs });
};

const computeAndStore = <T>(
  key: string,
  freshMs: number,
  staleMs: number,
  compute: () => Promise<T>
): Promise<T> => {
  const pending = inFlight.get(key);
  if (pending) return pending as Promise<T>;

  const startedAt = generation;
  const promise = compute()
    .then((value) => {
      if (generation === startedAt) setEntry(key, value, freshMs, staleMs);
      return value;
    })
    .finally(() => {
      if (inFlight.get(key) === promise) inFlight.delete(key);
    });

  inFlight.set(key, promise);
  return promise;
};

export const getOrSetCache = async <T>(
  key: string,
  ttlMs: number,
  compute: () => Promise<T>
): Promise<T> => {
  const hit = store.get(key);
  if (hit && hit.freshUntil > Date.now()) return hit.value as T;
  return computeAndStore(key, ttlMs, 0, compute);
};

/**
 * Stale-while-revalidate: within `freshMs` the cached value is returned as is.
 * After that, for up to `staleMs` more, the stale value is still returned
 * immediately while a single background refresh runs; if that refresh fails
 * the stale value is kept. Only a cold or fully expired key makes the caller
 * wait for `compute`.
 */
export const getOrSetCacheSWR = async <T>(
  key: string,
  freshMs: number,
  staleMs: number,
  compute: () => Promise<T>
): Promise<T> => {
  const hit = store.get(key);
  const now = Date.now();
  if (hit && hit.freshUntil > now) return hit.value as T;
  if (hit && hit.staleUntil > now) {
    computeAndStore(key, freshMs, staleMs, compute).catch((err) =>
      console.error(`[CACHE] background refresh of "${key}" failed:`, err?.message || err)
    );
    return hit.value as T;
  }
  return computeAndStore(key, freshMs, staleMs, compute);
};

export const invalidateCache = (prefix = "") => {
  generation++;
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
  // Later requests must not join a computation that may predate the write.
  for (const key of inFlight.keys()) {
    if (key.startsWith(prefix)) inFlight.delete(key);
  }
};

// Everything derived from our own database (not the external Maraki data).
export const invalidateDataCaches = () => {
  DATA_PREFIXES.forEach((prefix) => invalidateCache(prefix));
};

// Stable cache key from route name + query params (sorted, so ?a=1&b=2 and
// ?b=2&a=1 share an entry).
export const cacheKey = (name: string, params: Record<string, unknown>) =>
  name +
  ":" +
  Object.keys(params)
    .sort()
    .filter((k) => params[k] !== undefined && params[k] !== null)
    .map((k) => `${k}=${String(params[k])}`)
    .join("&");
