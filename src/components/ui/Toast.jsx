import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useToastStore } from '../../hooks/useToast';

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#1F8A5B] shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#D98A1B] shrink-0" />,
    danger: <AlertCircle className="w-5 h-5 text-[#C23B3B] shrink-0" />,
    info: <Info className="w-5 h-5 text-[#2F6FB5] shrink-0" />,
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-card border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-solid-lg"
          >
            {icons[toast.type] || icons.info}
            <div className="flex-1 min-w-0">
              {toast.title && <p className="text-xs font-bold text-[var(--text-ink)] leading-snug">{toast.title}</p>}
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{toast.message}</p>
              {toast.action && (
                <button
                  type="button"
                  onClick={() => {
                    toast.action.onClick();
                    removeToast(toast.id);
                  }}
                  className="mt-2 text-xs font-bold text-[#0B1F3A] dark:text-[var(--accent-color)] underline hover:opacity-80 block"
                >
                  {toast.action.label}
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-[var(--text-subtle)] hover:text-[var(--text-ink)] p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
