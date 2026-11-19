import React from 'react';

export function Badge({
  children,
  variant = 'default', // 'default' | 'success' | 'warning' | 'danger' | 'info' | 'navy' | 'gold' | 'outline'
  size = 'md',        // 'sm' | 'md'
  icon: Icon,
  className = '',
}) {
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2 py-0.5 gap-1.5',
  };

  const variantClasses = {
    default: 'bg-[var(--bg-subtle)] text-[var(--text-ink)] border border-[var(--border-subtle)]',
    success: 'bg-[#E8F5EE] text-[#1F8A5B] border border-[#C5E8D4] dark:bg-[#0E3524] dark:text-[#3ED996] dark:border-[#1F8A5B]',
    warning: 'bg-[#FDF4E7] text-[#D98A1B] border border-[#FBE3BF] dark:bg-[#3D2605] dark:text-[#F3B356] dark:border-[#D98A1B]',
    danger: 'bg-[#FAECEC] text-[#C23B3B] border border-[#F4C7C7] dark:bg-[#3E1414] dark:text-[#F87171] dark:border-[#C23B3B]',
    info: 'bg-[#EAF1F9] text-[#2F6FB5] border border-[#C5DCF4] dark:bg-[#102B4C] dark:text-[#60A5FA] dark:border-[#2F6FB5]',
    navy: 'bg-[#0B1F3A] text-white',
    gold: 'bg-[#FDF9F0] text-[#9E7928] border border-[#EEDCAE] dark:bg-[#2B2312] dark:text-[#EED28B] dark:border-[#9E7928]',
    outline: 'border border-[var(--border-subtle)] text-[var(--text-muted)] bg-transparent',
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-badge shrink-0 leading-none ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.default} ${className}`}>
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
