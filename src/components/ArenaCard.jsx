import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MdOutlineToken, MdAccessTime } from "react-icons/md";
import { TbMath } from "react-icons/tb";
import { GiSewingString } from "react-icons/gi";
import { TbLogicXnor } from "react-icons/tb";
import { SiThealgorithms } from "react-icons/si";
import { CiBarcode } from "react-icons/ci"; // for default category
import { FaStar } from "react-icons/fa"; // Make sure this is imported for Prize icon

const ArenaCard = ({ arena, onJoin, isJoined }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState("");
  const [canJoin, setCanJoin] = useState(true);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const start = new Date(arena.startTime).getTime();
      const diff = start - now;

      if (arena.status === "completed") {
        setTimeLeft("Completed");
        setCanJoin(false);
      } else if (arena.status === "active") {
        setTimeLeft("Live Match");
        setCanJoin(true);
      } else if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        setCanJoin(true);
      } else {
        setTimeLeft("Started");
        setCanJoin(true);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [arena.startTime, arena.status]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600 bg-green-100";
      case "Medium":
        return "text-yellow-600 bg-yellow-100";
      case "Hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Arrays":
        return <CiBarcode className="text-xl" />;
      case "Strings":
        return <GiSewingString className="text-xl" />;
      case "Math":
        return <TbMath className="text-xl" />;
      case "Logic":
        return <TbLogicXnor className="text-xl" />;
      case "Algorithms":
        return <SiThealgorithms className="text-xl" />;
      default:
        return <CiBarcode className="text-xl" />;
    }
  };

  const handleJoinMatch = async () => {
    await onJoin(arena.arenaId || arena._id);
    navigate(`/arena/${arena.arenaId || arena._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-lg p-6 border border-accent"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-primary">{arena.title}</h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
            arena.difficulty
          )}`}
        >
          {arena.difficulty}
        </span>
      </div>

      <div className="flex items-center space-x-2 mb-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
          {getCategoryIcon(arena.category)}
        </div>
        <span className="text-sm font-medium text-gray-700">
          {arena.category}
        </span>
      </div>

      <p className="text-muted mb-4 text-sm">{arena.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted flex items-center gap-1">
            <MdAccessTime />{" "}
            {arena.status === "active"
              ? "Status:"
              : arena.status === "completed"
              ? "Status:"
              : "Starts in:"}
          </span>
          <span
            className={`text-sm font-medium ${
              arena.status === "active"
                ? "text-green-600"
                : arena.status === "completed"
                ? "text-red-600"
                : canJoin
                ? "text-blue-600"
                : "text-red-600"
            }`}
          >
            {timeLeft}
          </span>
        </div>

        {arena.entryFee > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted flex items-center gap-1">
              <MdOutlineToken /> Entry Fee:
            </span>
            <span className="text-sm font-medium text-red-600">
              {arena.entryFee} tokens
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted flex items-center gap-1">
            <FaStar /> Prize:
          </span>
          <span className="text-sm font-medium text-yellow-600">
            {arena.tokenPrize} tokens
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => onJoin(arena.arenaId || arena._id)}
          disabled={isJoined || !canJoin}
          className={`w-full py-2 px-4 rounded font-medium transition-colors ${
            isJoined || !canJoin
              ? "bg-muted text-secondary cursor-not-allowed"
              : "bg-primary text-secondary hover:bg-accent hover:text-primary"
          }`}
        >
          {!canJoin ? "Started" : isJoined ? "Joined" : "Join Arena"}
        </button>

        {isJoined && (
          <button
            onClick={handleJoinMatch}
            className="w-full py-2 px-4 rounded font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            Join Match
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ArenaCard;
