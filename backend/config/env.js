import dotenv from "dotenv";

dotenv.config();

export const env = {
  mongoUri: process.env.MONGO_URI,
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  accessTokenSecret:
    process.env.ACCESS_TOKEN_SECRET || "dev-access-token-secret-change-me",
  refreshTokenSecret:
    process.env.REFRESH_TOKEN_SECRET || "dev-refresh-token-secret-change-me",
  accessTokenTtlSeconds: Number(process.env.ACCESS_TOKEN_TTL_SECONDS || 900),
  refreshTokenTtlSeconds: Number(
    process.env.REFRESH_TOKEN_TTL_SECONDS || 60 * 60 * 24 * 30
  ),
};

export const assertProductionEnv = () => {
  if (env.nodeEnv !== "production") return;

  const missing = [];
  if (!env.mongoUri) missing.push("MONGO_URI");
  if (!process.env.ACCESS_TOKEN_SECRET) missing.push("ACCESS_TOKEN_SECRET");
  if (!process.env.REFRESH_TOKEN_SECRET) missing.push("REFRESH_TOKEN_SECRET");

  if (missing.length > 0) {
    throw new Error(`Missing production env vars: ${missing.join(", ")}`);
  }
};
