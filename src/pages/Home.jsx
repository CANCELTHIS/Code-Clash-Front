import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ArenaCard from "../components/ArenaCard";
import CompletedArenaCard from "../components/CompletedArenaCard";
import Leaderboard from "../components/Leaderboard";
import { arenas, matchmaking } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import MatchmakingQueue from "../components/MatchmakingQueue";

const Home = () => {
  const [arenaList, setArenaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming");
  const [joinedArenas, setJoinedArenas] = useState(new Set());
  const [quickMatching, setQuickMatching] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchArenas();
  }, [filter]);

  const fetchArenas = async () => {
    try {
      const response = await arenas.getAll(filter);
      setArenaList(response.data);
    } catch (error) {
      console.error("Failed to fetch arenas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinArena = async (arenaId) => {
    try {
      await arenas.join(arenaId);
      setJoinedArenas((prev) => new Set([...prev, arenaId]));
      fetchArenas();
    } catch (error) {
      console.error("Failed to join arena:", error);
    }
  };

  const handleQuickMatch = () => {
    console.log("Quick match clicked, user:", user);
    setShowQueue(true);
  };

  const handleMatchFound = (arenaId) => {
    console.log("Match found, navigating to arena:", arenaId);
    setShowQueue(false);
    navigate(`/arena/${arenaId}`);
  };

  const handleCancelQueue = () => {
    setShowQueue(false);
  };

  if (loading) {
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
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-primary mb-4">Code Clash</h1>
        <p className="text-muted text-lg">
          Compete in real-time coding challenges
        </p>
      </motion.div>

      <div className="flex justify-center space-x-4 mb-6">
        {["upcoming", "active", "completed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === status
                ? "bg-primary text-secondary"
                : "bg-accent text-primary hover:bg-muted"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filter === 'completed' ? (
              arenaList.map((arena) => (
                <CompletedArenaCard
                  key={arena.arenaId || arena._id}
                  arena={arena}
                />
              ))
            ) : (
              arenaList.map((arena) => (
                <ArenaCard
                  key={arena.arenaId || arena._id}
                  arena={arena}
                  onJoin={handleJoinArena}
                  isJoined={joinedArenas.has(arena.arenaId || arena._id)}
                />
              ))
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <Leaderboard />
        </div>
      </div>

      {arenaList.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted text-lg">No {filter} arenas found.</p>
        </div>
      )}

      {showQueue && (
        <MatchmakingQueue
          onMatchFound={handleMatchFound}
          onCancel={handleCancelQueue}
        />
      )}
    </div>
  );
};

export default Home;
