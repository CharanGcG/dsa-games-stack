import { Router } from "express";
import {
  listSuspiciousScores,
  listUsers,
  upsertGame,
} from "../controllers/admin.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth, requireAdmin);

router.put("/games/:slug", upsertGame);
router.post("/games", upsertGame);
router.get("/users", listUsers);
router.get("/scores/suspicious", listSuspiciousScores);

export default router;
