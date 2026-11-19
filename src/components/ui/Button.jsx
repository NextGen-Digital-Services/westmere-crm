import React from 'react';

export function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'gold'
  size = 'md',        // 'sm' | 'md' | 'lg'
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-button transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer';

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  const variantClasses = {
    primary: 'bg-[#0B1F3A] hover:bg-[#16335C] text-white focus:ring-[#0B1F3A] dark:bg-[#C9A24B] dark:hover:bg-[#B58E38] dark:text-[#0B1F3A]',
    gold: 'bg-[#C9A24B] hover:bg-[#B58E38] text-[#0B1F3A] font-semibold focus:ring-[#C9A24B]',
    secondary: 'bg-[#E7E0D3] hover:bg-[#DBD3C3] text-[#101828] focus:ring-[#0B1F3A] dark:bg-[#142845] dark:hover:bg-[#1B365D] dark:text-white',
    outline: 'border border-[var(--border-subtle)] bg-transparent hover:bg-[var(--bg-subtle)] text-[var(--text-ink)] focus:ring-[var(--border-focus)]',
    danger: 'bg-[#C23B3B] hover:bg-[#A82E2E] text-white focus:ring-[#C23B3B]',
    ghost: 'bg-transparent hover:bg-[var(--bg-subtle)] text-[var(--text-ink)] focus:ring-transparent',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />
      )}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
}
