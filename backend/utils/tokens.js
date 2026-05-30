import crypto from "crypto";
import { env } from "../config/env.js";

const base64Url = (input) =>
  Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

const sign = (value, secret) =>
  crypto.createHmac("sha256", secret).update(value).digest("base64url");

export const createToken = (payload, secret, ttlSeconds) => {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const body = {
    ...payload,
    iat: now,
    exp: now + ttlSeconds,
  };

  const unsigned = `${base64Url(JSON.stringify(header))}.${base64Url(
    JSON.stringify(body)
  )}`;

  return `${unsigned}.${sign(unsigned, secret)}`;
};

export const verifyToken = (token, secret) => {
  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) {
    throw new Error("Invalid token");
  }

  const expected = sign(`${header}.${payload}`, secret);
  if (signature.length !== expected.length) {
    throw new Error("Invalid token signature");
  }

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    throw new Error("Invalid token signature");
  }

  const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired");
  }

  return decoded;
};

export const createAuthTokens = (user) => ({
  accessToken: createToken(
    { sub: user._id.toString(), role: user.role, type: "access" },
    env.accessTokenSecret,
    env.accessTokenTtlSeconds
  ),
  refreshToken: createToken(
    { sub: user._id.toString(), role: user.role, type: "refresh" },
    env.refreshTokenSecret,
    env.refreshTokenTtlSeconds
  ),
});
