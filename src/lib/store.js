import { create } from 'zustand';
import { SAMPLE_LEADS } from '../data/initialLeads';
import { INITIAL_TEMPLATES, INITIAL_SEQUENCES } from '../data/initialTemplates';
import { INITIAL_INTEGRATIONS } from '../data/initialIntegrations';
import { INITIAL_SETTINGS } from '../data/initialSettings';
import { INITIAL_TASKS, INITIAL_MEETINGS, INITIAL_PROPOSALS } from '../data/initialTasksAndMeetings';
import { calculateLeadScore } from './formatters';

const STORAGE_KEY = 'westmere_crm_data_v1';

// Initial Onboarding Checklist
const INITIAL_ONBOARDING = [
  { id: 'ob-1', title: 'Explore the 7-stage Sales Pipeline', description: 'Switch between Kanban, List, and Table views in Pipeline', completed: false, route: '/pipeline' },
  { id: 'ob-2', title: 'Customize Agency Branding', description: 'Upload your agency logo and pick your signature accent color', completed: false, route: '/settings' },
  { id: 'ob-3', title: 'Send First Outreach Template', description: 'Personalize a WhatsApp or Email message in Outreach Center', completed: false, route: '/outreach' },
  { id: 'ob-4', title: 'Build a Client Proposal', description: 'Generate a branded commercial proposal with GST / VAT milestone breakdown', completed: false, route: '/proposals' },
  { id: 'ob-5', title: 'Connect an Integration / API Key', description: 'Set up WhatsApp Cloud API, Resend, or Google Meet in Settings > Integrations', completed: false, route: '/settings/integrations' },
];

// Helper to load or initialize state
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading CRM data from localStorage:', err);
    return null;
  }
}

function saveToStorage(state) {
  try {
    const toSave = {
      leads: state.leads,
      templates: state.templates,
      sequences: state.sequences,
      integrations: state.integrations,
      apiLogs: state.apiLogs,
      tasks: state.tasks,
      meetings: state.meetings,
      proposals: state.proposals,
      settings: state.settings,
      onboarding: state.onboarding,
      auth: state.auth,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.error('Error saving CRM data to localStorage:', err);
  }
}

// Initial API activity logs
const INITIAL_API_LOGS = [
  { id: 'log-1', timestamp: '2026-11-19T10:00:00Z', provider: 'WhatsApp Business API', action: 'Send Template Message', status: 'Simulated', durationMs: 420, details: 'Dispatched to Kabir Singhania (+919820144520)' },
  { id: 'log-2', timestamp: '2026-11-19T09:15:00Z', provider: 'AI Sales Assistant', action: 'Generate Outreach Pitch', status: 'Simulated', durationMs: 650, details: 'Personalized pitch generated for Noor Dental PolyClinics' },
  { id: 'log-3', timestamp: '2026-11-18T16:00:00Z', provider: 'Email Provider API', action: 'Dispatch Architecture Deck', status: 'Simulated', durationMs: 380, details: 'Sent to siddharth@kovaifresh.com' },
  { id: 'log-4', timestamp: '2026-11-18T11:00:00Z', provider: 'Google Meet', action: 'Create Conference Link', status: 'Simulated', durationMs: 250, details: 'Generated room https://meet.google.com/xyz-west-med' },
];

const saved = loadFromStorage();

export const useAppStore = create((set, get) => ({
  // Core State
  leads: saved?.leads || SAMPLE_LEADS,
  templates: saved?.templates || INITIAL_TEMPLATES,
  sequences: saved?.sequences || INITIAL_SEQUENCES,
  integrations: saved?.integrations || INITIAL_INTEGRATIONS,
  apiLogs: saved?.apiLogs || INITIAL_API_LOGS,
  tasks: saved?.tasks || INITIAL_TASKS,
  meetings: saved?.meetings || INITIAL_MEETINGS,
  proposals: saved?.proposals || INITIAL_PROPOSALS,
  settings: saved?.settings || INITIAL_SETTINGS,
  onboarding: saved?.onboarding || INITIAL_ONBOARDING,
  auth: saved?.auth || {
    isAuthenticated: true,
    user: INITIAL_SETTINGS.users[0],
  },

  // Transient UI state
  activeLeadId: null,
  activeLeadDrawerOpen: false,
  quickAddModalOpen: false,
  commandPaletteOpen: false,
  confettiTrigger: 0,
  lastDeletedLead: null,

  // UI State setters
  openLeadDrawer: (id) => set({ activeLeadId: id, activeLeadDrawerOpen: true }),
  closeLeadDrawer: () => set({ activeLeadDrawerOpen: false }),
  setQuickAddModalOpen: (open) => set({ quickAddModalOpen: open }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  triggerConfetti: () => set((state) => ({ confettiTrigger: state.confettiTrigger + 1 })),

  // Onboarding actions
  toggleOnboardingItem: (id) => {
    set((state) => {
      const updated = state.onboarding.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      const newState = { ...state, onboarding: updated };
      saveToStorage(newState);
      return { onboarding: updated };
    });
  },

  // Auth actions
  login: (email, name) => {
    set((state) => {
      const user = state.settings.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || {
        id: `u-${Date.now()}`,
        name: name || email.split('@')[0],
        email,
        role: 'Admin',
        avatar: (name || email).slice(0, 2).toUpperCase(),
      };
      const auth = { isAuthenticated: true, user };
      const newState = { ...state, auth };
      saveToStorage(newState);
      return { auth };
    });
  },
  logout: () => {
    set((state) => {
      const auth = { isAuthenticated: false, user: null };
      const newState = { ...state, auth };
      saveToStorage(newState);
      return { auth };
    });
  },

  // --- LEADS MANAGEMENT ---
  addLead: (leadInput) => {
    let result = { success: false, lead: null, isDuplicate: false };
    set((state) => {
      // Duplicate detection by email or phone
      const emailTrim = (leadInput.email || '').trim().toLowerCase();
      const phoneClean = (leadInput.phone || '').replace(/[^0-9]/g, '');

      const duplicate = state.leads.find((l) => {
        if (emailTrim && l.email && l.email.trim().toLowerCase() === emailTrim) return true;
        if (phoneClean && l.phone && l.phone.replace(/[^0-9]/g, '') === phoneClean) return true;
        return false;
      });

      const now = new Date().toISOString();
      const newLead = {
        id: `lead-${Date.now()}`,
        isSample: false,
        name: leadInput.name || 'Untitled Prospect',
        businessName: leadInput.businessName || '',
        contactPersonRole: leadInput.contactPersonRole || 'Key Stakeholder',
        phone: leadInput.phone || '',
        email: leadInput.email || '',
        city: leadInput.city || (leadInput.market === 'UAE' ? 'Dubai' : 'Mumbai'),
        country: leadInput.country || (leadInput.market === 'UAE' ? 'UAE' : 'India'),
        market: leadInput.market || 'India',
        currency: leadInput.currency || (leadInput.market === 'UAE' ? 'AED' : 'INR'),
        source: leadInput.source || 'Inbound Website',
        services: leadInput.services || ['Website Development'],
        stage: leadInput.stage || 'lead_generated',
        priority: leadInput.priority || 'Warm',
        owner: leadInput.owner || state.auth.user?.name || 'Rohan Sharma',
        expectedValue: Number(leadInput.expectedValue) || 0,
        expectedCloseDate: leadInput.expectedCloseDate || '',
        budgetVerified: Boolean(leadInput.budgetVerified),
        decisionMakerVerified: Boolean(leadInput.decisionMakerVerified),
        timelineUrgency: leadInput.timelineUrgency || 'Moderate',
        notes: leadInput.notes || '',
        tags: leadInput.tags || ['New Lead'],
        createdAt: now,
        updatedAt: now,
        lastActivityDate: now,
        activities: [
          {
            id: `act-${Date.now()}`,
            type: 'lead_captured',
            content: `Lead created manually via CRM (Source: ${leadInput.source || 'Direct'})`,
            timestamp: now,
            author: state.auth.user?.name || 'User',
          },
        ],
        ...leadInput,
      };

      const leads = [newLead, ...state.leads];
      const newState = { ...state, leads };
      saveToStorage(newState);

      result = {
        success: true,
        lead: newLead,
        isDuplicate: Boolean(duplicate),
        duplicateOf: duplicate?.businessName || duplicate?.name,
      };
      return { leads };
    });
    return result;
  },

  updateLead: (id, updates, logActivityMessage = null) => {
    set((state) => {
      const now = new Date().toISOString();
      const leads = state.leads.map((l) => {
        if (l.id !== id) return l;

        const updated = {
          ...l,
          ...updates,
          updatedAt: now,
          lastActivityDate: now,
        };

        if (logActivityMessage) {
          const newAct = {
            id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            type: updates.stage ? 'stage_change' : 'update',
            content: logActivityMessage,
            timestamp: now,
            author: state.auth.user?.name || 'User',
          };
          updated.activities = [newAct, ...(l.activities || [])];
        }

        return updated;
      });

      const newState = { ...state, leads };
      saveToStorage(newState);
      return { leads };
    });
  },

  moveLeadStage: (id, newStage, stageData = {}) => {
    const state = get();
    const lead = state.leads.find((l) => l.id === id);
    if (!lead) return false;

    const oldStageName = lead.stage;
    const now = new Date().toISOString();

    const updates = {
      stage: newStage,
      ...stageData,
    };

    let logMessage = `Moved deal from stage "${oldStageName}" to "${newStage}"`;
    if (newStage === 'won') {
      logMessage = `Deal closed WON! Advance: ${stageData.advanceReceivedAmount || 'N/A'}`;
      get().triggerConfetti();
    } else if (newStage === 'lost') {
      logMessage = `Deal closed LOST. Reason: ${stageData.lossReason || 'Unspecified'}`;
    }

    get().updateLead(id, updates, logMessage);
    return true;
  },

  deleteLead: (id) => {
    let deleted = null;
    set((state) => {
      deleted = state.leads.find((l) => l.id === id);
      const leads = state.leads.filter((l) => l.id !== id);
      const newState = { ...state, leads, lastDeletedLead: deleted };
      saveToStorage(newState);
      return { leads, lastDeletedLead: deleted };
    });
    return deleted;
  },

  undoDeleteLead: () => {
    set((state) => {
      if (!state.lastDeletedLead) return state;
      const leads = [state.lastDeletedLead, ...state.leads];
      const newState = { ...state, leads, lastDeletedLead: null };
      saveToStorage(newState);
      return { leads, lastDeletedLead: null };
    });
  },

  clearSampleData: () => {
    set((state) => {
      const leads = state.leads.filter((l) => !l.isSample);
      const newState = { ...state, leads };
      saveToStorage(newState);
      return { leads };
    });
  },

  restoreSampleData: () => {
    set((state) => {
      // Merge sample leads preserving any user created leads
      const userLeads = state.leads.filter((l) => !l.isSample);
      const leads = [...SAMPLE_LEADS, ...userLeads];
      const newState = { ...state, leads };
      saveToStorage(newState);
      return { leads };
    });
  },

  // --- TASKS ---
  addTask: (taskInput) => {
    set((state) => {
      const newTask = {
        id: `task-${Date.now()}`,
        status: 'pending',
        priority: 'Warm',
        createdAt: new Date().toISOString(),
        ...taskInput,
      };
      const tasks = [newTask, ...state.tasks];
      const newState = { ...state, tasks };
      saveToStorage(newState);
      return { tasks };
    });
  },

  toggleTaskComplete: (id) => {
    set((state) => {
      const tasks = state.tasks.map((t) =>
        t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed', completedAt: new Date().toISOString() } : t
      );
      const newState = { ...state, tasks };
      saveToStorage(newState);
      return { tasks };
    });
  },

  deleteTask: (id) => {
    set((state) => {
      const tasks = state.tasks.filter((t) => t.id !== id);
      const newState = { ...state, tasks };
      saveToStorage(newState);
      return { tasks };
    });
  },

  // --- MEETINGS ---
  addMeeting: (meetingInput) => {
    set((state) => {
      const newMeet = {
        id: `meet-${Date.now()}`,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        ...meetingInput,
      };
      const meetings = [newMeet, ...state.meetings];
      const newState = { ...state, meetings };
      saveToStorage(newState);
      return { meetings };
    });
  },

  updateMeeting: (id, updates) => {
    set((state) => {
      const meetings = state.meetings.map((m) => (m.id === id ? { ...m, ...updates } : m));
      const newState = { ...state, meetings };
      saveToStorage(newState);
      return { meetings };
    });
  },

  deleteMeeting: (id) => {
    set((state) => {
      const meetings = state.meetings.filter((m) => m.id !== id);
      const newState = { ...state, meetings };
      saveToStorage(newState);
      return { meetings };
    });
  },

  // --- PROPOSALS ---
  addProposal: (propInput) => {
    let created = null;
    set((state) => {
      created = {
        id: `prop-${Date.now()}`,
        proposalNumber: `WM-PROP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        status: 'Draft',
        version: 'v1.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...propInput,
      };
      const proposals = [created, ...state.proposals];
      const newState = { ...state, proposals };
      saveToStorage(newState);
      return { proposals };
    });
    return created;
  },

  updateProposal: (id, updates) => {
    set((state) => {
      const proposals = state.proposals.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      );
      const newState = { ...state, proposals };
      saveToStorage(newState);
      return { proposals };
    });
  },

  sendProposal: (id) => {
    const state = get();
    const proposal = state.proposals.find((p) => p.id === id);
    if (!proposal) return;

    // Update proposal status
    get().updateProposal(id, { status: 'Sent' });

    // Move lead to 'proposal_sent' if not already
    if (proposal.leadId) {
      get().moveLeadStage(proposal.leadId, 'proposal_sent', {
        proposalScope: proposal.title,
        proposalPrice: proposal.total,
        proposalVersion: proposal.version,
        proposalValidityDate: proposal.validityDate,
      });
    }
  },

  deleteProposal: (id) => {
    set((state) => {
      const proposals = state.proposals.filter((p) => p.id !== id);
      const newState = { ...state, proposals };
      saveToStorage(newState);
      return { proposals };
    });
  },

  // --- TEMPLATES ---
  addTemplate: (tpl) => {
    set((state) => {
      const newTpl = { id: `tpl-${Date.now()}`, ...tpl };
      const templates = [...state.templates, newTpl];
      const newState = { ...state, templates };
      saveToStorage(newState);
      return { templates };
    });
  },
  updateTemplate: (id, updates) => {
    set((state) => {
      const templates = state.templates.map((t) => (t.id === id ? { ...t, ...updates } : t));
      const newState = { ...state, templates };
      saveToStorage(newState);
      return { templates };
    });
  },
  deleteTemplate: (id) => {
    set((state) => {
      const templates = state.templates.filter((t) => t.id !== id);
      const newState = { ...state, templates };
      saveToStorage(newState);
      return { templates };
    });
  },

  // --- SEQUENCES ---
  toggleSequence: (id) => {
    set((state) => {
      const sequences = state.sequences.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
      const newState = { ...state, sequences };
      saveToStorage(newState);
      return { sequences };
    });
  },

  // --- INTEGRATIONS & API LOGS ---
  updateIntegrationCredentials: (id, credentials, status = 'Connected') => {
    set((state) => {
      const integrations = state.integrations.map((item) =>
        item.id === id
          ? {
              ...item,
              credentials: { ...item.credentials, ...credentials },
              status,
              lastSync: new Date().toISOString(),
            }
          : item
      );
      const newState = { ...state, integrations };
      saveToStorage(newState);
      return { integrations };
    });
  },

  disconnectIntegration: (id) => {
    set((state) => {
      const integrations = state.integrations.map((item) =>
        item.id === id ? { ...item, credentials: {}, status: 'Not connected' } : item
      );
      const newState = { ...state, integrations };
      saveToStorage(newState);
      return { integrations };
    });
  },

  logApiActivity: (provider, action, status, durationMs, details) => {
    set((state) => {
      const newLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        provider,
        action,
        status, // 'Live' | 'Simulated' | 'Failed'
        durationMs,
        details,
      };
      const apiLogs = [newLog, ...state.apiLogs].slice(0, 200); // keep last 200
      const newState = { ...state, apiLogs };
      saveToStorage(newState);
      return { apiLogs };
    });
  },

  clearApiLogs: () => {
    set((state) => {
      const apiLogs = [];
      const newState = { ...state, apiLogs };
      saveToStorage(newState);
      return { apiLogs };
    });
  },

  // --- SETTINGS & BRANDING ---
  updateSettings: (updates) => {
    set((state) => {
      const settings = {
        ...state.settings,
        ...updates,
      };

      // If theme changed
      if (updates.appearance?.theme) {
        if (updates.appearance.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }

      // If accent color changed
      if (updates.branding?.accentColor) {
        document.documentElement.style.setProperty('--accent-color', updates.branding.accentColor);
      }

      const newState = { ...state, settings };
      saveToStorage(newState);
      return { settings };
    });
  },

  updateLogo: (base64Data) => {
    set((state) => {
      const settings = {
        ...state.settings,
        branding: {
          ...state.settings.branding,
          logo: base64Data,
        },
      };

      // Instantly update browser favicon
      const favicon = document.getElementById('app-favicon');
      if (favicon) {
        favicon.href = base64Data || '/favicon.svg';
      }

      const newState = { ...state, settings };
      saveToStorage(newState);
      return { settings };
    });
  },

  removeLogo: () => {
    set((state) => {
      const settings = {
        ...state.settings,
        branding: {
          ...state.settings.branding,
          logo: null,
        },
      };
      const favicon = document.getElementById('app-favicon');
      if (favicon) {
        favicon.href = '/favicon.svg';
      }
      const newState = { ...state, settings };
      saveToStorage(newState);
      return { settings };
    });
  },

  // Export & Import full backup
  exportFullBackup: () => {
    const state = get();
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      leads: state.leads,
      templates: state.templates,
      sequences: state.sequences,
      integrations: state.integrations,
      apiLogs: state.apiLogs,
      tasks: state.tasks,
      meetings: state.meetings,
      proposals: state.proposals,
      settings: state.settings,
      onboarding: state.onboarding,
    };
    return JSON.stringify(data, null, 2);
  },

  importFullBackup: (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (!data.leads || !data.settings) throw new Error('Invalid backup schema');

      set((state) => {
        const newState = {
          ...state,
          leads: data.leads || state.leads,
          templates: data.templates || state.templates,
          sequences: data.sequences || state.sequences,
          integrations: data.integrations || state.integrations,
          apiLogs: data.apiLogs || state.apiLogs,
          tasks: data.tasks || state.tasks,
          meetings: data.meetings || state.meetings,
          proposals: data.proposals || state.proposals,
          settings: data.settings || state.settings,
          onboarding: data.onboarding || state.onboarding,
        };
        saveToStorage(newState);

        // Apply appearance updates immediately
        if (data.settings?.appearance?.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        if (data.settings?.branding?.accentColor) {
          document.documentElement.style.setProperty('--accent-color', data.settings.branding.accentColor);
        }
        const favicon = document.getElementById('app-favicon');
        if (favicon) {
          favicon.href = data.settings?.branding?.logo || '/favicon.svg';
        }

        return newState;
      });
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  resetAllData: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      leads: SAMPLE_LEADS,
      templates: INITIAL_TEMPLATES,
      sequences: INITIAL_SEQUENCES,
      integrations: INITIAL_INTEGRATIONS,
      apiLogs: INITIAL_API_LOGS,
      tasks: INITIAL_TASKS,
      meetings: INITIAL_MEETINGS,
      proposals: INITIAL_PROPOSALS,
      settings: INITIAL_SETTINGS,
      onboarding: INITIAL_ONBOARDING,
    });
    document.documentElement.classList.remove('dark');
    document.documentElement.style.removeProperty('--accent-color');
    const favicon = document.getElementById('app-favicon');
    if (favicon) favicon.href = '/favicon.svg';
  },
}));
