import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  Clock,
  DollarSign,
  PieChart as PieIcon,
  Zap,
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { RevenueChart } from '../components/charts/RevenueChart';
import { SplitPieChart } from '../components/charts/SplitPieChart';
import { formatCurrency } from '../lib/formatters';
import { showToast } from '../hooks/useToast';
import Papa from 'papaparse';

export function AnalyticsPage() {
  const { leads } = useAppStore();
  const [dateRange, setDateRange] = useState('Last 30 Days');

  // Stage Velocity Data (Average Days in Stage)
  const stageVelocity = [
    { stage: 'Lead Generated', avgDays: 2.8, color: '#2F6FB5' },
    { stage: 'Contacted', avgDays: 3.5, color: '#3A81D1' },
    { stage: 'Qualified', avgDays: 5.2, color: '#C9A24B' },
    { stage: 'Meeting / Demo', avgDays: 4.8, color: '#D98A1B' },
    { stage: 'Proposal Sent', avgDays: 6.4, color: '#1F8A5B' },
    { stage: 'Negotiation', avgDays: 5.9, color: '#9E7928' },
  ];

  // Channel ROI & Reply Rates
  const channelMetrics = [
    { channel: 'WhatsApp Marketing', sent: 142, replies: 68, rate: '47.8%', roi: '4.8x' },
    { channel: 'Referral / Partners', sent: 18, replies: 14, rate: '77.7%', roi: '6.2x' },
    { channel: 'Inbound Website', sent: 64, replies: 38, rate: '59.3%', roi: '5.1x' },
    { channel: 'LinkedIn Outreach', sent: 95, replies: 31, rate: '32.6%', roi: '3.4x' },
    { channel: 'Cold Email', sent: 210, replies: 48, rate: '22.8%', roi: '2.8x' },
    { channel: 'Meta Lead Ads', sent: 88, replies: 41, rate: '46.5%', roi: '3.9x' },
  ];

  // Market comparison metrics
  const indiaLeads = leads.filter((l) => l.market === 'India');
  const uaeLeads = leads.filter((l) => l.market === 'UAE');

  const indiaWon = indiaLeads.filter((l) => l.stage === 'won');
  const uaeWon = uaeLeads.filter((l) => l.stage === 'won');

  const indiaWonTotal = indiaWon.reduce((a, b) => a + (Number(b.expectedValue) || 0), 0);
  const uaeWonTotal = uaeWon.reduce((a, b) => a + (Number(b.expectedValue) || 0), 0);

  const handleExportData = () => {
    const data = channelMetrics.map((c) => ({
      Channel: c.channel,
      TouchesSent: c.sent,
      RepliesReceived: c.replies,
      ReplyRate: c.rate,
      EstimatedROI: c.roi,
    }));
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Westmere_Analytics_Data.csv';
    link.click();
    showToast({ type: 'success', title: 'Data Exported', message: 'Channel performance spreadsheet saved.' });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-ink)] tracking-tight">Sales Analytics & Velocity</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Stage velocity, channel response rates, and regional ROI analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-xs rounded-button border border-[var(--border-subtle)] px-3 py-1.5 bg-[var(--bg-surface)] text-[var(--text-ink)] focus:outline-none"
          >
            <option>Last 30 Days</option>
            <option>Q4 2026 (Oct–Dec)</option>
            <option>Year-to-Date 2026</option>
            <option>All Time</option>
          </select>

          <Button variant="outline" size="sm" icon={Download} onClick={handleExportData}>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Row 1: Territory Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* India Territory Card */}
        <Card className="space-y-3 border-l-4 border-l-[#0B1F3A]">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[var(--text-ink)]">🇮🇳 India Domestic Market (INR)</h3>
            <Badge variant="navy">INR Currency</Badge>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs pt-1">
            <div>
              <p className="text-[10px] text-[var(--text-muted)] uppercase">Pipeline Deals</p>
              <p className="text-base font-extrabold text-[var(--text-ink)] mt-0.5">{indiaLeads.length}</p>
            </div>
            <div>
              <p className="text-[10px] text-[var(--text-muted)] uppercase">Won Deals</p>
              <p className="text-base font-extrabold text-[#1F8A5B] mt-0.5">{indiaWon.length}</p>
            </div>
            <div>
              <p className="text-[10px] text-[var(--text-muted)] uppercase">Won Revenue</p>
              <p className="text-base font-extrabold text-[#0B1F3A] dark:text-[var(--accent-color)] mt-0.5">
                ₹{(indiaWonTotal / 100000).toFixed(1)}L
              </p>
            </div>
          </div>
        </Card>

        {/* UAE Territory Card */}
        <Card className="space-y-3 border-l-4 border-l-[#C9A24B]">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[var(--text-ink)]">🇦🇪 UAE / GCC Territory (AED)</h3>
            <Badge variant="gold">AED Currency</Badge>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs pt-1">
            <div>
              <p className="text-[10px] text-[var(--text-muted)] uppercase">Pipeline Deals</p>
              <p className="text-base font-extrabold text-[var(--text-ink)] mt-0.5">{uaeLeads.length}</p>
            </div>
            <div>
              <p className="text-[10px] text-[var(--text-muted)] uppercase">Won Deals</p>
              <p className="text-base font-extrabold text-[#1F8A5B] mt-0.5">{uaeWon.length}</p>
            </div>
            <div>
              <p className="text-[10px] text-[var(--text-muted)] uppercase">Won Revenue</p>
              <p className="text-base font-extrabold text-[#C9A24B] mt-0.5">
                AED {uaeWonTotal.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Row 2: Stage Velocity & Turnaround */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-ink)]">Stage Velocity: Average Days Spent Per Stage</h3>
            <p className="text-[11px] text-[var(--text-muted)]">Identifying sales bottlenecks before proposals stale</p>
          </div>
          <span className="text-xs font-semibold text-[var(--text-muted)]">
            Total Average Sales Cycle: <span className="font-bold text-[var(--text-ink)]">28.6 Days</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stageVelocity.map((sv) => (
            <div key={sv.stage} className="p-3 rounded-card bg-[var(--bg-main)]/60 border border-[var(--border-subtle)] text-center space-y-1">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: sv.color }} />
              <p className="text-xs font-bold text-[var(--text-ink)] truncate">{sv.stage}</p>
              <p className="text-lg font-extrabold text-[var(--text-ink)] mt-1">{sv.avgDays} <span className="text-[10px] text-[var(--text-subtle)] font-medium">Days</span></p>
              <p className="text-[10px] text-[var(--text-muted)]">Avg turnaround</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Row 3: Channel ROI & Response Rates Table */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-ink)]">Outreach Channel Engagement & ROI</h3>
            <p className="text-[11px] text-[var(--text-muted)]">Performance across WhatsApp, Email, LinkedIn & Ads</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-muted)] font-semibold uppercase text-[11px]">
                <th className="p-3">Outreach Channel</th>
                <th className="p-3 text-center">Touches Sent</th>
                <th className="p-3 text-center">Replies Received</th>
                <th className="p-3 text-center">Response Rate</th>
                <th className="p-3 text-right">Attributed ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {channelMetrics.map((row) => (
                <tr key={row.channel} className="hover:bg-[var(--bg-subtle)]/40 transition-colors">
                  <td className="p-3 font-semibold text-[var(--text-ink)]">{row.channel}</td>
                  <td className="p-3 text-center">{row.sent}</td>
                  <td className="p-3 text-center font-bold text-[var(--text-ink)]">{row.replies}</td>
                  <td className="p-3 text-center font-bold text-[#1F8A5B]">{row.rate}</td>
                  <td className="p-3 text-right font-extrabold text-[#0B1F3A] dark:text-[var(--accent-color)]">{row.roi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
