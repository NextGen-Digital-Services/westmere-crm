import React from 'react';

export function ActivityHeatmap({ activities = [] }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeks = [1, 2, 3, 4, 5];

  // Mock intensity grid (0 to 4 level)
  const grid = [
    [1, 3, 4, 2, 0, 1, 0],
    [2, 4, 3, 3, 1, 0, 0],
    [3, 2, 4, 4, 2, 1, 0],
    [4, 4, 3, 2, 3, 0, 0],
    [2, 3, 4, 3, 1, 0, 0],
  ];

  const getColor = (level) => {
    switch (level) {
      case 4: return 'bg-[#0B1F3A] dark:bg-[#C9A24B]';
      case 3: return 'bg-[#16335C] dark:bg-[#B58E38]';
      case 2: return 'bg-[#2F6FB5] dark:bg-[#9E7928]';
      case 1: return 'bg-[#A3C2E6] dark:bg-[#5C4516]';
      default: return 'bg-[var(--bg-subtle)]';
    }
  };

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] mb-1">
        <span>Team Outreach & Sales Velocity (Last 35 Days)</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[var(--text-subtle)]">Less</span>
          <span className="w-2.5 h-2.5 rounded-sm bg-[var(--bg-subtle)]" />
          <span className="w-2.5 h-2.5 rounded-sm bg-[#A3C2E6] dark:bg-[#5C4516]" />
          <span className="w-2.5 h-2.5 rounded-sm bg-[#2F6FB5] dark:bg-[#9E7928]" />
          <span className="w-2.5 h-2.5 rounded-sm bg-[#0B1F3A] dark:bg-[#C9A24B]" />
          <span className="text-[10px] text-[var(--text-subtle)]">More</span>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col justify-between py-1 text-[10px] text-[var(--text-subtle)] font-medium">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
          <span>Sun</span>
        </div>

        <div className="flex-1 grid grid-cols-5 gap-1.5">
          {weeks.map((weekIdx, col) => (
            <div key={weekIdx} className="flex flex-col gap-1.5">
              {days.map((day, row) => {
                const level = grid[col]?.[row] || 0;
                return (
                  <div
                    key={`${col}-${row}`}
                    title={`${day}, Week ${weekIdx}: ${level * 4 + 1} sales activities`}
                    className={`h-5 rounded-sm ${getColor(level)} transition-colors cursor-pointer hover:ring-2 hover:ring-[#0B1F3A]`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
