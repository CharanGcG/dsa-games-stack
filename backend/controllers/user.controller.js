import { asyncHandler } from "../middleware/asyncHandler.js";
import { assertOneOf } from "../middleware/validate.js";

const allowedProfileFields = [
  "username",
  "avatarUrl",
  "bio",
  "preferredDifficulty",
  "profileVisibility",
];

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toSafeObject() });
});

export const updateMe = asyncHandler(async (req, res) => {
  const updates = {};

  for (const field of allowedProfileFields) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }

  if (updates.preferredDifficulty) {
    assertOneOf(updates.preferredDifficulty, ["easy", "medium", "hard"], "preferredDifficulty");
  }

  if (updates.profileVisibility) {
    assertOneOf(updates.profileVisibility, ["public", "private"], "profileVisibility");
  }

  Object.assign(req.user, updates);
  await req.user.save();

  res.json({ user: req.user.toSafeObject() });
});
