import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanCard } from './KanbanCard';
import { formatCurrency } from '../../lib/formatters';

export function KanbanColumn({ stage, leads = [], probability = 10 }) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
    data: {
      type: 'Column',
      stage,
    },
  });

  const totalValue = leads.reduce((sum, l) => sum + (Number(l.expectedValue) || 0), 0);
  const weightedValue = Math.round(totalValue * (probability / 100));

  return (
    <div
      ref={setNodeRef}
      className={`w-72 shrink-0 flex flex-col rounded-card bg-[var(--bg-main)]/60 border transition-colors duration-150 max-h-[calc(100vh-210px)] ${
        isOver
          ? 'border-[#0B1F3A] ring-2 ring-[#0B1F3A]/20 bg-[var(--bg-subtle)]'
          : 'border-[var(--border-subtle)]'
      }`}
    >
      {/* Column Header */}
      <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] rounded-t-card shrink-0">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: stage.color }} />
            <h3 className="text-xs font-bold text-[var(--text-ink)] truncate">{stage.name}</h3>
          </div>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[var(--bg-subtle)] text-[var(--text-ink)]">
            {leads.length}
          </span>
        </div>

        {/* Probability & Weighted Value */}
        <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-1 border-t border-[var(--border-subtle)]/50">
          <span>{probability}% prob.</span>
          <span className="font-semibold text-[var(--text-ink)]" title="Weighted / Total Pipeline Value">
            {formatCurrency(weightedValue)} <span className="font-normal text-[var(--text-subtle)]">({formatCurrency(totalValue)})</span>
          </span>
        </div>
      </div>

      {/* Cards List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 no-scrollbar">
        <SortableContext items={leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <KanbanCard key={lead.id} lead={lead} />
          ))}
        </SortableContext>
        {leads.length === 0 && (
          <div className="h-24 flex items-center justify-center border border-dashed border-[var(--border-subtle)] rounded-card text-center p-3 text-[11px] text-[var(--text-subtle)]">
            Drop prospect here
          </div>
        )}
      </div>
    </div>
  );
}
