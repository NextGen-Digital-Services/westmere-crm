import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export function SplitPieChart({ data = [], totalLabel = 'Total' }) {
  // Solid flat agency palette
  const COLORS = ['#0B1F3A', '#C9A24B', '#1F8A5B', '#2F6FB5', '#D98A1B', '#9E7928'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="rounded-card border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2.5 shadow-solid text-xs">
          <p className="font-bold text-[var(--text-ink)]">{item.name}</p>
          <p className="text-[var(--text-muted)] mt-0.5 font-semibold">
            {item.value} deals ({item.payload.percentage || Math.round((item.value / data.reduce((a, b) => a + b.value, 0)) * 100)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="w-44 h-44 shrink-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              innerRadius={48}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-base font-extrabold text-[var(--text-ink)] leading-none">
            {data.reduce((acc, curr) => acc + (curr.value || 0), 0)}
          </span>
          <span className="text-[10px] text-[var(--text-subtle)] font-medium mt-0.5">{totalLabel}</span>
        </div>
      </div>

      {/* Legend list */}
      <div className="flex-1 w-full space-y-1.5 text-xs">
        {data.map((item, idx) => (
          <div key={item.name} className="flex items-center justify-between py-0.5">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: item.color || COLORS[idx % COLORS.length] }}
              />
              <span className="text-[var(--text-ink)] font-medium truncate">{item.name}</span>
            </div>
            <span className="font-bold text-[var(--text-ink)] shrink-0 ml-2">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
