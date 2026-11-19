import React from 'react';
import { ChevronDown } from 'lucide-react';

export function Select({
  label,
  options = [], // [{ value, label }] or string[]
  error,
  helperText,
  className = '',
  id,
  value,
  onChange,
  placeholder,
  ...props
}) {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-[var(--text-ink)] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          className={`w-full appearance-none rounded-button border text-sm transition-colors duration-150 py-2 pl-3 pr-8 bg-[var(--bg-surface)] text-[var(--text-ink)] focus:outline-none focus:ring-1 cursor-pointer ${
            error
              ? 'border-[#C23B3B] focus:border-[#C23B3B] focus:ring-[#C23B3B]'
              : 'border-[var(--border-subtle)] focus:border-[#0B1F3A] focus:ring-[#0B1F3A] dark:focus:border-[var(--accent-color)] dark:focus:ring-[var(--accent-color)]'
          }`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const lbl = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val} className="bg-[var(--bg-surface)] text-[var(--text-ink)]">
                {lbl}
              </option>
            );
          })}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-[var(--text-muted)]">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-[#C23B3B] font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-[var(--text-muted)]">{helperText}</p>}
    </div>
  );
}
