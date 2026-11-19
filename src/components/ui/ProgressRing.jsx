import React from 'react';

export function ProgressRing({
  progress = 0, // 0 to 100+
  size = 72,
  strokeWidth = 7,
  color = '#C9A24B',
  trackColor = '#E2DBD0',
  children,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(progress, 0), 100);
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children || <span className="text-xs font-bold text-[var(--text-ink)]">{Math.round(progress)}%</span>}
      </div>
    </div>
  );
}
