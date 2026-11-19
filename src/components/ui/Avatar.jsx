import React from 'react';

export function Avatar({
  name = 'User',
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
}) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  };

  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return str.substring(0, 2).toUpperCase();
  };

  // Consistent background color based on name string
  const colors = [
    'bg-[#0B1F3A] text-white',
    'bg-[#16335C] text-white',
    'bg-[#C9A24B] text-[#0B1F3A]',
    'bg-[#2F6FB5] text-white',
    'bg-[#1F8A5B] text-white',
    'bg-[#9E7928] text-white',
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorClass = colors[Math.abs(hash) % colors.length];

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-bold select-none shrink-0 ${sizeClasses[size] || sizeClasses.md} ${colorClass} ${className}`}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
