import React from 'react';
import { motion } from 'framer-motion';
import { useCounter } from '../../hooks/useCounter';
import { Card } from '../ui/Card';

export function KpiCard({
  title,
  value = 0,
  prefix = '',
  suffix = '',
  change,
  changeType = 'positive', // 'positive' | 'negative' | 'neutral'
  icon: Icon,
  subtitle,
  onClick,
}) {
  const animatedValue = useCounter(value);

  const formattedDisplay = animatedValue.toLocaleString();

  return (
    <Card hoverable={Boolean(onClick)} onClick={onClick} className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[var(--text-muted)] tracking-wide">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[var(--text-ink)] tracking-tight">
              {prefix}
              {formattedDisplay}
              {suffix}
            </span>
            {change && (
              <span
                className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                  changeType === 'positive'
                    ? 'text-[#1F8A5B] bg-[#E8F5EE] dark:bg-[#0E3524] dark:text-[#3ED996]'
                    : changeType === 'negative'
                    ? 'text-[#C23B3B] bg-[#FAECEC] dark:bg-[#3E1414] dark:text-[#F87171]'
                    : 'text-[var(--text-muted)] bg-[var(--bg-subtle)]'
                }`}
              >
                {change}
              </span>
            )}
          </div>
          {subtitle && <p className="text-[11px] text-[var(--text-subtle)] mt-1">{subtitle}</p>}
        </div>

        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-subtle)] flex items-center justify-center text-[#0B1F3A] dark:text-[var(--accent-color)] shrink-0 border border-[var(--border-subtle)]">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </Card>
  );
}
