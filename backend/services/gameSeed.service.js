import Game from "../models/Game.js";

const games = [
  {
    slug: "alter-stack",
    name: "Alter Stack",
    description: "Push and pop elements to match a target sum.",
    status: "live",
    isMultiplayer: false,
    difficultyModes: ["easy", "medium", "hard"],
    scoringVersion: 1,
    sortOrder: 1,
    rules: [
      "Select difficulty and start the timer.",
      "Build a stack that adds up exactly to the target sum.",
      "Pushed numbers alternate signs, starting positive.",
      "Submit with at least 5 numbers in the stack.",
      "Fewer moves and more time left improve your score.",
    ],
  },
  {
    slug: "bstree",
    name: "BSTree",
    description: "Place numbers into valid Binary Search Tree positions.",
    status: "beta",
    isMultiplayer: false,
    difficultyModes: ["easy"],
    scoringVersion: 1,
    sortOrder: 2,
    rules: [
      "Place each number in a node that maintains the BST property.",
      "Green nodes are valid placements.",
      "Red nodes are invalid placements.",
      "You can skip a number, but cannot return to it.",
      "Score depends on how many valid placements you make.",
    ],
  },
  {
    slug: "queue-stacks",
    name: "Queue Stacks",
    description: "Queue and stack based multiplayer game.",
    status: "coming-soon",
    isMultiplayer: true,
    difficultyModes: ["easy", "medium", "hard"],
    scoringVersion: 1,
    sortOrder: 3,
    rules: [],
  },
];

export const seedGames = async () => {
  const allowedSlugs = games.map((game) => game.slug);

  await Promise.all(
    games.map((game) =>
      Game.updateOne(
        { slug: game.slug },
        { $set: game },
        { upsert: true, runValidators: true }
      )
    )
  );

  await Game.deleteMany({ slug: { $nin: allowedSlugs } });
};
