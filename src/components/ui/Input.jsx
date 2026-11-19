import React from 'react';

export function Input({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}) {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-[var(--text-ink)] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 pointer-events-none text-[var(--text-muted)] flex items-center">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`w-full rounded-button border text-sm transition-colors duration-150 py-2 bg-[var(--bg-surface)] text-[var(--text-ink)] placeholder-[var(--text-subtle)] focus:outline-none focus:ring-1 ${
            Icon ? 'pl-9 pr-3' : 'px-3'
          } ${
            error
              ? 'border-[#C23B3B] focus:border-[#C23B3B] focus:ring-[#C23B3B]'
              : 'border-[var(--border-subtle)] focus:border-[#0B1F3A] focus:ring-[#0B1F3A] dark:focus:border-[var(--accent-color)] dark:focus:ring-[var(--accent-color)]'
          }`}
          {...props}
        />
      </div>
      {error ? (
        <p className="mt-1 text-xs text-[#C23B3B] font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-[var(--text-muted)]">{helperText}</p>
      ) : null}
    </div>
  );
}
