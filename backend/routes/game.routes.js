import { Router } from "express";
import { getGame, listGames } from "../controllers/game.controller.js";

const router = Router();

router.get("/", listGames);
router.get("/:slug", getGame);

export default router;
