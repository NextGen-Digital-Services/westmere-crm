import React, { useState } from 'react';
import { Award, XCircle, RotateCcw, Calendar, DollarSign, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { SplitPieChart } from '../components/charts/SplitPieChart';
import { formatCurrency, formatDate } from '../lib/formatters';
import { showToast } from '../hooks/useToast';

export function WonLostPage() {
  const { leads, moveLeadStage, openLeadDrawer } = useAppStore();

  const [activeTab, setActiveTab] = useState('won'); // 'won' | 'lost'

  const wonLeads = leads.filter((l) => l.stage === 'won');
  const lostLeads = leads.filter((l) => l.stage === 'lost');

  const totalWonRevenue = wonLeads.reduce((acc, curr) => acc + (Number(curr.expectedValue) || 0), 0);
  const totalAdvancesCollected = wonLeads.reduce((acc, curr) => acc + (Number(curr.advanceReceivedAmount) || 0), 0);

  // Lost reason breakdown
  const lossReasonCounts = {};
  lostLeads.forEach((l) => {
    const reason = l.lossReason || 'Other';
    lossReasonCounts[reason] = (lossReasonCounts[reason] || 0) + 1;
  });

  const lossColors = ['#C23B3B', '#D98A1B', '#536471', '#9E7928', '#2F6FB5', '#16335C'];
  const lossPieData = Object.entries(lossReasonCounts).map(([name, value], idx) => ({
    name,
    value,
    color: lossColors[idx % lossColors.length],
  }));

  const handleReviveLead = (lead) => {
    moveLeadStage(lead.id, 'qualified', {
      lossReason: null,
      lossNotes: null,
    });
    showToast({
      type: 'success',
      title: 'Deal Revived!',
      message: `${lead.businessName} restored to Qualified stage for re-engagement.`,
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-ink)] tracking-tight">Won & Lost Analysis</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Audit closed contract wins, advance collection, and analyze churn patterns to optimize agency sales.
          </p>
        </div>

        {/* Win/Loss Ratio KPI Pill */}
        <div className="flex items-center gap-2 p-2 rounded-card bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-solid-sm text-xs">
          <span className="font-semibold text-[var(--text-muted)]">Closing Win Rate:</span>
          <span className="font-extrabold text-[#1F8A5B]">
            {wonLeads.length + lostLeads.length > 0
              ? Math.round((wonLeads.length / (wonLeads.length + lostLeads.length)) * 100)
              : 0}
            %
          </span>
          <span className="text-[11px] text-[var(--text-subtle)]">
            ({wonLeads.length} Won / {lostLeads.length} Lost)
          </span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'won', label: 'Closed Won Deals', count: wonLeads.length },
          { id: 'lost', label: 'Lost Deals & Churn Analysis', count: lostLeads.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* TAB 1: Won Deals */}
      {activeTab === 'won' && (
        <div className="space-y-4">
          {/* Top Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card className="text-center p-4">
              <span className="text-[10px] text-[var(--text-subtle)] uppercase font-bold">Total Contract Value</span>
              <p className="text-lg font-extrabold text-[#1F8A5B] mt-0.5">{formatCurrency(totalWonRevenue)}</p>
            </Card>
            <Card className="text-center p-4">
              <span className="text-[10px] text-[var(--text-subtle)] uppercase font-bold">Advance Collected (Cash Flow)</span>
              <p className="text-lg font-extrabold text-[#0B1F3A] dark:text-[var(--accent-color)] mt-0.5">
                {formatCurrency(totalAdvancesCollected)}
              </p>
            </Card>
            <Card className="text-center p-4">
              <span className="text-[10px] text-[var(--text-subtle)] uppercase font-bold">Closed Deals</span>
              <p className="text-lg font-extrabold text-[var(--text-ink)] mt-0.5">{wonLeads.length} Engagements</p>
            </Card>
          </div>

          {/* Won Deals List */}
          <div className="space-y-3">
            {wonLeads.map((deal) => (
              <Card key={deal.id} className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#E8F5EE] text-[#1F8A5B] flex items-center justify-center font-bold shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[var(--text-ink)]">{deal.businessName}</h3>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                        Contact: {deal.name} ({deal.contactPersonRole}) • {deal.city}, {deal.market}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-[#1F8A5B]">
                      {formatCurrency(deal.expectedValue, deal.currency)}
                    </span>
                    <p className="text-[10px] text-[var(--text-subtle)] font-medium">Contract Signed</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[var(--bg-main)]/50 p-3 rounded-button border border-[var(--border-subtle)]">
                  <div>
                    <span className="text-[10px] font-bold text-[var(--text-subtle)] uppercase">Advance Collected</span>
                    <p className="font-bold text-[#1F8A5B] mt-0.5">
                      {formatCurrency(deal.advanceReceivedAmount, deal.currency)}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      {deal.advancePaymentMode || 'Wire'} • {formatDate(deal.advanceReceivedDate)}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[var(--text-subtle)] uppercase">Project Kickoff Date</span>
                    <p className="font-bold text-[var(--text-ink)] mt-0.5">
                      {formatDate(deal.projectKickoffDate) || 'Pending schedule'}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)]">Engineering Squad Assigned</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[var(--text-subtle)] uppercase">Services Contracted</span>
                    <p className="font-semibold text-[var(--text-ink)] mt-0.5 truncate">
                      {(deal.services || []).join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1 text-xs">
                  <span className="text-[11px] text-[var(--text-subtle)]">Account Lead: {deal.owner || 'Rohan Sharma'}</span>
                  <button
                    type="button"
                    onClick={() => openLeadDrawer(deal.id)}
                    className="font-semibold text-[#0B1F3A] dark:text-[var(--accent-color)] hover:underline"
                  >
                    View Project Timeline →
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Lost Deals & Churn Analysis */}
      {activeTab === 'lost' && (
        <div className="space-y-4">
          {/* Reason Breakdown Chart & Insight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="space-y-3">
              <h3 className="text-xs font-bold text-[var(--text-ink)] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2.5">
                Loss Reason Distribution
              </h3>
              <SplitPieChart data={lossPieData} totalLabel="Lost Deals" />
            </Card>

            <Card className="space-y-3">
              <h3 className="text-xs font-bold text-[var(--text-ink)] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2.5">
                Agency Win/Loss Key Learnings
              </h3>
              <div className="space-y-2 text-xs text-[var(--text-ink)] leading-relaxed">
                <p>
                  • <span className="font-bold">Price Mismatches:</span> 50% of lost deals cited budget gaps. Consider packaging smaller Phase 1 MVP sprint deliverables.
                </p>
                <p>
                  • <span className="font-bold">Competitor Pressure:</span> Clients choosing local GCC firms emphasized onsite board presence. Highlight Westmere's Downtown Dubai office.
                </p>
                <p>
                  • <span className="font-bold">Revive Potential:</span> Postponed accounts can be revived in Q1 2027 with tailored follow-up reminders.
                </p>
              </div>
            </Card>
          </div>

          {/* Lost Deals List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[var(--text-subtle)] uppercase tracking-wider">
              Lost Deal Files ({lostLeads.length})
            </h3>
            {lostLeads.map((deal) => (
              <Card key={deal.id} className="space-y-3 border-[#F4C7C7]/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#FAECEC] text-[#C23B3B] flex items-center justify-center font-bold shrink-0">
                      <XCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[var(--text-ink)]">{deal.businessName}</h3>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                        {deal.name} • {deal.city}, {deal.market} • Valued: {formatCurrency(deal.expectedValue, deal.currency)}
                      </p>
                    </div>
                  </div>

                  <Badge variant="danger" size="md">
                    {deal.lossReason || 'Lost'}
                  </Badge>
                </div>

                <div className="p-3 rounded-button bg-[var(--bg-main)]/60 border border-[var(--border-subtle)] text-xs space-y-1">
                  <span className="text-[10px] font-bold text-[var(--text-subtle)] uppercase">Client Loss Context</span>
                  <p className="text-[var(--text-ink)] leading-relaxed">
                    {deal.lossNotes || 'No specific loss notes entered.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => openLeadDrawer(deal.id)}
                    className="text-xs text-[var(--text-muted)] hover:underline"
                  >
                    View File
                  </button>

                  <Button
                    variant="outline"
                    size="sm"
                    icon={RotateCcw}
                    onClick={() => handleReviveLead(deal)}
                    className="text-[#1F8A5B] hover:border-[#1F8A5B]"
                  >
                    Revive Lead
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
