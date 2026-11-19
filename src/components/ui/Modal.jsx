import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  className = '',
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop: solid dark overlay with flat opacity */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#061224]/75"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative w-full ${maxWidth} rounded-modal border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-solid-lg z-10 overflow-hidden ${className}`}
          >
            {(title || subtitle) && (
              <div className="flex items-start justify-between p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-card)]">
                <div>
                  {title && <h3 className="text-base font-bold text-[var(--text-ink)] leading-snug">{title}</h3>}
                  {subtitle && <p className="text-xs text-[var(--text-muted)] mt-0.5">{subtitle}</p>}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-ink)] hover:bg-[var(--bg-subtle)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
