import { Router } from "express";
import { createGameSession } from "../controllers/gameSession.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, createGameSession);

export default router;
