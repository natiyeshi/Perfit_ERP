// src/middleware/security.ts
import { RequestHandler } from "express";
import fs from "fs";
import path from "path";

const blockedPatterns = [
  /\.env$/,
  /phpunit/i,
  /eval-stdin\.php/,
  /allow_url_include/,
  /\.well-known\/security\.txt/,
  /luci/,
];

// Appending through a stream keeps the same log file and format, but doesn't
// block the event loop on a disk write for every request like appendFileSync.
const logStream = fs.createWriteStream(
  path.join(process.cwd(), "security.log"),
  { flags: "a" }
);
logStream.on("error", (err) => console.error("[SECURITY] log write failed:", err));

export const securityMiddleware: RequestHandler = (req, res, next) => {
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",").shift() ||
    req.socket.remoteAddress;

  const logLine = `[${new Date().toISOString()}] ${req.method} ${
    req.url
  } from ${ip}\n`;

  logStream.write(logLine);

  // 🔍 Block suspicious requests
  if (blockedPatterns.some((pattern) => pattern.test(req.url))) {
    console.warn(`[SECURITY] Blocked suspicious request: ${req.url} from ${ip}`);
    res.status(403).send("Forbidden");
    return; // ✅ stop here, don't return a value
  }

  next(); // ✅ pass to next middleware
};
