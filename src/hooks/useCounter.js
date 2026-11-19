import { useState, useEffect } from 'react';

export function useCounter(endValue = 0, durationMs = 1200, decimals = 0) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = 0;
    const target = Number(endValue) || 0;

    if (target === 0) {
      setCount(0);
      return;
    }

    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
      
      // Quartic ease out: 1 - (1 - t)^4
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const current = startValue + (target - startValue) * easeOut;

      setCount(decimals > 0 ? Number(current.toFixed(decimals)) : Math.round(current));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    };
  }, [endValue, durationMs, decimals]);

  return count;
}
