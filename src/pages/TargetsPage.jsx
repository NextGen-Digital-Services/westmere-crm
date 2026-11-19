import React, { useState } from 'react';
import { Target, TrendingUp, Calendar, CheckCircle2, AlertTriangle, ArrowUpRight, Edit3 } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { showToast } from '../hooks/useToast';

export function TargetsPage() {
  const { settings, updateSettings, leads } = useAppStore();
  const [period, setPeriod] = useState(settings.targets?.period || 'month');
  const [editModalOpen, setEditModalOpen] = useState(false);

  const targets = settings.targets || {
    newProspects: 100,
    outreach: 100,
    qualifiedLeads: 15,
    meetings: 5,
    proposals: 5,
    closedDealsMin: 1,
    closedDealsMax: 2,
  };

  const [formTargets, setFormTargets] = useState({ ...targets });

  // Real-time actuals computed from leads
  const wonCount = leads.filter((l) => l.stage === 'won').length;
  const proposalsSent = leads.filter((l) => ['proposal_sent', 'negotiation', 'won'].includes(l.stage)).length;
  const meetingsDone = leads.filter((l) => ['meeting', 'proposal_sent', 'negotiation', 'won'].includes(l.stage)).length;
  const qualifiedDone = leads.filter((l) => ['qualified', 'meeting', 'proposal_sent', 'negotiation', 'won'].includes(l.stage)).length;
  const outreachDone = leads.filter((l) => l.stage !== 'lead_generated').length;
  const newProspectsDone = leads.length;

  // Day 19 of a 30-day billing month -> 11 days remaining
  const daysPassed = 19;
  const totalDays = 30;
  const daysRemaining = 11;
  const expectedPacePct = daysPassed / totalDays; // ~63%

  const targetList = [
    {
      id: 'prospects',
      name: 'New Prospects Added',
      actual: newProspectsDone,
      target: targets.newProspects,
      description: 'Total identified accounts in pipeline',
      color: '#2F6FB5',
    },
    {
      id: 'outreach',
      name: 'Outreach Dispatched',
      actual: outreachDone,
      target: targets.outreach,
      description: 'WhatsApp, email & LinkedIn touches',
      color: '#0B1F3A',
    },
    {
      id: 'qualified',
      name: 'Qualified Leads (BANT)',
      actual: qualifiedDone,
      target: targets.qualifiedLeads,
      description: 'Budget, requirement & DM verified',
      color: '#C9A24B',
    },
    {
      id: 'meetings',
      name: 'Discovery Meetings / Demos',
      actual: meetingsDone,
      target: targets.meetings,
      description: 'Held or scheduled product presentations',
      color: '#D98A1B',
    },
    {
      id: 'proposals',
      name: 'Proposals Delivered',
      actual: proposalsSent,
      target: targets.proposals,
      description: 'Formal scope & price proposals delivered',
      color: '#16335C',
    },
    {
      id: 'closed_won',
      name: 'Closed Won Contracts',
      actual: wonCount,
      target: targets.closedDealsMax,
      minTarget: targets.closedDealsMin,
      description: 'Signed agreements with 25-30% advance',
      color: '#1F8A5B',
    },
  ];

  const getPaceStatus = (actual, target) => {
    const currentPct = actual / target;
    if (currentPct >= expectedPacePct + 0.05) {
      return { status: 'Ahead of Pace', variant: 'success', color: 'text-[#1F8A5B]' };
    }
    if (currentPct >= expectedPacePct - 0.1) {
      return { status: 'On Track', variant: 'warning', color: 'text-[#D98A1B]' };
    }
    return { status: 'Behind Pace', variant: 'danger', color: 'text-[#C23B3B]' };
  };

  const handleSaveTargets = (e) => {
    e.preventDefault();
    updateSettings({
      targets: {
        ...formTargets,
        period,
      },
    });
    setEditModalOpen(false);
    showToast({ type: 'success', title: 'Targets Updated', message: 'Sales targets and quotas saved.' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-ink)] tracking-tight">Sales Targets & Pace</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Compare real activity performance against monthly quota objectives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Period selector */}
          <div className="flex rounded-button border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-0.5 text-xs">
            {['week', 'month', 'custom'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-button capitalize font-medium transition-colors ${
                  period === p
                    ? 'bg-[#0B1F3A] text-white dark:bg-[var(--accent-color)] dark:text-[#0B1F3A]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-ink)]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <Button variant="outline" size="sm" icon={Edit3} onClick={() => setEditModalOpen(true)}>
            Edit Quotas
          </Button>
        </div>
      </div>

      {/* Target Pace Banner */}
      <Card className="bg-[#0B1F3A] text-white border-0 shadow-solid-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-[var(--accent-color)]" />
              <span className="text-xs font-semibold text-[var(--accent-color)] uppercase tracking-wider">
                Current Cycle: Day {daysPassed} of {totalDays}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white">
              {daysRemaining} business days remaining to close November quota
            </h2>
            <p className="text-xs text-[#8EA3BF] mt-1 max-w-xl">
              Agency target pace requires closing at least 1 more contract (₹8L+ or AED 50k+) and qualifying 4 more accounts this week.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-3 rounded-card bg-[#16335C] border border-[#1E3E6B] text-center">
              <span className="text-xl font-extrabold text-white">{wonCount} / {targets.closedDealsMax}</span>
              <p className="text-[10px] text-[#8EA3BF] uppercase font-bold mt-0.5">Deals Closed</p>
            </div>
            <div className="px-4 py-3 rounded-card bg-[#16335C] border border-[#1E3E6B] text-center">
              <span className="text-xl font-extrabold text-[var(--accent-color)]">
                {Math.round((wonCount / targets.closedDealsMax) * 100)}%
              </span>
              <p className="text-[10px] text-[#8EA3BF] uppercase font-bold mt-0.5">Quota Hit</p>
            </div>
          </div>
        </div>
      </Card>

      {/* 6 Target Quota Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {targetList.map((item) => {
          const pct = Math.round((item.actual / item.target) * 100);
          const pace = getPaceStatus(item.actual, item.target);
          const remaining = Math.max(0, item.target - item.actual);
          const dailyRequired = (remaining / daysRemaining).toFixed(1);

          return (
            <Card key={item.id} className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[var(--text-ink)] leading-snug">{item.name}</h3>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{item.description}</p>
                </div>
                <Badge variant={pace.variant} size="sm">
                  {pace.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between gap-4 py-2 border-y border-[var(--border-subtle)]">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold text-[var(--text-ink)]">{item.actual}</span>
                    <span className="text-xs text-[var(--text-subtle)] font-semibold">/ {item.target}</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    {remaining === 0 ? 'Target achieved!' : `${remaining} needed to hit target`}
                  </p>
                </div>

                <ProgressRing progress={pct} color={item.color} size={64} strokeWidth={6}>
                  <span className="text-xs font-extrabold text-[var(--text-ink)]">{pct}%</span>
                </ProgressRing>
              </div>

              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-0.5">
                <span>Daily pace required:</span>
                <span className="font-bold text-[var(--text-ink)]">
                  {remaining === 0 ? 'Quota Met' : `${dailyRequired} / day`}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Edit Targets Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Sales Quotas & Targets"
        subtitle="Adjust monthly benchmark expectations for the agency team"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveTargets} className="space-y-3.5">
          <Input
            label="New Prospects Target"
            type="number"
            value={formTargets.newProspects}
            onChange={(e) => setFormTargets({ ...formTargets, newProspects: Number(e.target.value) })}
          />

          <Input
            label="Outreach Messages Target"
            type="number"
            value={formTargets.outreach}
            onChange={(e) => setFormTargets({ ...formTargets, outreach: Number(e.target.value) })}
          />

          <Input
            label="Qualified Leads Target (BANT)"
            type="number"
            value={formTargets.qualifiedLeads}
            onChange={(e) => setFormTargets({ ...formTargets, qualifiedLeads: Number(e.target.value) })}
          />

          <Input
            label="Meetings / Demos Target"
            type="number"
            value={formTargets.meetings}
            onChange={(e) => setFormTargets({ ...formTargets, meetings: Number(e.target.value) })}
          />

          <Input
            label="Proposals Sent Target"
            type="number"
            value={formTargets.proposals}
            onChange={(e) => setFormTargets({ ...formTargets, proposals: Number(e.target.value) })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Closed Deals Min"
              type="number"
              value={formTargets.closedDealsMin}
              onChange={(e) => setFormTargets({ ...formTargets, closedDealsMin: Number(e.target.value) })}
            />
            <Input
              label="Closed Deals Max"
              type="number"
              value={formTargets.closedDealsMax}
              onChange={(e) => setFormTargets({ ...formTargets, closedDealsMax: Number(e.target.value) })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
            <Button variant="secondary" size="sm" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Quotas
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
