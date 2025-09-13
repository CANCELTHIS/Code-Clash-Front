import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal } from 'react-icons/fa';
import { MdOutlineToken } from 'react-icons/md';
import { leaderboard } from '../utils/api';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await leaderboard.getTop10();
      setLeaders(response.data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaTrophy className="text-yellow-500" />;
    if (rank === 2) return <FaMedal className="text-gray-400" />;
    if (rank === 3) return <FaMedal className="text-amber-600" />;
    return <span className="font-bold text-lg">{rank}</span>;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-primary mb-6 text-center">🏆 Leaderboard</h2>
      
      <div className="space-y-3">
        {leaders.map((leader, index) => (
          <motion.div
            key={leader.username}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-3 rounded-lg ${
              leader.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 flex items-center justify-center">
                {getRankIcon(leader.rank)}
              </div>
              <div>
                <div className="font-semibold text-gray-800">{leader.username}</div>
                <div className="text-sm text-gray-600">
                  {leader.wins}W / {leader.totalMatches}M
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-lg font-bold text-yellow-600">
              <MdOutlineToken />
              <span>{leader.tokens}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Leaderboard;