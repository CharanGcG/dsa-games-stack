import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true,
      index: true,
    },
    gameSlug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
      index: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    won: {
      type: Boolean,
      default: false,
      index: true,
    },
    stats: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    scoringVersion: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

scoreSchema.index({ gameSlug: 1, difficulty: 1, score: -1, createdAt: -1 });
scoreSchema.index({ user: 1, gameSlug: 1, difficulty: 1, score: -1 });

const Score = mongoose.model("Score", scoreSchema);

export default Score;
