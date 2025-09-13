import { motion } from "framer-motion";
import { FaTrophy, FaTimes } from "react-icons/fa";
import { MdOutlineToken } from "react-icons/md";

const SolutionModal = ({ arena, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <FaTrophy className="text-2xl" />
                <h2 className="text-2xl font-bold">Winner's Solution</h2>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span>Winner: {arena.winnerName || "Unknown"}</span>
                <span className="flex items-center gap-1">
                  <MdOutlineToken />
                  Total Tokens: {arena.winnerTokens || 0}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Challenge Info */}
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold mb-2">{arena.title}</h3>
          <p className="text-gray-600">{arena.description}</p>
        </div>

        {/* Code Solution */}
        <div className="p-6">
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="bg-gray-800 px-4 py-3 flex items-center space-x-3">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-gray-400 text-sm">solution.js</span>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              <pre className="text-green-400 text-sm font-mono leading-relaxed">
                {arena.winnerSolution || ``}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
      </motion.div>
    </motion.div>
  );
};

export default SolutionModal;
