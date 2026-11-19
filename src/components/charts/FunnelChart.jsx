import React from 'react';
import { motion } from 'framer-motion';
import { PIPELINE_STAGES } from '../../lib/constants';

export function FunnelChart({ leads = [] }) {
  // Compute leads at each main pipeline stage
  const stages = [
    { id: 'lead_generated', name: 'Lead Generated', color: '#2F6FB5' },
    { id: 'contacted', name: 'Contacted', color: '#3A81D1' },
    { id: 'qualified', name: 'Qualified', color: '#C9A24B' },
    { id: 'meeting', name: 'Meeting / Demo', color: '#D98A1B' },
    { id: 'proposal_sent', name: 'Proposal Sent', color: '#1F8A5B' },
    { id: 'negotiation', name: 'Negotiation', color: '#9E7928' },
    { id: 'won', name: 'Closed Won', color: '#166543' },
  ];

  const counts = stages.map((s) => {
    // Count leads currently in stage or past it
    const count = leads.filter((l) => l.stage === s.id).length;
    return { ...s, count };
  });

  const maxCount = Math.max(...counts.map((c) => c.count), 1);

  return (
    <div className="space-y-3">
      {counts.map((item, idx) => {
        const prevCount = idx > 0 ? counts[idx - 1].count : null;
        const conversionPct = prevCount && prevCount > 0 ? Math.round((item.count / prevCount) * 100) : null;
        const widthPct = Math.max(12, Math.round((item.count / maxCount) * 100));

        return (
          <div key={item.id} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--text-ink)]">{item.name}</span>
              <div className="flex items-center gap-2">
                {conversionPct !== null && (
                  <span className="text-[10px] font-bold text-[var(--text-muted)] bg-[var(--bg-subtle)] px-1.5 py-0.2 rounded">
                    {conversionPct}% conversion
                  </span>
                )}
                <span className="font-bold text-[var(--text-ink)]">{item.count} deals</span>
              </div>
            </div>

            {/* Solid flat progress bar */}
            <div className="h-6 w-full rounded-md bg-[var(--bg-subtle)] overflow-hidden flex">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${widthPct}%` }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                className="h-full flex items-center px-2 text-[11px] font-bold text-white whitespace-nowrap"
                style={{ backgroundColor: item.color }}
              >
                {item.count > 0 && <span>{item.count}</span>}
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
