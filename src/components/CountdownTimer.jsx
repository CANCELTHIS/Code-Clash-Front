import { useState, useEffect } from 'react';

const CountdownTimer = ({ startTime, onCountdownEnd }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      const diff = start - now;
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimeLeft('0:00:00');
        if (onCountdownEnd) {
          onCountdownEnd();
        }
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="text-2xl font-mono font-bold text-orange-600">
      {timeLeft}
    </div>
  );
};

export default CountdownTimer;