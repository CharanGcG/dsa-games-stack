import { Router } from "express";
import { getMe, getMyProgress, updateMe } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/me", requireAuth, getMe);
router.get("/me/progress", requireAuth, getMyProgress);
router.patch("/me", requireAuth, updateMe);

export default router;
