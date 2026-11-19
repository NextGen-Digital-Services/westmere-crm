import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Phone, MessageSquare, Mail, AlertCircle, Building2 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { formatCurrency, isLeadStale } from '../../lib/formatters';
import { useAppStore } from '../../lib/store';

export function KanbanCard({ lead, isOverlay = false }) {
  const openLeadDrawer = useAppStore((s) => s.openLeadDrawer);
  const staleThresholdDays = useAppStore((s) => s.settings.pipeline?.staleThresholdDays || 7);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
    data: {
      type: 'Lead',
      lead,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isStale = isLeadStale(lead.lastActivityDate, staleThresholdDays) && !['won', 'lost'].includes(lead.stage);

  const priorityVariants = {
    Hot: 'danger',
    Warm: 'warning',
    Cold: 'default',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => openLeadDrawer(lead.id)}
      className={`group relative rounded-card border bg-[var(--bg-surface)] p-3.5 shadow-solid select-none transition-all duration-150 cursor-grab active:cursor-grabbing hover:border-[#0B1F3A]/40 dark:hover:border-[var(--accent-color)]/50 ${
        isDragging ? 'opacity-30 border-dashed border-[#0B1F3A]' : 'border-[var(--border-subtle)]'
      } ${isOverlay ? 'shadow-solid-lift rotate-2 border-[#0B1F3A] scale-105' : ''}`}
    >
      {/* Top badges: Priority + Stale badge + Market */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant={priorityVariants[lead.priority] || 'default'} size="sm">
            {lead.priority}
          </Badge>
          {isStale && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FAECEC] text-[#C23B3B] border border-[#F4C7C7]">
              <AlertCircle className="w-2.5 h-2.5" />
              Stale
            </span>
          )}
          {lead.isSample && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[var(--bg-subtle)] text-[var(--text-subtle)]">
              Sample
            </span>
          )}
        </div>
        <span className="text-xs shrink-0 font-medium text-[var(--text-subtle)]">
          {lead.market === 'UAE' ? '🇦🇪 UAE' : '🇮🇳 IND'}
        </span>
      </div>

      {/* Business Name & Contact Person */}
      <div className="mb-2.5">
        <h4 className="text-xs font-bold text-[var(--text-ink)] group-hover:text-[#0B1F3A] dark:group-hover:text-[var(--accent-color)] transition-colors leading-snug line-clamp-1">
          {lead.businessName || lead.name}
        </h4>
        <p className="text-[11px] text-[var(--text-muted)] mt-0.5 flex items-center gap-1 truncate">
          <Building2 className="w-3 h-3 text-[var(--text-subtle)] shrink-0" />
          <span className="truncate">{lead.name} • {lead.city}</span>
        </p>
      </div>

      {/* Services tags */}
      {lead.services && lead.services.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {lead.services.slice(0, 2).map((srv) => (
            <span
              key={srv}
              className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-muted)] truncate max-w-[140px]"
            >
              {srv}
            </span>
          ))}
          {lead.services.length > 2 && (
            <span className="text-[10px] px-1 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-subtle)]">
              +{lead.services.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Footer: Value + Quick Action Icons */}
      <div className="flex items-center justify-between pt-2.5 border-t border-[var(--border-subtle)]">
        <div>
          <span className="text-[10px] text-[var(--text-subtle)] block uppercase font-medium leading-none mb-0.5">
            Value
          </span>
          <span className="text-xs font-extrabold text-[#0B1F3A] dark:text-[var(--accent-color)]">
            {formatCurrency(lead.expectedValue, lead.currency)}
          </span>
        </div>

        {/* Quick Contacts */}
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {lead.phone && (
            <a
              href={`tel:${lead.phone}`}
              className="p-1 rounded text-[var(--text-muted)] hover:text-[#0B1F3A] hover:bg-[var(--bg-subtle)] transition-colors"
              title="Direct Phone Call"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          )}
          {lead.phone && (
            <a
              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="p-1 rounded text-[var(--text-muted)] hover:text-[#1F8A5B] hover:bg-[var(--bg-subtle)] transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </a>
          )}
          {lead.email && (
            <a
              href={`mailto:${lead.email}`}
              className="p-1 rounded text-[var(--text-muted)] hover:text-[#2F6FB5] hover:bg-[var(--bg-subtle)] transition-colors"
              title="Send Email"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
