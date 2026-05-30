import { scoreAlterStack } from "./alterStackScoring.js";
import { scoreBSTree } from "./bstreeScoring.js";
import { httpError } from "../../utils/httpError.js";

const scorers = {
  "alter-stack": scoreAlterStack,
  bstree: scoreBSTree,
};

export const scoreGameAttempt = ({ gameSlug, difficulty, stats }) => {
  const scorer = scorers[gameSlug];
  if (!scorer) {
    throw httpError(400, `No scoring service registered for game: ${gameSlug}`);
  }

  return scorer({ difficulty, stats });
};
