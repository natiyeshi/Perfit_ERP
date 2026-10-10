import crypto from "crypto";
import { promisify } from "util";
import zlib from "zlib";
import { Request, Response } from "express";
import { getOrSetCache } from "./cache";

const gzip = promisify(zlib.gzip);

type CachedBody = { json: Buffer; gzipped: Buffer; etag: string };

/**
 * Sends a JSON body that is cached already serialized and gzipped, so a hit
 * skips the DB, Prisma hydration, JSON.stringify and compression entirely.
 * Also answers conditional requests: a client that already has this version
 * (If-None-Match matches the ETag) gets an empty 304.
 *
 * `build` must return the full response body (same shape as sendApiResponse).
 * Only use for responses that are identical for every authenticated user.
 */
export const sendCachedJson = async (
  req: Request,
  res: Response,
  key: string,
  ttlMs: number,
  build: () => Promise<object>
) => {
  const body = await getOrSetCache<CachedBody>(key, ttlMs, async () => {
    const json = Buffer.from(JSON.stringify(await build()));
    const hash = crypto.createHash("sha1").update(json).digest("base64url");
    return { json, gzipped: await gzip(json), etag: `W/"${json.length.toString(16)}-${hash}"` };
  });

  res.setHeader("ETag", body.etag);
  res.setHeader("Vary", "Accept-Encoding");
  res.type("application/json");
  if (req.fresh) return res.status(304).end();

  // Setting Content-Encoding makes the compression middleware skip this response.
  if (req.acceptsEncodings("gzip") === "gzip") {
    res.setHeader("Content-Encoding", "gzip");
    return res.status(200).send(body.gzipped);
  }
  return res.status(200).send(body.json);
};
