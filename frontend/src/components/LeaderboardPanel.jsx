import { useEffect, useState } from "react";
import { getLeaderboard, getMyRank } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const LeaderboardPanel = ({ gameSlug = "alter-stack", difficulty = "easy" }) => {
  const { isLoggedIn, tokens } = useAuth();
  const [rows, setRows] = useState([]);
  const [rank, setRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);

      try {
        const [leaderboardData, rankData] = await Promise.all([
          getLeaderboard(gameSlug, difficulty),
          isLoggedIn
            ? getMyRank(tokens.accessToken, gameSlug, difficulty)
            : Promise.resolve(null),
        ]);

        setRows(leaderboardData.leaderboard || []);
        setRank(rankData?.rank || null);
      } catch {
        setRows([]);
        setRank(null);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [difficulty, gameSlug, isLoggedIn, tokens]);

  return (
    <section className="mx-4 rounded-lg border border-gray-700 bg-gray-900 p-4 shadow-lg sm:mx-10">
      <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-yellow-400">Leaderboard</h2>
          <p className="text-sm text-gray-400">
            {gameSlug} / {difficulty}
          </p>
        </div>
        <p className="text-sm text-cyan-300">
          {rank ? `Your rank: #${rank}` : isLoggedIn ? "Play to rank" : "Login to see your rank"}
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading leaderboard...</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-gray-400">No saved scores yet.</p>
      ) : (
        <div className="space-y-2">
          {rows.slice(0, 5).map((row) => (
            <div
              key={row._id}
              className="flex items-center justify-between rounded-lg bg-gray-800 px-3 py-2 text-sm"
            >
              <span className="font-semibold text-white">
                #{row.rank} {row.user?.username || "Player"}
              </span>
              <span className="text-yellow-300">{row.score}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default LeaderboardPanel;
