import mongoose from "mongoose";

const userAchievementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    achievement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Achievement",
      required: true,
    },
    key: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
  },
  { timestamps: true }
);

userAchievementSchema.index({ user: 1, key: 1 }, { unique: true });

const UserAchievement = mongoose.model("UserAchievement", userAchievementSchema);

export default UserAchievement;
