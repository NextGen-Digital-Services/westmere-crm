import React from 'react';
import { calculateLeadScore } from '../../lib/formatters';

export function LeadScoreBreakdown({ lead }) {
  const { total, breakdown } = calculateLeadScore(lead);

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-[#1F8A5B] bg-[#E8F5EE] border-[#C5E8D4] dark:bg-[#0E3524] dark:text-[#3ED996]';
    if (score >= 45) return 'text-[#D98A1B] bg-[#FDF4E7] border-[#FBE3BF] dark:bg-[#3D2605] dark:text-[#F3B356]';
    return 'text-[#536471] bg-[#F0EBE1] border-[#E2DBD0] dark:bg-[#1A2636] dark:text-[#8EA3BF]';
  };

  return (
    <div className="rounded-card border border-[var(--border-subtle)] p-4 bg-[var(--bg-card)]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-bold text-[var(--text-ink)] uppercase tracking-wider">
            Predictive Lead Score
          </span>
          <p className="text-[11px] text-[var(--text-muted)]">Rule-based conversion likelihood</p>
        </div>
        <div className={`px-2.5 py-1 rounded-full border text-sm font-extrabold ${getScoreColor(total)}`}>
          {total} / 100
        </div>
      </div>

      <div className="space-y-2">
        {breakdown.map((item) => (
          <div key={item.factor} className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)]">{item.factor}</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[var(--text-subtle)] font-medium">{item.status}</span>
              <span className="font-bold text-[var(--text-ink)]">
                +{item.points} <span className="text-[10px] text-[var(--text-subtle)] font-normal">/ {item.max}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
