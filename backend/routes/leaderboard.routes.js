import { Router } from "express";
import {
  getLeaderboard,
  getMyLeaderboardRank,
} from "../controllers/leaderboard.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/:gameSlug/:difficulty/me", requireAuth, getMyLeaderboardRank);
router.get("/:gameSlug", getLeaderboard);
router.get("/:gameSlug/:difficulty", getLeaderboard);

export default router;
