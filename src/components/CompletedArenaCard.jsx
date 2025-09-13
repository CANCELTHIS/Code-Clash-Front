import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTrophy, FaMedal } from "react-icons/fa";
import { MdOutlineToken } from "react-icons/md";
import { TbMath, TbLogicXnor } from "react-icons/tb";
import { GiSewingString } from "react-icons/gi";
import { SiThealgorithms } from "react-icons/si";
import { CiBarcode } from "react-icons/ci";
import SolutionModal from "./SolutionModal";

const CompletedArenaCard = ({ arena }) => {
  const [loading, setLoading] = useState(false);
  const [showSolutionModal, setShowSolutionModal] = useState(false);

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
    switch (category?.trim()) {
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

  if (loading) {
    return (
      <motion.div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 border"
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

      <div className="bg-white rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-gray-800 mb-2">Challenge:</h4>
        <p className="text-sm text-gray-600 mb-3">{arena.description}</p>

        <div className="border-t pt-3">
          <div className="mb-3">
            <div className="flex items-center space-x-2 mb-2">
              <FaTrophy className="text-gray-500" />
              <span className="font-semibold text-gray-800">
                Winner: {arena.winnerName || "Unknown"}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <MdOutlineToken className="text-gray-600" />
                Total Tokens: {arena.winnerTokens || 0}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowSolutionModal(true)}
            className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Show Winner's Solution
          </button>
        </div>
      </div>

      {showSolutionModal && (
        <SolutionModal
          arena={arena}
          onClose={() => setShowSolutionModal(false)}
        />
      )}
    </motion.div>
  );
};

export default CompletedArenaCard;
