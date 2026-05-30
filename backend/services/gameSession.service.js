import Game from "../models/Game.js";
import GameSession from "../models/GameSession.js";
import { httpError } from "../utils/httpError.js";

const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const generateAlterStackPayload = (difficulty) => {
  const values = shuffle(Array.from({ length: 20 }, (_, index) => index + 1));
  const pool = values.slice(0, 10);
  let subsetSize;

  if (difficulty === "hard") subsetSize = 10;
  else if (difficulty === "medium") subsetSize = Math.floor(Math.random() * 4) + 6;
  else subsetSize = Math.floor(Math.random() * 6) + 5;

  const target = pool
    .slice(0, subsetSize)
    .map((value, index) => (index % 2 === 0 ? value : -value))
    .reduce((sum, value) => sum + value, 0);

  const duration = difficulty === "hard" ? 90 : difficulty === "medium" ? 45 : 30;

  return {
    pool: shuffle(pool),
    target,
    duration,
  };
};

const generateBSTreePayload = () => ({
  numbers: shuffle(Array.from({ length: 101 }, (_, index) => index)).slice(0, 15),
  totalNodes: 15,
});

export const createGameSessionForUser = async ({ user, gameSlug, difficulty }) => {
  const game = await Game.findOne({ slug: gameSlug });
  if (!game) throw httpError(404, "Game not found");
  if (game.status === "coming-soon") {
    throw httpError(400, "Cannot start a session for a coming-soon game");
  }
  if (!game.difficultyModes.includes(difficulty)) {
    throw httpError(400, "Difficulty is not available for this game");
  }

  const payload =
    gameSlug === "alter-stack"
      ? generateAlterStackPayload(difficulty)
      : gameSlug === "bstree"
      ? generateBSTreePayload()
      : null;

  if (!payload) throw httpError(400, `Sessions are not supported for ${gameSlug}`);

  const session = await GameSession.create({
    user: user._id,
    game: game._id,
    gameSlug,
    difficulty,
    payload,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000),
  });

  return { session, game };
};

const getDisabledNodes = (tree, currentValue) => {
  const filled = tree
    .map((value, index) => ({ value, index }))
    .filter((item) => item.value !== null)
    .sort((a, b) => a.value - b.value);

  return tree.map((value, index) => {
    if (value !== null) return true;

    const leftFilled = filled.filter((item) => item.index < index);
    const rightFilled = filled.filter((item) => item.index > index);
    const maxLeft = leftFilled.length
      ? Math.max(...leftFilled.map((item) => item.value))
      : -Infinity;
    const minRight = rightFilled.length
      ? Math.min(...rightFilled.map((item) => item.value))
      : Infinity;

    return !(currentValue > maxLeft && currentValue < minRight);
  });
};

const replayAlterStack = (session, actions) => {
  if (!Array.isArray(actions) || actions.length > 200) {
    throw httpError(400, "Alter Stack actions must be an array of 200 or fewer moves");
  }

  const stack = [];
  const activeIndexes = [];
  let pushes = 0;
  let pops = 0;

  for (const action of actions) {
    if (action.type === "push") {
      const index = Number(action.index);
      if (!Number.isInteger(index) || index < 0 || index >= session.payload.pool.length) {
        throw httpError(400, "Invalid push index");
      }
      if (activeIndexes.includes(index)) {
        throw httpError(400, "Cannot push a value already in the active stack");
      }

      const rawValue = session.payload.pool[index];
      stack.push(stack.length % 2 === 0 ? rawValue : -rawValue);
      activeIndexes.push(index);
      pushes += 1;
    } else if (action.type === "pop") {
      if (stack.length === 0) throw httpError(400, "Cannot pop an empty stack");
      stack.pop();
      activeIndexes.pop();
      pops += 1;
    } else {
      throw httpError(400, "Invalid Alter Stack action");
    }
  }

  const finalSum = stack.reduce((sum, value) => sum + value, 0);

  const elapsedSeconds = Math.floor((Date.now() - session.createdAt.getTime()) / 1000);
  const serverTimeLeft = Math.max(0, session.payload.duration - elapsedSeconds);
  const claimedTimeLeft = Math.max(0, Number(actions.timeLeft || 0));

  return {
    target: session.payload.target,
    finalSum,
    pushes,
    pops,
    stackLength: stack.length,
    timeLeft: Math.min(claimedTimeLeft, serverTimeLeft),
  };
};

const replayBSTree = (session, actions) => {
  if (!Array.isArray(actions) || actions.length !== session.payload.totalNodes) {
    throw httpError(400, "BSTree requires exactly 15 actions");
  }

  const tree = Array(session.payload.totalNodes).fill(null);
  let occupied = 0;
  let skipped = 0;

  actions.forEach((action, currentIndex) => {
    const currentValue = session.payload.numbers[currentIndex];

    if (action.type === "skip") {
      skipped += 1;
      return;
    }

    if (action.type !== "place") throw httpError(400, "Invalid BSTree action");

    const index = Number(action.index);
    if (!Number.isInteger(index) || index < 0 || index >= tree.length) {
      throw httpError(400, "Invalid BSTree node index");
    }

    const disabledNodes = getDisabledNodes(tree, currentValue);
    if (disabledNodes[index]) {
      throw httpError(400, "BSTree placement violates the game rules");
    }

    tree[index] = currentValue;
    occupied += 1;
  });

  return {
    occupied,
    skipped,
    totalNodes: session.payload.totalNodes,
  };
};

export const validateSessionAttempt = async ({ user, sessionId, actions, timeLeft }) => {
  const session = await GameSession.findById(sessionId);
  if (!session) throw httpError(404, "Game session not found");
  if (session.user.toString() !== user._id.toString()) {
    throw httpError(403, "Game session belongs to another user");
  }
  if (session.usedAt) throw httpError(400, "Game session has already been submitted");
  if (session.expiresAt <= new Date()) throw httpError(400, "Game session expired");

  const actionLog = Array.isArray(actions) ? [...actions] : actions;
  if (Array.isArray(actionLog)) actionLog.timeLeft = timeLeft;

  const stats =
    session.gameSlug === "alter-stack"
      ? replayAlterStack(session, actionLog)
      : session.gameSlug === "bstree"
      ? replayBSTree(session, actionLog)
      : null;

  if (!stats) throw httpError(400, "Unsupported game session");

  session.usedAt = new Date();
  await session.save();

  return { session, stats };
};
