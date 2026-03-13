import { useState, useEffect, useRef } from 'react';

export function useCountdown(fromDate) {
  const [elapsed, setElapsed] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (!fromDate) return;
    const update = () => {
      const diff = Math.floor((Date.now() - new Date(fromDate).getTime()) / 1000);
      setElapsed(diff);
    };
    update();
    ref.current = setInterval(update, 1000);
    return () => clearInterval(ref.current);
  }, [fromDate]);

  const formatElapsed = (secs) => {
    if (secs < 0) return '0s ago';
    if (secs < 60) return `${secs}s ago`;
    if (secs < 3600) return `${Math.floor(secs / 60)}m ${secs % 60}s ago`;
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return `${h}h ${m}m ago`;
  };

  return { elapsed, formatted: fromDate ? formatElapsed(elapsed) : 'Never' };
}
