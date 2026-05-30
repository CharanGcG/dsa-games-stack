import { Router } from "express";
import { getMe, updateMe } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/me", requireAuth, getMe);
router.patch("/me", requireAuth, updateMe);

export default router;
