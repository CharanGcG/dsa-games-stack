import Score from "../models/Score.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const getPeriodStart = (period) => {
  const now = new Date();
  if (period === "daily") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  if (period === "weekly") {
    const start = new Date(now);
    start.setDate(now.getDate() - 7);
    return start;
  }
  if (period === "monthly") {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
  return null;
};

export const getLeaderboard = asyncHandler(async (req, res) => {
  const gameSlug = req.params.gameSlug.toLowerCase();
  const difficulty = req.params.difficulty?.toLowerCase();
  const limit = Math.min(Number(req.query.limit || 25), 100);
  const periodStart = getPeriodStart(req.query.period);

  const match = { gameSlug };
  if (difficulty) match.difficulty = difficulty;
  if (periodStart) match.createdAt = { $gte: periodStart };

  const rows = await Score.aggregate([
    { $match: match },
    { $sort: { score: -1, createdAt: 1 } },
    {
      $group: {
        _id: "$user",
        bestScore: { $first: "$$ROOT" },
      },
    },
    { $replaceRoot: { newRoot: "$bestScore" } },
    { $sort: { score: -1, createdAt: 1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 1,
        gameSlug: 1,
        difficulty: 1,
        score: 1,
        won: 1,
        stats: 1,
        createdAt: 1,
        user: {
          _id: "$user._id",
          username: "$user.username",
          avatarUrl: "$user.avatarUrl",
        },
      },
    },
  ]);

  res.json({
    leaderboard: rows.map((row, index) => ({
      rank: index + 1,
      ...row,
    })),
  });
});
