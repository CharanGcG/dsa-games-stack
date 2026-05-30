import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    key: {
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
    gameSlug: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    xpReward: {
      type: Number,
      default: 25,
      min: 0,
    },
    sortOrder: {
      type: Number,
      default: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Achievement = mongoose.model("Achievement", achievementSchema);

export default Achievement;
