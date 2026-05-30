import { Router } from "express";
import {
  getMyAchievements,
  listAchievements,
} from "../controllers/achievement.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", listAchievements);
router.get("/me", requireAuth, getMyAchievements);

export default router;
