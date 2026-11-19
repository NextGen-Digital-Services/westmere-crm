import React from 'react';

export function Skeleton({ className = '', variant = 'rect' }) {
  const variantClasses = {
    rect: 'rounded-button',
    circle: 'rounded-full',
    text: 'rounded h-3.5',
    card: 'rounded-card h-32',
  };

  return (
    <div
      className={`animate-pulse bg-[var(--border-subtle)] ${variantClasses[variant] || variantClasses.rect} ${className}`}
    />
  );
}
