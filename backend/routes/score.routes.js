import { Router } from "express";
import { getMyBestScores, getMyScores, submitScore } from "../controllers/score.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, submitScore);
router.get("/me", requireAuth, getMyScores);
router.get("/me/best", requireAuth, getMyBestScores);

export default router;
