import React from 'react';

export function Table({
  headers = [], // [{ key, label, align: 'left'|'right'|'center', sortable, width }]
  children,
  className = '',
  onSort,
  sortKey,
  sortDirection,
}) {
  return (
    <div className={`w-full overflow-x-auto rounded-card border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-solid ${className}`}>
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)]/70 text-[var(--text-muted)] font-semibold uppercase tracking-wider text-[11px]">
            {headers.map((h) => {
              const alignClass = h.align === 'right' ? 'text-right' : h.align === 'center' ? 'text-center' : 'text-left';
              return (
                <th
                  key={h.key}
                  style={{ width: h.width }}
                  onClick={() => h.sortable && onSort && onSort(h.key)}
                  className={`py-3 px-4 ${alignClass} ${h.sortable ? 'cursor-pointer select-none hover:text-[var(--text-ink)]' : ''}`}
                >
                  <div className={`inline-flex items-center gap-1.5 ${h.align === 'right' ? 'justify-end' : ''}`}>
                    <span>{h.label}</span>
                    {h.sortable && sortKey === h.key && (
                      <span className="text-[10px] text-[#0B1F3A] dark:text-[var(--accent-color)] font-bold">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-subtle)]">{children}</tbody>
      </table>
    </div>
  );
}
