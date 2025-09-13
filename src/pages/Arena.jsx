import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CodeEditor from "../components/CodeEditor";
import Timer from "../components/Timer";
import CountdownTimer from "../components/CountdownTimer";
import GameResult from "../components/GameResult";
import Celebration from "../components/Celebration";
import Chat from "../components/Chat";
import MatchStartAnimation from "../components/MatchStartAnimation";
import { arenas } from "../utils/api";
import { useAuth } from "../hooks/useAuth.jsx";
import socketService from "../utils/socket";

const Arena = () => {
  const { arenaId } = useParams();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [arena, setArena] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [matchStarted, setMatchStarted] = useState(false);
  const [matchStartTime, setMatchStartTime] = useState(null);
  const [showMatchStart, setShowMatchStart] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [finalTime, setFinalTime] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [opponentFinished, setOpponentFinished] = useState(false);
  const [showCelebration, setShowCelebration] = useState(null);
  const [matchEnded, setMatchEnded] = useState(false);
  const [winnerTime, setWinnerTime] = useState(null);

  // Debug showCelebration changes
  useEffect(() => {
    console.log("showCelebration changed:", showCelebration);
  }, [showCelebration]);

  useEffect(() => {
    fetchArena();
    connectSocket();

    return () => {
      socketService.disconnect();
    };
  }, [arenaId]);

  // Separate effect to check if arena is active after fetching
  useEffect(() => {
    if (arena && arena.status === "active") {
      console.log("🏁 JOINING ACTIVE MATCH!");
      setMatchStarted(true);
      setMatchStartTime(new Date(arena.startTime));
    }
  }, [arena]);

  const fetchArena = async () => {
    try {
      const response = await arenas.getById(arenaId);
      setArena(response.data);
    } catch (error) {
      console.error("Failed to fetch arena:", error);
    }
  };

  const connectSocket = () => {
    const socket = socketService.connect();

    socket.on("match_start", (data) => {
      console.log("🏁 MATCH STARTED!", data);
      setShowMatchStart(true);
      setTimeout(() => {
        setShowMatchStart(false);
        setMatchStarted(true);
        setMatchStartTime(new Date(data.startTime));
      }, 3000);
    });

    socket.on("arena_activated", (data) => {
      console.log("⏰ ARENA ACTIVATED!", data);
      if (data.arenaId === arenaId) {
        setArena((prev) => ({ ...prev, status: "active" }));
        setMatchStarted(true);
        setMatchStartTime(new Date(data.startTime));
      }
    });

    socket.on("you_won", (data) => {
      console.log("🏆 YOU WON!", data);
      setShowCelebration("winner");
      setMatchEnded(true);
      window.gameTokens = data.tokensAwarded;
      refreshUser();
    });

    socket.on("you_lost", (data) => {
      console.log("😔 YOU LOST!", data);
      setShowCelebration("loser");
      setMatchEnded(true);
      refreshUser();
    });

    socket.on("match_ended", (data) => {
      console.log("⏹️ MATCH ENDED", data);
      setMatchEnded(true);
    });

    if (user) {
      socketService.joinMatch(arenaId, user.userId || user._id, "match-123");
    }
  };

  const handleCodeChange = (newCode, newLanguage) => {
    console.log(
      "Code changed:",
      newCode?.length,
      "chars, language:",
      newLanguage
    );
    setCode(newCode);
    setLanguage(newLanguage);
  };

  const handleSubmit = async () => {
    if (!code.trim() || matchEnded) return;

    setLoading(true);
    const completionTime = Date.now() - new Date(arena.startTime).getTime();

    try {
      const response = await arenas.submitCode(arenaId, code, language);
      setResults(response.data);
      setHasSubmitted(true);
      setFinalTime(completionTime);

      if (response.data.allPassed) {
        console.log("✅ All tests passed! Notifying server...");
        socketService.socket.emit("player_finished", {
          arenaId,
          userId: user.userId || user._id,
          completionTime,
          passed: true,
          code: code,
        });
      }
    } catch (error) {
      console.error("Submit failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!arena) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              {arena.title}
            </h1>
            <p className="text-muted mb-4">{arena.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted mb-1">
              {matchEnded
                ? "Final Time"
                : matchStarted
                ? "Starts in"
                : arena.status === "upcoming"
                ? "Match starts in:"
                : "Match Started"}
            </div>
            {arena.status === "upcoming" ? (
              <CountdownTimer
                startTime={arena.startTime}
                onCountdownEnd={() => {
                  setMatchStarted(true);
                  setMatchStartTime(new Date());
                  setArena((prev) => ({ ...prev, status: "active" }));
                }}
              />
            ) : (
              <Timer
                startTime={matchStartTime || new Date()}
                isRunning={matchStarted && !matchEnded}
                finalTime={finalTime}
                matchEnded={matchEnded}
              />
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex space-x-4 text-sm">
            <span className="bg-accent text-primary px-3 py-1 rounded">
              Prize: {arena.tokenPrize} tokens
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CodeEditor
            arenaId={arenaId}
            userId={user?.userId || user?._id}
            onCodeChange={handleCodeChange}
            challenge={arena}
          />

          <div className="mt-4">
            <button
              onClick={handleSubmit}
              disabled={loading || !code.trim() || matchEnded}
              className="w-full bg-primary text-secondary py-3 px-4 rounded-lg font-medium hover:bg-accent hover:text-primary transition-colors disabled:opacity-50"
            >
              {matchEnded
                ? "Match Ended"
                : loading
                ? "Submitting..."
                : "Submit Code"}
            </button>

            {matchEnded && (
              <button
                onClick={() => navigate("/")}
                className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors mt-2"
              >
                Join Another Arena
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Chat arenaId={arenaId} />

          <div className="bg-white rounded-lg shadow-lg p-6">
            {gameResult ? (
              <GameResult
                result={{
                  ...gameResult,
                  currentUserId: user?.userId || user?._id,
                }}
                userTime={finalTime}
              />
            ) : (
              <>
                <h3 className="text-xl font-bold text-primary mb-4">
                  Test Results
                </h3>

                {results ? (
                  <div className="space-y-3">
                    <div className="text-lg font-medium">
                      Score: {results.score}/{results.results.length}
                    </div>

                    {results.results.map((result, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded border ${
                          result.passed
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">
                            Test Case {index + 1}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              result.passed
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {result.passed ? "PASSED" : "FAILED"}
                          </span>
                        </div>
                        <div className="text-sm text-muted mt-1">
                          Output: {result.output}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">
                    Submit your code to see test results
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showMatchStart && (
        <MatchStartAnimation onComplete={() => setShowMatchStart(false)} />
      )}

      {showCelebration && (
        <Celebration
          type={showCelebration}
          onComplete={() => setShowCelebration(null)}
          tokensAwarded={window.gameTokens}
          winTime={showCelebration === "winner" ? finalTime : null}
          opponentTime={showCelebration === "loser" ? winnerTime : null}
        />
      )}
    </div>
  );
};

export default Arena;
