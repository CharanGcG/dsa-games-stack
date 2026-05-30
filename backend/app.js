import cors from "cors";
import express from "express";
import achievementRoutes from "./routes/achievement.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import gameRoutes from "./routes/game.routes.js";
import gameSessionRoutes from "./routes/gameSession.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import scoreRoutes from "./routes/score.routes.js";
import userRoutes from "./routes/user.routes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { authRateLimit, corsOptions, scoreRateLimit, securityHeaders } from "./middleware/security.js";

const app = express();

app.set("trust proxy", 1);
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({
    message: "DSA Games API is running",
    version: "1.0.0",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRateLimit, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/game-sessions", scoreRateLimit, gameSessionRoutes);
app.use("/api/scores", scoreRateLimit, scoreRoutes);
app.use("/api/leaderboards", leaderboardRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
