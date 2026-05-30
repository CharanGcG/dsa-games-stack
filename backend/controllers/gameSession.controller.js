import { asyncHandler } from "../middleware/asyncHandler.js";
import { assertOneOf, requireFields } from "../middleware/validate.js";
import { createGameSessionForUser } from "../services/gameSession.service.js";

export const createGameSession = asyncHandler(async (req, res) => {
  requireFields(req.body, ["gameSlug", "difficulty"]);

  const gameSlug = String(req.body.gameSlug).trim().toLowerCase();
  const difficulty = String(req.body.difficulty).trim().toLowerCase();
  assertOneOf(difficulty, ["easy", "medium", "hard"], "difficulty");

  const { session, game } = await createGameSessionForUser({
    user: req.user,
    gameSlug,
    difficulty,
  });

  res.status(201).json({
    session: {
      id: session._id,
      gameSlug: session.gameSlug,
      difficulty: session.difficulty,
      payload: session.payload,
      expiresAt: session.expiresAt,
    },
    game,
  });
});
