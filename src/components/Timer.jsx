import { useState, useEffect } from 'react';

const Timer = ({ startTime, isRunning = true, finalTime, matchEnded = false }) => {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (finalTime) {
      setElapsedMs(finalTime);
      setIsActive(false);
      return;
    }
    
    if (matchEnded) {
      setIsActive(false);
      return;
    }

    if (!startTime || !isRunning) {
      setIsActive(false);
      setElapsedMs(0);
      return;
    }
    
    const now = Date.now();
    const start = new Date(startTime).getTime();
    
    setIsActive(true);
    setElapsedMs(Math.max(0, now - start));
  }, [startTime, isRunning, finalTime, matchEnded]);

  useEffect(() => {
    let interval = null;
    
    if (isActive && isRunning && !finalTime && !matchEnded) {
      interval = setInterval(() => {
        const now = Date.now();
        const start = new Date(startTime).getTime();
        setElapsedMs(now - start);
      }, 10);
    }
    
    return () => clearInterval(interval);
  }, [isActive, isRunning, startTime, finalTime, matchEnded]);

  const formatStopwatch = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (finalTime) return 'text-green-600';
    if (matchEnded) return 'text-red-600';
    if (!isRunning) return 'text-red-600';
    return 'text-blue-600';
  };

  return (
    <div className={`text-2xl font-mono font-bold ${getTimerColor()}`}>
      {formatStopwatch(elapsedMs)}
    </div>
  );
};

export default Timer;