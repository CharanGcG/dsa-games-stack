import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import gameRoutes from "./routes/game.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import scoreRoutes from "./routes/score.routes.js";
import userRoutes from "./routes/user.routes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
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

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/leaderboards", leaderboardRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
