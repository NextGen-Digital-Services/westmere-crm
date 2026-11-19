import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAppStore } from '../../lib/store';

export function ConfettiBurst() {
  const trigger = useAppStore((s) => s.confettiTrigger);

  useEffect(() => {
    if (trigger > 0) {
      // Solid flat agency colors: Navy, Gold, Success Emerald, Info Blue, Warm Amber
      const colors = ['#0B1F3A', '#C9A24B', '#1F8A5B', '#2F6FB5', '#D98A1B'];

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors,
        disableForReducedMotion: true,
      });

      // Secondary burst for celebration
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
          disableForReducedMotion: true,
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
          disableForReducedMotion: true,
        });
      }, 250);
    }
  }, [trigger]);

  return null;
}
