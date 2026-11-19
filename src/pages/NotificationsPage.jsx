import React from 'react';
import {
  Bell,
  AlertTriangle,
  Clock,
  Calendar,
  TrendingDown,
  CheckCircle2,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatDate } from '../lib/formatters';

export function NotificationsPage() {
  const { tasks, leads, meetings, settings, openLeadDrawer } = useAppStore();
  const staleThreshold = settings.pipeline?.staleThresholdDays || 7;

  // 1. Overdue tasks
  const overdueTasks = tasks.filter((t) => t.status === 'pending' && t.dueDate < '2026-11-19');

  // 2. Stale leads (no activity in 7+ days)
  const staleLeads = leads.filter((l) => {
    if (!l.lastActivityDate || ['won', 'lost'].includes(l.stage)) return false;
    const diff = (Date.now() - new Date(l.lastActivityDate).getTime()) / (1000 * 60 * 60 * 24);
    return diff >= staleThreshold;
  });

  // 3. Upcoming meetings
  const upcomingMeetings = meetings.filter((m) => m.status === 'scheduled');

  // 4. Target Pace alerts
  const paceAlerts = [
    {
      id: 'pa-1',
      title: 'Closed Deals Behind Quota Target',
      description: 'Currently at 5 won deals. Need 1 more closing this week to maintain targeted quarterly run-rate.',
      severity: 'warning',
    },
    {
      id: 'pa-2',
      title: 'WhatsApp Sequence Conversion Boost',
      description: 'Prospects replied 2.1x faster when Day 0 WhatsApp message was dispatched within 2 hours of inquiry.',
      severity: 'info',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-ink)] tracking-tight">Notification Center</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Operational alerts for overdue follow-ups, stale prospect files, and upcoming meetings.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Overdue Tasks Section */}
        {overdueTasks.length > 0 && (
          <Card className="space-y-3 border-l-4 border-l-[#C23B3B]">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
              <div className="flex items-center gap-2 font-bold text-xs text-[#C23B3B]">
                <AlertTriangle className="w-4 h-4" />
                <span>Overdue Action Items ({overdueTasks.length})</span>
              </div>
              <Badge variant="danger" size="sm">Urgent Attention</Badge>
            </div>

            <div className="space-y-2">
              {overdueTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => task.leadId && openLeadDrawer(task.leadId)}
                  className="p-3 rounded-button border border-[var(--border-subtle)] bg-[var(--bg-main)] hover:border-[#0B1F3A] cursor-pointer text-xs flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-[var(--text-ink)]">{task.title}</p>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                      {task.leadName} • Due date was {formatDate(task.dueDate)}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--text-subtle)]" />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Stale Leads Section */}
        {staleLeads.length > 0 && (
          <Card className="space-y-3 border-l-4 border-l-[#D98A1B]">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
              <div className="flex items-center gap-2 font-bold text-xs text-[#D98A1B]">
                <Clock className="w-4 h-4" />
                <span>Stale Prospects Untouched For {staleThreshold}+ Days ({staleLeads.length})</span>
              </div>
              <Badge variant="warning" size="sm">Re-engagement Required</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {staleLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => openLeadDrawer(lead.id)}
                  className="p-3 rounded-button border border-[var(--border-subtle)] bg-[var(--bg-main)] hover:border-[#0B1F3A] cursor-pointer text-xs flex items-center justify-between"
                >
                  <div className="truncate">
                    <p className="font-semibold text-[var(--text-ink)] truncate">{lead.businessName || lead.name}</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                      Stage: {lead.stage.replace('_', ' ')} • Last touch: {formatDate(lead.lastActivityDate)}
                    </p>
                  </div>
                  <Badge variant="outline" size="sm">Open</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Target Pace Insights */}
        <Card className="space-y-3 border-l-4 border-l-[#2F6FB5]">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
            <div className="flex items-center gap-2 font-bold text-xs text-[#2F6FB5]">
              <TrendingDown className="w-4 h-4" />
              <span>Agency Quota Pace Insights</span>
            </div>
          </div>

          <div className="space-y-2">
            {paceAlerts.map((pa) => (
              <div key={pa.id} className="p-3 rounded-button bg-[var(--bg-main)]/60 border border-[var(--border-subtle)] text-xs">
                <p className="font-semibold text-[var(--text-ink)]">{pa.title}</p>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-relaxed">{pa.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
