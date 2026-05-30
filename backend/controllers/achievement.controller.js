import Achievement from "../models/Achievement.js";
import UserAchievement from "../models/UserAchievement.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const listAchievements = asyncHandler(async (req, res) => {
  const achievements = await Achievement.find({ isActive: true }).sort({
    sortOrder: 1,
    name: 1,
  });

  res.json({ achievements });
});

export const getMyAchievements = asyncHandler(async (req, res) => {
  const achievements = await UserAchievement.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate("achievement");

  res.json({
    achievements: achievements.map((item) => ({
      unlockedAt: item.createdAt,
      ...item.achievement.toObject(),
    })),
  });
});
