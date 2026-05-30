import mongoose from "mongoose";
import { env } from "./env.js";

const connectDB = async () => {
  if (!env.mongoUri) {
    if (env.nodeEnv === "production") {
      throw new Error("MONGO_URI is required in production");
    }
    console.warn("MONGO_URI is not configured. Database-backed routes will not work.");
    return null;
  }

  try {
    const conn = await mongoose.connect(env.mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    if (env.nodeEnv === "production") {
      throw err;
    }
    return null;
  }
};

export default connectDB;
