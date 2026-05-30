import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["live", "beta", "coming-soon"],
      default: "beta",
    },
    isMultiplayer: {
      type: Boolean,
      default: false,
    },
    difficultyModes: {
      type: [String],
      enum: ["easy", "medium", "hard"],
      default: ["easy", "medium", "hard"],
    },
    scoringVersion: {
      type: Number,
      default: 1,
    },
    rules: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
      default: "",
    },
    sortOrder: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true }
);

const Game = mongoose.model("Game", gameSchema);

export default Game;
