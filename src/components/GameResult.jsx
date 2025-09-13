import { motion } from 'framer-motion';

const GameResult = ({ result, userTime, opponentTime }) => {
  const isWinner = result?.winner === result?.currentUserId;
  
  const formatTime = (ms) => {
    if (!ms) return '--:--';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg shadow-lg p-6 border-2 border-accent"
    >
      <div className="text-center mb-4">
        <div className={`text-6xl mb-2 ${isWinner ? 'text-green-600' : 'text-red-600'}`}>
          {isWinner ? '🏆' : '😔'}
        </div>
        <h3 className={`text-2xl font-bold ${isWinner ? 'text-green-600' : 'text-red-600'}`}>
          {isWinner ? 'VICTORY!' : 'DEFEAT'}
        </h3>
        <p className="text-muted">
          {isWinner ? 'You solved it first!' : 'Better luck next time!'}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-green-50 rounded">
          <span className="font-medium">🥇 Winner Time:</span>
          <span className="font-mono font-bold text-green-600">
            {formatTime(result?.winTime)}
          </span>
        </div>
        
        {result?.tokensAwarded && (
          <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
            <span className="font-medium">🪙 Tokens Awarded:</span>
            <span className="font-bold text-yellow-600">
              {result.tokensAwarded}
            </span>
          </div>
        )}
        
        {userTime && (
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
            <span className="font-medium">⏱️ Your Time:</span>
            <span className="font-mono font-bold text-blue-600">
              {formatTime(userTime)}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => window.location.href = '/'}
          className="bg-primary text-secondary px-6 py-2 rounded-lg hover:bg-accent hover:text-primary transition-colors"
        >
          Play Again
        </button>
      </div>
    </motion.div>
  );
};

export default GameResult;