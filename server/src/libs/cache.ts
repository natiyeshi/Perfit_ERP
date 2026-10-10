// Small in-process TTL cache for expensive, read-heavy responses (analytics,
// the external Maraki dashboard).
//
// Why in-memory and not Redis: the API runs as a single Node process, so a Map
// gives the same hit rate with no extra infrastructure. The interface below is
// deliberately Redis-shaped (string keys, TTL, prefix invalidation) so it can be
// swapped for Redis once the API runs on more than one instance.
//
// Invalidation: competitor-import data only changes through the hourly ERIS
// sync or a write request, and both call `invalidateCache(...)`. The TTL is a
// safety net for writes made outside this process (e.g. the backfill script).

type Entry = { value: unknown; expiresAt: number };

const store = new Map<string, Entry>();
// Requests for a key that is already being computed share the same promise,
// so a burst of dashboard loads triggers one DB query, not one per request.
const inFlight = new Map<string, Promise<unknown>>();

export const ANALYTICS_PREFIX = "analytics:";

export const getOrSetCache = async <T>(
  key: string,
  ttlMs: number,
  compute: () => Promise<T>
): Promise<T> => {
  const hit = store.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.value as T;

  const pending = inFlight.get(key);
  if (pending) return pending as Promise<T>;

  const promise = compute()
    .then((value) => {
      store.set(key, { value, expiresAt: Date.now() + ttlMs });
      return value;
    })
    .finally(() => inFlight.delete(key));

  inFlight.set(key, promise);
  return promise;
};

export const invalidateCache = (prefix = "") => {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
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
