import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';

export function MultiSelect({
  label,
  options = [],
  value = [],
  onChange,
  placeholder = 'Select items...',
  className = '',
  error,
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (opt) => {
    if (value.includes(opt)) {
      onChange(value.filter((item) => item !== opt));
    } else {
      onChange([...value, opt]);
    }
  };

  const removeTag = (opt, e) => {
    e.stopPropagation();
    onChange(value.filter((item) => item !== opt));
  };

  return (
    <div className={`w-full relative ${className}`} ref={containerRef}>
      {label && <label className="block text-xs font-semibold text-[var(--text-ink)] mb-1.5">{label}</label>}
      <div
        onClick={() => setOpen(!open)}
        className={`w-full min-h-[38px] p-1.5 rounded-button border text-sm flex flex-wrap items-center gap-1.5 bg-[var(--bg-surface)] cursor-pointer transition-colors duration-150 ${
          open
            ? 'border-[#0B1F3A] ring-1 ring-[#0B1F3A] dark:border-[var(--accent-color)] dark:ring-[var(--accent-color)]'
            : 'border-[var(--border-subtle)]'
        } ${error ? 'border-[#C23B3B]' : ''}`}
      >
        {value.length === 0 ? (
          <span className="text-xs text-[var(--text-subtle)] px-2">{placeholder}</span>
        ) : (
          value.map((val) => (
            <span
              key={val}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-[var(--bg-subtle)] text-[var(--text-ink)]"
            >
              {val}
              <button
                type="button"
                onClick={(e) => removeTag(val, e)}
                className="hover:text-[#C23B3B] p-0.5 rounded"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))
        )}
        <div className="ml-auto pr-1 text-[var(--text-muted)]">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1 max-h-56 overflow-auto rounded-card border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-solid-md py-1">
          {options.map((opt) => {
            const isSelected = value.includes(opt);
            return (
              <div
                key={opt}
                onClick={() => toggleOption(opt)}
                className={`flex items-center justify-between px-3 py-2 text-xs cursor-pointer hover:bg-[var(--bg-subtle)] transition-colors ${
                  isSelected ? 'font-semibold text-[#0B1F3A] dark:text-[var(--accent-color)]' : 'text-[var(--text-ink)]'
                }`}
              >
                <span>{opt}</span>
                {isSelected && <Check className="w-4 h-4 text-[#1F8A5B]" />}
              </div>
            );
          })}
        </div>
      )}
      {error && <p className="mt-1 text-xs text-[#C23B3B] font-medium">{error}</p>}
    </div>
  );
}
