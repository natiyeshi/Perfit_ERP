import fs from "fs/promises";
import path from "path";

const AUTH_DIR = path.resolve(process.cwd(), "storage");
const AUTH_FILE = path.join(AUTH_DIR, "eris-auth.json");

type StoredErisAuth = {
  accessToken: string;
  expiresAt: string | null;
  updatedAt: string;
};

const decodeJwtPayload = (token: string): any | null => {
  const [, payload] = token.split(".");
  if (!payload) return null;

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "="
    );
    return JSON.parse(Buffer.from(padded, "base64").toString("utf8"));
  } catch {
    return null;
  }
};

const getTokenExpiry = (token: string) => {
  const payload = decodeJwtPayload(token);
  if (typeof payload?.exp !== "number") return null;
  return new Date(payload.exp * 1000).toISOString();
};

export const saveErisAccessToken = async (accessToken: string) => {
  if (!accessToken || !accessToken.trim()) {
    throw new Error("ERIS access token is required.");
  }

  await fs.mkdir(AUTH_DIR, { recursive: true });

  const auth: StoredErisAuth = {
    accessToken: accessToken.trim(),
    expiresAt: getTokenExpiry(accessToken.trim()),
    updatedAt: new Date().toISOString(),
  };

  await fs.writeFile(AUTH_FILE, JSON.stringify(auth, null, 2), {
    encoding: "utf8",
    mode: 0o600,
  });

  return getErisAuthStatus(auth);
};

const readStoredAuth = async () => {
  try {
    const raw = await fs.readFile(AUTH_FILE, "utf8");
    return JSON.parse(raw) as StoredErisAuth;
  } catch (error: any) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
};

const isExpired = (expiresAt: string | null) => {
  if (!expiresAt) return false;
  return Date.now() >= new Date(expiresAt).getTime() - 60_000;
};

export const getCachedErisAccessToken = async () => {
  if (process.env.ERIS_ACCESS_TOKEN) {
    return process.env.ERIS_ACCESS_TOKEN;
  }

  const auth = await readStoredAuth();
  if (!auth?.accessToken || isExpired(auth.expiresAt)) return null;
  return auth.accessToken;
};

export const clearCachedErisAuth = async () => {
  await fs.unlink(AUTH_FILE).catch((error: any) => {
    if (error?.code !== "ENOENT") throw error;
  });
};

export const getErisAuthStatus = async (authOverride?: StoredErisAuth) => {
  const auth = authOverride || (await readStoredAuth());
  if (!auth?.accessToken) {
    return {
      authenticated: false,
      expiresAt: null,
      updatedAt: null,
      needsRefresh: true,
    };
  }

  const expired = isExpired(auth.expiresAt);
  return {
    authenticated: !expired,
    expiresAt: auth.expiresAt,
    updatedAt: auth.updatedAt,
    needsRefresh: expired,
  };
};
