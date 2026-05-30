import User from "../models/User.js";
import { httpError } from "../utils/httpError.js";
import { verifyToken } from "../utils/tokens.js";
import { env } from "../config/env.js";
import { asyncHandler } from "./asyncHandler.js";

export const requireAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw httpError(401, "Authentication required");
  }

  let payload;
  try {
    payload = verifyToken(token, env.accessTokenSecret);
  } catch (err) {
    throw httpError(401, "Invalid or expired access token");
  }

  if (payload.type !== "access") {
    throw httpError(401, "Invalid token type");
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    throw httpError(401, "User no longer exists");
  }

  req.user = user;
  next();
});

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    next(httpError(403, "Admin access required"));
    return;
  }

  next();
};
