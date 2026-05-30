import User from "../models/User.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireFields } from "../middleware/validate.js";
import { httpError } from "../utils/httpError.js";
import { createAuthTokens, verifyToken } from "../utils/tokens.js";
import { env } from "../config/env.js";

const normalizeEmail = (email) => String(email).trim().toLowerCase();

const buildAuthResponse = (user) => ({
  user: user.toSafeObject(),
  tokens: createAuthTokens(user),
});

export const register = asyncHandler(async (req, res) => {
  requireFields(req.body, ["username", "email", "password"]);

  const username = String(req.body.username).trim();
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password);

  if (username.length < 3 || username.length > 24) {
    throw httpError(400, "Username must be between 3 and 24 characters");
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw httpError(400, "Email must be valid");
  }

  if (password.length < 8) {
    throw httpError(400, "Password must be at least 8 characters");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw httpError(409, "Username or email is already in use");
  }

  const user = new User({ username, email });
  user.setPassword(password);
  await user.save();

  res.status(201).json(buildAuthResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  requireFields(req.body, ["email", "password"]);

  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password);
  const user = await User.findOne({ email }).select("+passwordHash");

  if (!user || !user.comparePassword(password)) {
    throw httpError(401, "Invalid email or password");
  }

  res.json(buildAuthResponse(user));
});

export const refresh = asyncHandler(async (req, res) => {
  requireFields(req.body, ["refreshToken"]);

  let payload;
  try {
    payload = verifyToken(req.body.refreshToken, env.refreshTokenSecret);
  } catch (err) {
    throw httpError(401, "Invalid or expired refresh token");
  }

  if (payload.type !== "refresh") {
    throw httpError(401, "Invalid token type");
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    throw httpError(401, "User no longer exists");
  }

  res.json({ tokens: createAuthTokens(user) });
});

export const logout = asyncHandler(async (req, res) => {
  res.json({ message: "Logged out" });
});
