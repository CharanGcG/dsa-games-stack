import mongoose from "mongoose";
import { env } from "./env.js";

const connectDB = async () => {
  if (!env.mongoUri) {
    console.warn("MONGO_URI is not configured. Database-backed routes will not work.");
    return null;
  }

  try {
    const conn = await mongoose.connect(env.mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    return null;
  }
};

export default connectDB;
