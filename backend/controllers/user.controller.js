import { asyncHandler } from "../middleware/asyncHandler.js";
import { assertOneOf } from "../middleware/validate.js";
import Score from "../models/Score.js";
import UserAchievement from "../models/UserAchievement.js";

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

export const getMyProgress = asyncHandler(async (req, res) => {
  const [recentScores, bestScores, perGameStats, achievements] = await Promise.all([
    Score.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("game", "slug name status"),
    Score.aggregate([
      { $match: { user: req.user._id } },
      { $sort: { score: -1, createdAt: 1 } },
      {
        $group: {
          _id: { gameSlug: "$gameSlug", difficulty: "$difficulty" },
          score: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$score" } },
      { $sort: { gameSlug: 1, difficulty: 1 } },
    ]),
    Score.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$gameSlug",
          attempts: { $sum: 1 },
          wins: { $sum: { $cond: ["$won", 1, 0] } },
          bestScore: { $max: "$score" },
          totalScore: { $sum: "$score" },
          lastPlayedAt: { $max: "$createdAt" },
        },
      },
      { $sort: { lastPlayedAt: -1 } },
    ]),
    UserAchievement.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("achievement"),
  ]);

  res.json({
    user: req.user.toSafeObject(),
    recentScores,
    bestScores,
    perGameStats,
    achievements: achievements.map((item) => ({
      unlockedAt: item.createdAt,
      ...item.achievement.toObject(),
    })),
  });
});
