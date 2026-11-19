import React from 'react';
import { Button } from './Button';

export function EmptyState({
  title = 'No records found',
  description = 'There are no items matching your criteria yet.',
  actionLabel,
  onAction,
  icon: Icon,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center rounded-card border border-dashed border-[var(--border-subtle)] bg-[var(--bg-surface)]/50 ${className}`}>
      {/* Solid flat SVG illustration */}
      <div className="w-16 h-16 rounded-2xl bg-[var(--bg-subtle)] flex items-center justify-center mb-4 text-[#0B1F3A] dark:text-[var(--accent-color)] border border-[var(--border-subtle)]">
        {Icon ? (
          <Icon className="w-8 h-8" />
        ) : (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="4" width="20" height="16" rx="3" fill="#E7E0D3" fillOpacity="0.4" stroke="#0B1F3A" />
            <path d="M7 10h10M7 14h6" strokeLinecap="round" />
          </svg>
        )}
      </div>

      <h4 className="text-sm font-bold text-[var(--text-ink)] mb-1">{title}</h4>
      <p className="text-xs text-[var(--text-muted)] max-w-sm mb-4 leading-relaxed">{description}</p>

      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
