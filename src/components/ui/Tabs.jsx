import React from 'react';
import { motion } from 'framer-motion';

export function Tabs({
  tabs = [], // [{ id, label, count, icon: Icon }]
  activeTab,
  onChange,
  className = '',
  layoutId = 'active-tab-indicator',
}) {
  return (
    <div className={`flex items-center gap-1 border-b border-[var(--border-subtle)] overflow-x-auto no-scrollbar ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative py-3 px-3.5 text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors duration-150 cursor-pointer ${
              isActive
                ? 'text-[#0B1F3A] dark:text-[var(--accent-color)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-ink)]'
            }`}
          >
            {Icon && <Icon className="w-4 h-4 shrink-0" />}
            <span>{tab.label}</span>
            {typeof tab.count !== 'undefined' && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive
                    ? 'bg-[#0B1F3A] text-white dark:bg-[var(--accent-color)] dark:text-[#0B1F3A]'
                    : 'bg-[var(--bg-subtle)] text-[var(--text-muted)]'
                }`}
              >
                {tab.count}
              </span>
            )}

            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B1F3A] dark:bg-[var(--accent-color)]"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
