import React from 'react';

export function Card({
  children,
  className = '',
  onClick,
  hoverable = false,
  bordered = true,
  padding = 'p-5',
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-card bg-[var(--bg-surface)] ${padding} ${
        bordered ? 'border border-[var(--border-subtle)]' : ''
      } shadow-solid ${
        hoverable ? 'hover:border-[#0B1F3A]/40 dark:hover:border-[var(--accent-color)]/50 transition-all duration-150 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
