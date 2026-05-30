import Achievement from "../models/Achievement.js";

const achievements = [
  {
    key: "first-win",
    name: "First Win",
    description: "Win any DSA game once.",
    icon: "🏁",
    xpReward: 50,
    sortOrder: 1,
  },
  {
    key: "stack-starter",
    name: "Stack Starter",
    description: "Win Alter Stack once.",
    gameSlug: "alter-stack",
    icon: "📦",
    xpReward: 50,
    sortOrder: 2,
  },
  {
    key: "efficient-thinker",
    name: "Efficient Thinker",
    description: "Win Alter Stack in 8 or fewer moves.",
    gameSlug: "alter-stack",
    icon: "⚡",
    xpReward: 75,
    sortOrder: 3,
  },
  {
    key: "stack-master-10",
    name: "Stack Master",
    description: "Win 10 Alter Stack games.",
    gameSlug: "alter-stack",
    icon: "🏆",
    xpReward: 150,
    sortOrder: 4,
  },
  {
    key: "tree-apprentice",
    name: "Tree Apprentice",
    description: "Place at least 10 BSTree nodes in one attempt.",
    gameSlug: "bstree",
    icon: "🌳",
    xpReward: 50,
    sortOrder: 5,
  },
  {
    key: "tree-builder",
    name: "Tree Builder",
    description: "Fill all 15 BSTree nodes in one attempt.",
    gameSlug: "bstree",
    icon: "✅",
    xpReward: 125,
    sortOrder: 6,
  },
];

export const seedAchievements = async () => {
  await Promise.all(
    achievements.map((achievement) =>
      Achievement.updateOne(
        { key: achievement.key },
        { $set: achievement },
        { upsert: true, runValidators: true }
      )
    )
  );
};
