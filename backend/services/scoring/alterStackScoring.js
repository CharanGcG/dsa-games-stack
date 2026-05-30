import { assertNumberRange } from "../../middleware/validate.js";
import { httpError } from "../../utils/httpError.js";

const DIFFICULTY_CONFIG = {
  easy: { base: 50, maxTime: 30 },
  medium: { base: 100, maxTime: 45 },
  hard: { base: 150, maxTime: 90 },
};

export const scoreAlterStack = ({ difficulty, stats }) => {
  const config = DIFFICULTY_CONFIG[difficulty];
  if (!config) throw httpError(400, "Unsupported Alter Stack difficulty");

  const {
    target,
    finalSum,
    pushes,
    pops,
    stackLength,
    timeLeft,
    won = finalSum === target && stackLength >= 5,
  } = stats || {};

  assertNumberRange(target, "target", -1000, 1000);
  assertNumberRange(finalSum, "finalSum", -1000, 1000);
  assertNumberRange(pushes, "pushes", 0, 10);
  assertNumberRange(pops, "pops", 0, 10);
  assertNumberRange(stackLength, "stackLength", 0, 10);
  assertNumberRange(timeLeft, "timeLeft", 0, config.maxTime);

  if (pops > pushes) {
    throw httpError(400, "pops cannot be greater than pushes");
  }

  if (stackLength !== pushes - pops) {
    throw httpError(400, "stackLength must equal pushes minus pops");
  }

  if (won && (finalSum !== target || stackLength < 5)) {
    throw httpError(400, "Winning Alter Stack attempts must match target with at least 5 stack items");
  }

  if (!won) {
    return {
      score: 0,
      won: false,
      normalizedStats: {
        target,
        finalSum,
        pushes,
        pops,
        stackLength,
        timeLeft,
      },
    };
  }

  const moveCount = Math.max(pushes + pops, 1);
  const efficiency = (1 / moveCount) * 100;
  const timeBonus = (timeLeft / 100) * 50;

  return {
    score: Math.round(config.base + efficiency + timeBonus),
    won: true,
    normalizedStats: {
      target,
      finalSum,
      pushes,
      pops,
      stackLength,
      timeLeft,
      moveCount,
    },
  };
};
