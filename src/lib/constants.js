export const PIPELINE_STAGES = [
  { id: 'lead_generated', name: 'Lead Generated', probability: 5, color: '#2F6FB5', description: 'Initial inquiry or scraped prospect' },
  { id: 'contacted', name: 'Contacted', probability: 10, color: '#3A81D1', description: 'First outreach message dispatched' },
  { id: 'qualified', name: 'Qualified', probability: 25, color: '#C9A24B', description: 'Budget, requirement & DM verified' },
  { id: 'meeting', name: 'Meeting / Demo', probability: 40, color: '#D98A1B', description: 'Discovery call or demo scheduled/conducted' },
  { id: 'proposal_sent', name: 'Proposal Sent', probability: 60, color: '#1F8A5B', description: 'Custom scope & pricing delivered' },
  { id: 'negotiation', name: 'Negotiation', probability: 75, color: '#9E7928', description: 'Commercial terms & scope refinement' },
  { id: 'won', name: 'Closed Won', probability: 100, color: '#1F8A5B', description: 'Advance collected & kickoff booked' },
  { id: 'lost', name: 'Closed Lost', probability: 0, color: '#C23B3B', description: 'Deal terminated with loss reason' },
];

// For the 7 main kanban columns (where Won and Lost can be viewed together or separate)
export const KANBAN_STAGES = [
  { id: 'lead_generated', name: 'Lead Generated', order: 1, probability: 5, color: '#2F6FB5' },
  { id: 'contacted', name: 'Contacted', order: 2, probability: 10, color: '#3A81D1' },
  { id: 'qualified', name: 'Qualified', order: 3, probability: 25, color: '#C9A24B' },
  { id: 'meeting', name: 'Meeting / Demo', order: 4, probability: 40, color: '#D98A1B' },
  { id: 'proposal_sent', name: 'Proposal Sent', order: 5, probability: 60, color: '#1F8A5B' },
  { id: 'negotiation', name: 'Negotiation', order: 6, probability: 75, color: '#9E7928' },
  { id: 'won_lost', name: 'Won / Lost', order: 7, probability: 100, color: '#0B1F3A', isClosingStage: true },
];

export const SERVICES = [
  'Website Development',
  'Mobile Apps',
  'Custom Software (CRM/ERP/POS)',
  'SaaS',
  'AI & Automation',
  'UI/UX Design',
];

export const MARKETS = [
  { id: 'India', name: 'India', currency: 'INR', symbol: '₹', taxName: 'GST', taxRate: 18, flag: '🇮🇳' },
  { id: 'UAE', name: 'UAE (Dubai)', currency: 'AED', symbol: 'AED', taxName: 'VAT', taxRate: 5, flag: '🇦🇪' },
];

export const SOURCES = [
  'Inbound Website',
  'Meta Ads (Lead Form)',
  'Google Ads',
  'LinkedIn Outreach',
  'Cold Email',
  'WhatsApp Marketing',
  'Referral / Partner',
  'Clutch Directory',
];

export const CHANNELS = [
  { id: 'WhatsApp', label: 'WhatsApp', icon: 'MessageSquare', color: '#1F8A5B' },
  { id: 'Email', label: 'Email', icon: 'Mail', color: '#2F6FB5' },
  { id: 'LinkedIn', label: 'LinkedIn', icon: 'Linkedin', color: '#0A66C2' },
  { id: 'Call', label: 'Phone Call', icon: 'Phone', color: '#D98A1B' },
];

export const PRIORITIES = [
  { id: 'Hot', label: 'Hot', color: '#C23B3B', bg: '#FAECEC' },
  { id: 'Warm', label: 'Warm', color: '#D98A1B', bg: '#FDF4E7' },
  { id: 'Cold', label: 'Cold', color: '#536471', bg: '#F0EBE1' },
];

export const LOSS_REASONS = [
  'Price / Budget Mismatch',
  'Chose Competitor',
  'No Response / Ghosted',
  'Project Postponed / Bad Timing',
  'Scope Mismatch',
  'Decided to Build In-House',
  'Other',
];

export const ACCENT_SWATCHES = [
  { name: 'Royal Gold', value: '#C9A24B' },
  { name: 'Navy Blue', value: '#1A56DB' },
  { name: 'Emerald Green', value: '#1F8A5B' },
  { name: 'Crimson Red', value: '#C23B3B' },
  { name: 'Warm Amber', value: '#D98A1B' },
  { name: 'Imperial Indigo', value: '#4F46E5' },
  { name: 'Bronze Sand', value: '#9E6B38' },
  { name: 'Slate Steel', value: '#475569' },
];

export const DEFAULT_USERS = [
  { id: 'u1', name: 'Fahad Al-Maktoum', email: 'fahad@westmeresolutions.com', role: 'Admin', avatar: 'FA' },
  { id: 'u2', name: 'Rohan Sharma', email: 'rohan.s@westmeresolutions.com', role: 'Sales Lead', avatar: 'RS' },
  { id: 'u3', name: 'Zoya Khan', email: 'zoya.k@westmeresolutions.com', role: 'Account Executive', avatar: 'ZK' },
  { id: 'u4', name: 'Aarav Patel', email: 'aarav.p@westmeresolutions.com', role: 'SDR', avatar: 'AP' },
];

export const DEFAULT_TARGETS = {
  period: 'month', // 'week' | 'month' | 'custom'
  newProspects: 100,
  outreach: 100,
  qualifiedLeads: 15,
  meetings: 5,
  proposals: 5,
  closedDealsMin: 1,
  closedDealsMax: 2,
};
