import Game from "../models/Game.js";
import Score from "../models/Score.js";
import User from "../models/User.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { httpError } from "../utils/httpError.js";

const gameFields = [
  "slug",
  "name",
  "description",
  "status",
  "isMultiplayer",
  "difficultyModes",
  "scoringVersion",
  "rules",
  "thumbnail",
  "sortOrder",
];

export const upsertGame = asyncHandler(async (req, res) => {
  const slug = String(req.params.slug || req.body.slug || "").trim().toLowerCase();
  if (!slug) throw httpError(400, "Game slug is required");

  const updates = {};
  for (const field of gameFields) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }
  updates.slug = slug;

  const game = await Game.findOneAndUpdate(
    { slug },
    { $set: updates },
    { new: true, upsert: true, runValidators: true }
  );

  res.json({ game });
});

export const listUsers = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 50), 100);
  const users = await User.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("-passwordHash");

  res.json({ users });
});

export const listSuspiciousScores = asyncHandler(async (req, res) => {
  const scores = await Score.find({
    $or: [
      { score: { $gte: 500 } },
      { "stats.timeLeft": { $gte: 91 } },
      { "stats.moveCount": { $lte: 1 }, won: true },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("user", "username email")
    .populate("game", "slug name");

  res.json({ scores });
});
