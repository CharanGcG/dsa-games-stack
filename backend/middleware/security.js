import { env } from "../config/env.js";
import { httpError } from "../utils/httpError.js";

const buckets = new Map();

export const securityHeaders = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
};

export const corsOptions = {
  origin(origin, callback) {
    if (!origin || env.corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(httpError(403, "Origin is not allowed"));
  },
  credentials: true,
};

export const rateLimit = ({ windowMs, max, keyPrefix }) => (req, res, next) => {
  const now = Date.now();
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "unknown";
  const key = `${keyPrefix}:${ip}`;
  const bucket = buckets.get(key) || { count: 0, resetAt: now + windowMs };

  if (bucket.resetAt <= now) {
    bucket.count = 0;
    bucket.resetAt = now + windowMs;
  }

  bucket.count += 1;
  buckets.set(key, bucket);

  if (bucket.count > max) {
    res.setHeader("Retry-After", Math.ceil((bucket.resetAt - now) / 1000));
    next(httpError(429, "Too many requests. Please slow down."));
    return;
  }

  next();
};

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  keyPrefix: "auth",
});

export const scoreRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  keyPrefix: "score",
});
