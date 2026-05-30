import Game from "../models/Game.js";
import Score from "../models/Score.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireFields } from "../middleware/validate.js";
import { evaluateAchievementsForScore } from "../services/achievement.service.js";
import { scoreGameAttempt } from "../services/scoring/index.js";
import { validateSessionAttempt } from "../services/gameSession.service.js";
import { httpError } from "../utils/httpError.js";

const updateUserStats = async (user, score) => {
  const stats = user.stats || {};
  const playedAt = new Date();

  stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
  stats.wins = (stats.wins || 0) + (score.won ? 1 : 0);
  stats.totalScore = (stats.totalScore || 0) + score.score;
  stats.bestScore = Math.max(stats.bestScore || 0, score.score);
  stats.lastPlayedAt = playedAt;

  if (score.won) {
    stats.currentStreak = (stats.currentStreak || 0) + 1;
    stats.highestStreak = Math.max(stats.highestStreak || 0, stats.currentStreak);
  } else {
    stats.currentStreak = 0;
  }

  user.stats = stats;
  await user.save();
};

export const submitScore = asyncHandler(async (req, res) => {
  requireFields(req.body, ["sessionId", "actions"]);

  const { session, stats } = await validateSessionAttempt({
    user: req.user,
    sessionId: req.body.sessionId,
    actions: req.body.actions,
    timeLeft: req.body.timeLeft,
  });

  const gameSlug = session.gameSlug;
  const difficulty = session.difficulty;

  const game = await Game.findOne({ slug: gameSlug });
  if (!game) throw httpError(404, "Game not found");
  if (game.status === "coming-soon") {
    throw httpError(400, "Scores cannot be submitted for coming-soon games");
  }
  if (!game.difficultyModes.includes(difficulty)) {
    throw httpError(400, "Difficulty is not available for this game");
  }

  const result = scoreGameAttempt({
    gameSlug,
    difficulty,
    stats,
  });

  const score = await Score.create({
    user: req.user._id,
    game: game._id,
    gameSlug,
    difficulty,
    score: result.score,
    won: result.won,
    stats: result.normalizedStats,
    scoringVersion: game.scoringVersion,
  });

  await updateUserStats(req.user, score);
  const unlockedAchievements = await evaluateAchievementsForScore({
    user: req.user,
    score,
  });

  res.status(201).json({ score, unlockedAchievements });
});

export const getMyScores = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 20), 100);
  const scores = await Score.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("game", "slug name status");

  res.json({ scores });
});

export const getMyBestScores = asyncHandler(async (req, res) => {
  const scores = await Score.aggregate([
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
  ]);

  res.json({ scores });
});
