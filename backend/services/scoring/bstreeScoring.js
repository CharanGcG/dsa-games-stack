import { assertNumberRange } from "../../middleware/validate.js";
import { httpError } from "../../utils/httpError.js";

export const scoreBSTree = ({ stats }) => {
  const { occupied, skipped, totalNodes = 15 } = stats || {};

  assertNumberRange(totalNodes, "totalNodes", 1, 31);
  assertNumberRange(occupied, "occupied", 0, totalNodes);
  assertNumberRange(skipped, "skipped", 0, totalNodes);

  if (occupied + skipped > totalNodes) {
    throw httpError(400, "occupied plus skipped cannot exceed totalNodes");
  }

  const normalized = occupied / totalNodes;

  return {
    score: Math.round(Math.pow(normalized, 2) * 100),
    won: occupied === totalNodes,
    normalizedStats: {
      occupied,
      skipped,
      totalNodes,
    },
  };
};
