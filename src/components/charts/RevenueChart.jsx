import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export function RevenueChart({ data = [] }) {
  const defaultData = [
    { month: 'Jun', won: 1800000, pipeline: 2400000 },
    { month: 'Jul', won: 2200000, pipeline: 3100000 },
    { month: 'Aug', won: 2700000, pipeline: 3800000 },
    { month: 'Sep', won: 3100000, pipeline: 4200000 },
    { month: 'Oct', won: 3450000, pipeline: 4900000 },
    { month: 'Nov', won: 3850000, pipeline: 5600000 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-card border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 shadow-solid text-xs">
          <p className="font-bold text-[var(--text-ink)] mb-1">{label} 2026</p>
          <div className="space-y-1">
            <p className="text-[#1F8A5B] font-semibold">
              Won Revenue: ₹{(payload[0].value / 100000).toFixed(1)} Lakhs
            </p>
            {payload[1] && (
              <p className="text-[#0B1F3A] dark:text-[var(--accent-color)] font-semibold">
                Weighted Pipeline: ₹{(payload[1].value / 100000).toFixed(1)} Lakhs
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" opacity={0.6} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `₹${val / 100000}L`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ fontSize: 11, paddingBottom: 10 }}
            iconType="square"
          />
          <Bar dataKey="won" name="Won Revenue" fill="#1F8A5B" radius={[4, 4, 0, 0]} maxBarSize={32} />
          <Bar dataKey="pipeline" name="Weighted Forecast" fill="#0B1F3A" radius={[4, 4, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
