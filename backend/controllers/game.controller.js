import Game from "../models/Game.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { httpError } from "../utils/httpError.js";

export const listGames = asyncHandler(async (req, res) => {
  const games = await Game.find().sort({ sortOrder: 1, name: 1 });
  res.json({ games });
});

export const getGame = asyncHandler(async (req, res) => {
  const game = await Game.findOne({ slug: req.params.slug.toLowerCase() });
  if (!game) throw httpError(404, "Game not found");

  res.json({ game });
});
