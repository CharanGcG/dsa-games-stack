import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Header from "../components/Header";
import AuthStatus from "../components/AuthStatus";
import { useAuth } from "../context/AuthContext";
import { getMyProgress } from "../lib/api";

const ProgressPage = () => {
  const { isLoggedIn, tokens, user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;

    const loadProgress = async () => {
      setLoading(true);

      try {
        const data = await getMyProgress(tokens.accessToken);
        setProgress(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [isLoggedIn, tokens]);

  const safeUser = progress?.user || user;
  const stats = safeUser?.stats || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 p-4 text-white audiowide-regular">
      <Header
        appName="Progress"
        rules={[
          "Scores are saved only when you are logged in.",
          "Leaderboards use your best saved score per game and difficulty.",
          "Achievements unlock automatically from saved results.",
        ]}
      />

      <div className="mx-auto mt-6 max-w-6xl space-y-6">
        {!isLoggedIn ? (
          <section className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-center shadow-lg">
            <h2 className="mb-3 text-2xl font-bold text-yellow-400">Login Required</h2>
            <p className="mb-5 text-gray-300">Login or create an account to see saved progress.</p>
            <AuthStatus />
          </section>
        ) : loading ? (
          <p className="text-gray-400">Loading progress...</p>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Level", safeUser?.level || 1],
                ["XP", safeUser?.totalXp || 0],
                ["Games", stats.gamesPlayed || 0],
                ["Best", stats.bestScore || 0],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-gray-800 p-4 shadow-lg">
                  <p className="text-sm text-gray-400">{label}</p>
                  <p className="mt-2 text-3xl font-bold text-yellow-400">{value}</p>
                </div>
              ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                <h2 className="mb-3 text-xl font-bold text-cyan-300">Recent Games</h2>
                {(progress?.recentScores || []).length === 0 ? (
                  <p className="text-sm text-gray-400">No saved games yet.</p>
                ) : (
                  <div className="space-y-2">
                    {progress.recentScores.map((score) => (
                      <div
                        key={score._id}
                        className="flex justify-between rounded-lg bg-gray-800 px-3 py-2 text-sm"
                      >
                        <span>{score.game?.name || score.gameSlug}</span>
                        <span className="text-yellow-300">{score.score}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                <h2 className="mb-3 text-xl font-bold text-cyan-300">Achievements</h2>
                {(progress?.achievements || []).length === 0 ? (
                  <p className="text-sm text-gray-400">No achievements unlocked yet.</p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {progress.achievements.map((achievement) => (
                      <div key={achievement.key} className="rounded-lg bg-gray-800 p-3">
                        <p className="font-bold text-yellow-300">
                          {achievement.icon} {achievement.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">{achievement.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-lg border border-gray-700 bg-gray-900 p-4">
              <h2 className="mb-3 text-xl font-bold text-cyan-300">Per Game</h2>
              {(progress?.perGameStats || []).length === 0 ? (
                <p className="text-sm text-gray-400">No per-game stats yet.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {progress.perGameStats.map((game) => (
                    <div key={game._id} className="rounded-lg bg-gray-800 p-3">
                      <p className="font-bold text-white">{game._id}</p>
                      <p className="text-sm text-gray-300">Attempts: {game.attempts}</p>
                      <p className="text-sm text-gray-300">Wins: {game.wins}</p>
                      <p className="text-sm text-yellow-300">Best: {game.bestScore}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <Link
              to="/"
              className="inline-block rounded-lg bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-500"
            >
              Back Home
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;
