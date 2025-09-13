import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Celebration = ({ type, onComplete, tokensAwarded, winTime, opponentTime }) => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (type === 'winner') {
      // Generate confetti particles
      const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * (window.innerWidth || 800),
        y: -10,
        color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][Math.floor(Math.random() * 5)],
        rotation: Math.random() * 360,
        size: Math.random() * 8 + 4
      }));
      setConfetti(particles);

      // Auto complete after animation
      const timer = setTimeout(onComplete, 4000);
      return () => clearTimeout(timer);
    } else if (type === 'loser') {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [type, onComplete]);

  if (type === 'winner') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-hidden"
      >
        {/* Confetti */}
        {confetti.map(particle => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: particle.x, 
              y: particle.y,
              rotate: particle.rotation,
              scale: 0
            }}
            animate={{ 
              y: (window.innerHeight || 800) + 100,
              rotate: particle.rotation + 720,
              scale: 1
            }}
            transition={{ 
              duration: 3,
              ease: "easeOut",
              delay: Math.random() * 0.5
            }}
            className="absolute w-2 h-2 rounded"
            style={{ 
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size
            }}
          />
        ))}

        {/* Winner Message */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.5
          }}
          className="text-center"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 1
            }}
            className="text-9xl mb-4"
          >
            🏆
          </motion.div>
          
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-6xl font-bold text-yellow-400 mb-4 drop-shadow-lg"
          >
            YOU WIN!
          </motion.h1>
          
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-2xl text-white drop-shadow-md"
          >
            🎉 You completed the challenge first! 🎉
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2 }}
            className="text-3xl text-yellow-300 mt-4 font-bold"
          >
            🪙 +{tokensAwarded || window.gameTokens || 0} Tokens!
          </motion.div>
          
          {winTime && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="text-lg text-white mt-2"
            >
              ⏱️ Completion Time: {(winTime / 1000).toFixed(2)}s
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 20
        }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 0.8, 1],
          }}
          transition={{ 
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="text-8xl mb-4"
        >
          😔
        </motion.div>
        
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-5xl font-bold text-red-400 mb-4 drop-shadow-lg"
        >
          YOU LOSE
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xl text-white drop-shadow-md"
        >
          Your opponent was faster! 😔
        </motion.p>
        
        {opponentTime && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-lg text-red-300 mt-2"
          >
            ⚡ They finished in {(opponentTime / 1000).toFixed(2)}s
          </motion.div>
        )}
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-md text-gray-300 mt-4"
        >
          Better luck next time! 💪
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Celebration;