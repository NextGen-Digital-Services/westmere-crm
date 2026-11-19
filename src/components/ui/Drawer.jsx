import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = 'max-w-2xl',
  footer,
}) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#061224]/70"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className={`w-screen ${width} bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] shadow-solid-lift flex flex-col`}
            >
              <div className="p-5 border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0 bg-[var(--bg-card)]">
                <div>
                  {title && <h2 className="text-base font-bold text-[var(--text-ink)]">{title}</h2>}
                  {subtitle && <p className="text-xs text-[var(--text-muted)] mt-0.5">{subtitle}</p>}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--text-ink)] hover:bg-[var(--bg-subtle)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">{children}</div>

              {footer && (
                <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-card)] shrink-0">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
