import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import socketService from '../utils/socket';
import { useAuth } from '../hooks/useAuth.jsx';

const MatchmakingQueue = ({ onMatchFound, onCancel }) => {
  const [queueTime, setQueueTime] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setQueueTime(prev => prev + 1);
    }, 1000);

    // Connect and join queue
    socketService.connect();
    const userId = user?.userId || user?._id;
    console.log('Joining queue with userId:', userId);
    
    socketService.socket?.emit('join_queue', { userId });

    const handleMatchFound = (data) => {
      console.log('Match found:', data);
      onMatchFound(data.arenaId);
    };

    socketService.socket?.on('match_found', handleMatchFound);

    return () => {
      clearInterval(timer);
      socketService.socket?.emit('leave_queue', { userId });
      socketService.socket?.off('match_found', handleMatchFound);
    };
  }, [onMatchFound]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg p-8 text-center max-w-md">
        <div className="mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-primary mb-2">Finding Match...</h3>
          <p className="text-muted">Searching for an opponent</p>
        </div>

        <div className="mb-6">
          <div className="text-3xl font-mono font-bold text-green-600">
            {formatTime(queueTime)}
          </div>
          <p className="text-sm text-muted">Queue time</p>
        </div>

        <button
          onClick={onCancel}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
};

export default MatchmakingQueue;