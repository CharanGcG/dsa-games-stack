import app from "./app.js";
import connectDB from "./config/db.js";
import { assertProductionEnv, env } from "./config/env.js";
import { seedGames } from "./services/gameSeed.service.js";

const startServer = async () => {
  assertProductionEnv();

  const connection = await connectDB();
  if (connection) {
    await seedGames();
    console.log("Game registry seeded");
  }

  app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
