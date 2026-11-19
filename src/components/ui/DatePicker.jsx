import React from 'react';
import { Calendar } from 'lucide-react';

export function DatePicker({
  label,
  value,
  onChange,
  error,
  className = '',
  min,
  max,
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-xs font-semibold text-[var(--text-ink)] mb-1.5">{label}</label>}
      <div className="relative flex items-center">
        <div className="absolute left-3 pointer-events-none text-[var(--text-muted)] flex items-center">
          <Calendar className="w-4 h-4" />
        </div>
        <input
          type="date"
          value={value || ''}
          min={min}
          max={max}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-button border text-sm transition-colors duration-150 py-2 pl-9 pr-3 bg-[var(--bg-surface)] text-[var(--text-ink)] focus:outline-none focus:ring-1 ${
            error
              ? 'border-[#C23B3B] focus:border-[#C23B3B]'
              : 'border-[var(--border-subtle)] focus:border-[#0B1F3A] dark:focus:border-[var(--accent-color)]'
          }`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-[#C23B3B] font-medium">{error}</p>}
    </div>
  );
}
