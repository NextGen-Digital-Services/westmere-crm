import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Send,
  CheckCircle,
  Calendar,
  FileText,
  Award,
  TrendingUp,
  DollarSign,
  PieChart as PieIcon,
  Clock,
  AlertTriangle,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { KpiCard } from '../components/charts/KpiCard';
import { FunnelChart } from '../components/charts/FunnelChart';
import { RevenueChart } from '../components/charts/RevenueChart';
import { SplitPieChart } from '../components/charts/SplitPieChart';
import { ActivityHeatmap } from '../components/charts/ActivityHeatmap';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatCurrency, formatDate } from '../lib/formatters';

export function DashboardPage() {
  const navigate = useNavigate();
  const { leads, tasks, meetings, settings, openLeadDrawer } = useAppStore();

  // Metrics computation from real leads data
  const newProspectsCount = leads.filter((l) => l.stage === 'lead_generated').length;
  const contactedCount = leads.filter((l) => l.stage === 'contacted').length;
  const qualifiedCount = leads.filter((l) => l.stage === 'qualified').length;
  const meetingsCount = leads.filter((l) => l.stage === 'meeting').length;
  const proposalsCount = leads.filter((l) => l.stage === 'proposal_sent').length;
  const wonLeads = leads.filter((l) => l.stage === 'won');
  const lostLeads = leads.filter((l) => l.stage === 'lost');

  const wonRevenue = wonLeads.reduce((acc, curr) => acc + (Number(curr.expectedValue) || 0), 0);
  const activePipelineLeads = leads.filter((l) => !['won', 'lost'].includes(l.stage));
  const pipelineTotal = activePipelineLeads.reduce((acc, curr) => acc + (Number(curr.expectedValue) || 0), 0);

  // Weighted forecast: sum of each deal * stage probability
  const weightedForecast = activePipelineLeads.reduce((acc, curr) => {
    const stageObj = (settings.pipeline?.stages || []).find((s) => s.id === curr.stage);
    const prob = stageObj?.probability || 25;
    return acc + (Number(curr.expectedValue) || 0) * (prob / 100);
  }, 0);

  const totalClosed = wonLeads.length + lostLeads.length;
  const winRate = totalClosed > 0 ? Math.round((wonLeads.length / totalClosed) * 100) : 60;
  const avgDealCycleDays = 22;

  // Target vs Actual calculations
  const targets = settings.targets || { newProspects: 100, outreach: 100, qualifiedLeads: 15, meetings: 5, proposals: 5, closedDealsMax: 2 };
  const targetActuals = [
    { label: 'Outreach', actual: contactedCount + newProspectsCount, target: targets.outreach, color: '#2F6FB5' },
    { label: 'Qualified', actual: qualifiedCount, target: targets.qualifiedLeads, color: '#C9A24B' },
    { label: 'Meetings', actual: meetingsCount, target: targets.meetings, color: '#D98A1B' },
    { label: 'Won Deals', actual: wonLeads.length, target: targets.closedDealsMax, color: '#1F8A5B' },
  ];

  // Service split data
  const serviceCounts = {};
  leads.forEach((l) => {
    (l.services || []).forEach((srv) => {
      serviceCounts[srv] = (serviceCounts[srv] || 0) + 1;
    });
  });
  const servicePieData = Object.entries(serviceCounts).map(([name, value]) => ({ name, value }));

  // Market split data (India vs UAE)
  const indiaLeads = leads.filter((l) => l.market === 'India').length;
  const uaeLeads = leads.filter((l) => l.market === 'UAE').length;
  const marketPieData = [
    { name: 'India (Domestic INR)', value: indiaLeads, color: '#0B1F3A' },
    { name: 'UAE (Dubai / AED)', value: uaeLeads, color: '#C9A24B' },
  ];

  // Today's focus items
  const overdueTasks = tasks.filter((t) => t.status === 'pending' && t.dueDate < '2026-11-19').slice(0, 3);
  const todaysMeetings = meetings.filter((m) => m.dateTime?.startsWith('2026-11-20') || m.dateTime?.startsWith('2026-11-21')).slice(0, 3);
  const hotUntouchedLeads = leads.filter((l) => l.priority === 'Hot' && l.stage === 'lead_generated').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Page Title & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-ink)] tracking-tight">Executive Sales Cockpit</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Real-time pipeline performance, regional deal velocity, and outreach targets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/targets')}>
            Edit Targets
          </Button>
          <Button variant="gold" size="sm" onClick={() => navigate('/pipeline')}>
            View Kanban
          </Button>
        </div>
      </div>

      {/* Row 1: KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <KpiCard
          title="Revenue Won"
          value={wonRevenue}
          prefix="₹"
          change="+18.4%"
          changeType="positive"
          icon={Award}
          subtitle="Closed advance booked"
        />
        <KpiCard
          title="Weighted Forecast"
          value={Math.round(weightedForecast)}
          prefix="₹"
          change="+12.1%"
          changeType="positive"
          icon={TrendingUp}
          subtitle="Probability-adjusted"
        />
        <KpiCard
          title="Active Pipeline"
          value={pipelineTotal}
          prefix="₹"
          change="32 deals"
          changeType="neutral"
          icon={DollarSign}
          subtitle="Across 6 active stages"
        />
        <KpiCard
          title="Agency Win Rate"
          value={winRate}
          suffix="%"
          change={`${wonLeads.length} Won / ${lostLeads.length} Lost`}
          changeType="positive"
          icon={CheckCircle}
          subtitle={`Avg cycle: ${avgDealCycleDays} days`}
        />
      </div>

      {/* Row 2: Secondary Funnel KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard title="New Prospects" value={newProspectsCount} icon={Users} onClick={() => navigate('/leads')} />
        <KpiCard title="Outreach Dispatched" value={contactedCount} icon={Send} onClick={() => navigate('/outreach')} />
        <KpiCard title="Qualified Leads" value={qualifiedCount} icon={CheckCircle} onClick={() => navigate('/pipeline')} />
        <KpiCard title="Meetings / Demos" value={meetingsCount} icon={Calendar} onClick={() => navigate('/meetings')} />
        <KpiCard title="Proposals Sent" value={proposalsCount} icon={FileText} onClick={() => navigate('/proposals')} />
        <KpiCard title="Closed Won" value={wonLeads.length} icon={Award} onClick={() => navigate('/won-lost')} />
      </div>

      {/* Row 3: Funnel & Target Rings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Animated Conversion Funnel */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-ink)]">Stage-to-Stage Conversion Funnel</h3>
              <p className="text-[11px] text-[var(--text-muted)]">Live prospect volume & conversion efficiency</p>
            </div>
            <Badge variant="navy">7 Pipeline Stages</Badge>
          </div>
          <FunnelChart leads={leads} />
        </Card>

        {/* Target vs Actual Progress Rings */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-ink)]">Monthly Target Progress</h3>
              <p className="text-[11px] text-[var(--text-muted)]">Real activity vs quota goals</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/targets')}
              className="text-xs font-semibold text-[#0B1F3A] dark:text-[var(--accent-color)] hover:underline"
            >
              Details
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            {targetActuals.map((item) => {
              const pct = item.target > 0 ? Math.round((item.actual / item.target) * 100) : 0;
              return (
                <div key={item.label} className="flex flex-col items-center text-center p-2 rounded-card bg-[var(--bg-main)]/60 border border-[var(--border-subtle)]">
                  <ProgressRing progress={pct} color={item.color} size={64} strokeWidth={6}>
                    <span className="text-xs font-extrabold text-[var(--text-ink)]">{pct}%</span>
                  </ProgressRing>
                  <p className="text-xs font-bold text-[var(--text-ink)] mt-2">{item.label}</p>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    {item.actual} / {item.target} target
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Row 4: Today's Focus Panel + Revenue Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Today's Focus Panel */}
        <Card className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#C23B3B]" />
              <h3 className="text-sm font-bold text-[var(--text-ink)]">Today's Focus & Action Items</h3>
            </div>
          </div>

          {/* Overdue Tasks */}
          {overdueTasks.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#C23B3B] uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Overdue Follow-ups ({overdueTasks.length})
              </span>
              {overdueTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => openLeadDrawer(t.leadId)}
                  className="p-2.5 rounded-button border border-[#F4C7C7] bg-[#FAECEC]/50 hover:bg-[#FAECEC] cursor-pointer text-xs transition-colors"
                >
                  <p className="font-semibold text-[#101828] truncate">{t.title}</p>
                  <p className="text-[10px] text-[#C23B3B] mt-0.5">{t.leadName} • Due {formatDate(t.dueDate)}</p>
                </div>
              ))}
            </div>
          )}

          {/* Upcoming Meetings */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-[var(--text-subtle)] uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Upcoming Demos
            </span>
            {todaysMeetings.map((m) => (
              <div
                key={m.id}
                onClick={() => openLeadDrawer(m.leadId)}
                className="p-2.5 rounded-button border border-[var(--border-subtle)] bg-[var(--bg-main)] hover:border-[#0B1F3A] cursor-pointer text-xs transition-colors"
              >
                <div className="flex items-center justify-between font-semibold text-[var(--text-ink)]">
                  <span className="truncate">{m.businessName}</span>
                  <span className="text-[10px] text-[#D98A1B]">{m.mode}</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{formatDate(m.dateTime, 'MMM d, h:mm a')}</p>
              </div>
            ))}
          </div>

          {/* Untouched Hot Leads */}
          {hotUntouchedLeads.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[var(--text-subtle)] uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3 h-3 text-[#D98A1B]" /> Hot Inbound Inquiries
              </span>
              {hotUntouchedLeads.map((hl) => (
                <div
                  key={hl.id}
                  onClick={() => openLeadDrawer(hl.id)}
                  className="p-2.5 rounded-button border border-[var(--border-subtle)] bg-[var(--bg-main)] hover:border-[#0B1F3A] cursor-pointer text-xs transition-colors flex items-center justify-between"
                >
                  <div className="truncate">
                    <p className="font-semibold text-[var(--text-ink)] truncate">{hl.businessName}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{hl.city}, {hl.market} • {formatCurrency(hl.expectedValue, hl.currency)}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--text-subtle)] shrink-0 ml-2" />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Revenue Trend Chart */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-ink)]">Closed Won Revenue vs Weighted Pipeline</h3>
              <p className="text-[11px] text-[var(--text-muted)]">Monthly trajectory in INR (Lakhs)</p>
            </div>
          </div>
          <RevenueChart />
        </Card>
      </div>

      {/* Row 5: Regional Split & Activity Heatmap */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Service-wise Split */}
        <Card className="space-y-3">
          <h3 className="text-sm font-bold text-[var(--text-ink)] border-b border-[var(--border-subtle)] pb-2.5">
            Service-Wise Demand
          </h3>
          <SplitPieChart data={servicePieData} totalLabel="Interests" />
        </Card>

        {/* India vs UAE Split */}
        <Card className="space-y-3">
          <h3 className="text-sm font-bold text-[var(--text-ink)] border-b border-[var(--border-subtle)] pb-2.5">
            Regional Territory Split
          </h3>
          <SplitPieChart data={marketPieData} totalLabel="Prospects" />
        </Card>

        {/* Activity Heatmap */}
        <Card className="space-y-3">
          <h3 className="text-sm font-bold text-[var(--text-ink)] border-b border-[var(--border-subtle)] pb-2.5">
            Sales Activity Matrix
          </h3>
          <ActivityHeatmap />
        </Card>
      </div>
    </div>
  );
}
