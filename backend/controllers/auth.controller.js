import RefreshToken from "../models/RefreshToken.js";
import User from "../models/User.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireFields } from "../middleware/validate.js";
import { httpError } from "../utils/httpError.js";
import {
  createAccessToken,
  createOpaqueToken,
  getRefreshExpiry,
  hashToken,
} from "../utils/tokens.js";

const normalizeEmail = (email) => String(email).trim().toLowerCase();

const createAuthResponse = async (user) => {
  const refreshToken = createOpaqueToken();
  await RefreshToken.create({
    user: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: getRefreshExpiry(),
  });

  return {
    user: user.toSafeObject(),
    tokens: {
      accessToken: createAccessToken(user),
      refreshToken,
    },
  };
};

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

  res.status(201).json(await createAuthResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  requireFields(req.body, ["email", "password"]);

  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password);
  const user = await User.findOne({ email }).select("+passwordHash");

  if (!user || !user.comparePassword(password)) {
    throw httpError(401, "Invalid email or password");
  }

  res.json(await createAuthResponse(user));
});

export const refresh = asyncHandler(async (req, res) => {
  requireFields(req.body, ["refreshToken"]);

  const currentHash = hashToken(req.body.refreshToken);
  const storedToken = await RefreshToken.findOne({ tokenHash: currentHash });
  if (!storedToken || storedToken.revokedAt || storedToken.expiresAt <= new Date()) {
    throw httpError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(storedToken.user);
  if (!user) {
    throw httpError(401, "User no longer exists");
  }

  const nextRefreshToken = createOpaqueToken();
  const nextHash = hashToken(nextRefreshToken);

  storedToken.revokedAt = new Date();
  storedToken.replacedByTokenHash = nextHash;
  await storedToken.save();

  await RefreshToken.create({
    user: user._id,
    tokenHash: nextHash,
    expiresAt: getRefreshExpiry(),
  });

  res.json({
    tokens: {
      accessToken: createAccessToken(user),
      refreshToken: nextRefreshToken,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  if (req.body?.refreshToken) {
    await RefreshToken.updateOne(
      { tokenHash: hashToken(req.body.refreshToken), revokedAt: null },
      { $set: { revokedAt: new Date() } }
    );
  }

  res.json({ message: "Logged out" });
});
