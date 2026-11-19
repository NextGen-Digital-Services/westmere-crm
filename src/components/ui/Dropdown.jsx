import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Dropdown({
  trigger,
  items = [], // [{ label, icon: Icon, onClick, danger, divider }]
  align = 'right',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className={`absolute z-50 mt-1.5 w-48 rounded-card border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-solid-md py-1 overflow-hidden ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            {items.map((item, idx) => {
              if (item.divider) {
                return <div key={`div-${idx}`} className="my-1 border-t border-[var(--border-subtle)]" />;
              }

              const Icon = item.icon;
              return (
                <button
                  key={item.label || idx}
                  type="button"
                  onClick={() => {
                    item.onClick && item.onClick();
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-left transition-colors ${
                    item.danger
                      ? 'text-[#C23B3B] hover:bg-[#FAECEC] dark:hover:bg-[#3E1414]'
                      : 'text-[var(--text-ink)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
