import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

export function formatCurrency(amount = 0, currency = 'INR') {
  const num = Number(amount) || 0;
  if (currency === 'AED') {
    return `AED ${num.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }
  // Standard Indian formatting
  return `₹${num.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export function formatDate(dateInput, formatStr = 'MMM d, yyyy') {
  if (!dateInput) return '—';
  try {
    const d = typeof dateInput === 'string' ? parseISO(dateInput) : new Date(dateInput);
    if (!isValid(d)) return '—';
    return format(d, formatStr);
  } catch (err) {
    return '—';
  }
}

export function formatTimeAgo(dateInput) {
  if (!dateInput) return '—';
  try {
    const d = typeof dateInput === 'string' ? parseISO(dateInput) : new Date(dateInput);
    if (!isValid(d)) return '—';
    return formatDistanceToNow(d, { addSuffix: true });
  } catch (err) {
    return '—';
  }
}

export function calculateLeadScore(lead) {
  const breakdown = [];
  let total = 0;

  // 1. Budget Verified (25 pts)
  const hasBudget = Boolean(lead.budgetVerified || (lead.expectedValue && lead.expectedValue > 0));
  const budgetPts = hasBudget ? 25 : 0;
  total += budgetPts;
  breakdown.push({
    factor: 'Budget Verified',
    points: budgetPts,
    max: 25,
    status: hasBudget ? 'Verified' : 'Unconfirmed',
  });

  // 2. Decision Maker Verified (25 pts)
  const dmPts = lead.decisionMakerVerified ? 25 : (lead.contactPersonRole?.toLowerCase().includes('founder') || lead.contactPersonRole?.toLowerCase().includes('ceo') || lead.contactPersonRole?.toLowerCase().includes('director') ? 18 : 5);
  total += dmPts;
  breakdown.push({
    factor: 'Decision Maker',
    points: dmPts,
    max: 25,
    status: lead.decisionMakerVerified ? 'Direct DM' : 'Influencer / Open',
  });

  // 3. Meeting Done / Scheduled (20 pts)
  const meetingStages = ['meeting', 'proposal_sent', 'negotiation', 'won'];
  const hasMeeting = lead.meetingDateTime || meetingStages.includes(lead.stage);
  const meetingPts = lead.stage === 'won' ? 20 : (hasMeeting ? 18 : (lead.stage === 'qualified' ? 10 : 0));
  total += meetingPts;
  breakdown.push({
    factor: 'Meeting Progress',
    points: meetingPts,
    max: 20,
    status: hasMeeting ? 'Conducted / Booked' : 'Pending',
  });

  // 4. Source Quality (15 pts)
  let sourcePts = 8;
  if (['Inbound Website', 'Referral / Partner'].includes(lead.source)) {
    sourcePts = 15;
  } else if (['Meta Ads (Lead Form)', 'Google Ads'].includes(lead.source)) {
    sourcePts = 12;
  } else if (['LinkedIn Outreach', 'WhatsApp Marketing'].includes(lead.source)) {
    sourcePts = 10;
  }
  total += sourcePts;
  breakdown.push({
    factor: 'Channel Intent',
    points: sourcePts,
    max: 15,
    status: lead.source || 'General',
  });

  // 5. Engagement & Urgency (15 pts)
  let urgencyPts = 7;
  if (lead.priority === 'Hot') urgencyPts = 15;
  else if (lead.priority === 'Warm') urgencyPts = 11;
  total += urgencyPts;
  breakdown.push({
    factor: 'Urgency & Priority',
    points: urgencyPts,
    max: 15,
    status: lead.priority || 'Medium',
  });

  return {
    total: Math.min(100, Math.max(0, total)),
    breakdown,
  };
}

export function isLeadStale(lastActivityDate, staleThresholdDays = 7) {
  if (!lastActivityDate) return false;
  try {
    const last = typeof lastActivityDate === 'string' ? parseISO(lastActivityDate) : new Date(lastActivityDate);
    const diffDays = (Date.now() - last.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays >= staleThresholdDays;
  } catch (e) {
    return false;
  }
}
