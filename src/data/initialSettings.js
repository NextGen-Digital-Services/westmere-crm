import { SOURCES, MARKETS, DEFAULT_USERS, DEFAULT_TARGETS, PIPELINE_STAGES } from '../lib/constants';

export const INITIAL_SETTINGS = {
  branding: {
    logo: null, // Base64 data URL or null
    companyName: 'Westmere Solutions',
    tagline: 'Enterprise Digital Engineering, AI & UX • India & UAE',
    accentColor: '#C9A24B',
    defaultCurrency: 'INR',
    companyEmail: 'growth@westmeresolutions.com',
    companyPhone: '+91 98200 12345 | +971 4 321 0000',
    addressIndia: 'Westmere Heights, Level 7, BKC, Mumbai 400051, India',
    addressUAE: 'Office 1402, Boulevard Plaza Tower 1, Downtown Dubai, UAE',
    gstNumber: '27AABCW9812K1Z4',
    trnNumber: '100456789000003',
  },
  pipeline: {
    staleThresholdDays: 7,
    stages: PIPELINE_STAGES,
  },
  appearance: {
    theme: 'light', // 'light' | 'dark'
    density: 'comfortable', // 'comfortable' | 'compact'
    reducedMotion: false,
  },
  sources: SOURCES,
  markets: MARKETS,
  users: DEFAULT_USERS,
  targets: DEFAULT_TARGETS,
};
