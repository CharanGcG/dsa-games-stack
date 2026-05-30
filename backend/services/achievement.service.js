import Achievement from "../models/Achievement.js";
import Score from "../models/Score.js";
import UserAchievement from "../models/UserAchievement.js";

const calculateLevel = (totalXp) => Math.floor(totalXp / 250) + 1;

const unlockAchievements = async (user, keys) => {
  const uniqueKeys = [...new Set(keys)];
  if (uniqueKeys.length === 0) return [];

  const achievements = await Achievement.find({
    key: { $in: uniqueKeys },
    isActive: true,
  });

  const unlocked = [];

  for (const achievement of achievements) {
    const result = await UserAchievement.updateOne(
      { user: user._id, key: achievement.key },
      {
        $setOnInsert: {
          user: user._id,
          achievement: achievement._id,
          key: achievement.key,
        },
      },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      unlocked.push(achievement);
    }
  }

  if (unlocked.length > 0) {
    const earnedXp = unlocked.reduce((sum, achievement) => sum + achievement.xpReward, 0);
    user.totalXp = (user.totalXp || 0) + earnedXp;
    user.level = calculateLevel(user.totalXp);
    await user.save();
  }

  return unlocked;
};

export const evaluateAchievementsForScore = async ({ user, score }) => {
  const keys = [];

  if (score.won) keys.push("first-win");

  if (score.gameSlug === "alter-stack") {
    if (score.won) keys.push("stack-starter");
    if (score.won && score.stats?.moveCount <= 8) keys.push("efficient-thinker");

    const alterWins = await Score.countDocuments({
      user: user._id,
      gameSlug: "alter-stack",
      won: true,
    });

    if (alterWins >= 10) keys.push("stack-master-10");
  }

  if (score.gameSlug === "bstree") {
    if (score.stats?.occupied >= 10) keys.push("tree-apprentice");
    if (score.stats?.occupied >= 15) keys.push("tree-builder");
  }

  return unlockAchievements(user, keys);
};
