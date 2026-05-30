import { Router } from "express";
import { getLeaderboard } from "../controllers/leaderboard.controller.js";

const router = Router();

router.get("/:gameSlug", getLeaderboard);
router.get("/:gameSlug/:difficulty", getLeaderboard);

export default router;
