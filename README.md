# Westmere Sales CRM

> Advanced, premium, animation-rich B2B sales CRM designed for digital agencies delivering website development, mobile apps, custom software (ERP/CRM/POS), SaaS, AI & automation, and UI/UX design to enterprise clients across **India (INR)** and the **UAE / Dubai (AED)**.

---

## ⚡ Quickstart

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Production build (zero warnings)
npm run build
```

---

## 🏗️ Folder Map

```
westmere_crm/
├── public/
│   └── favicon.svg                    # Default Westmere agency mark
├── src/
│   ├── components/
│   │   ├── charts/                    # KpiCard, FunnelChart, RevenueChart, SplitPieChart, ActivityHeatmap
│   │   ├── kanban/                    # KanbanBoard, KanbanColumn, KanbanCard, StageValidationModal
│   │   ├── layout/                    # AppLayout, Sidebar, TopBar, MobileNav, CommandPalette
│   │   ├── leads/                     # LeadDrawer, LeadModal, LeadFilters, LeadActivityFeed, LeadScoreBreakdown
│   │   ├── proposals/                 # ProposalBuilderModal, ProposalPreview
│   │   └── ui/                        # Reusable UI kit (Button, Input, Select, MultiSelect, Modal, Drawer, Tabs, Badge, Card, Table, Toast, Skeleton, EmptyState, Dropdown, DatePicker, Avatar, ProgressRing, ConfettiBurst)
│   ├── data/
│   │   ├── initialLeads.js            # 40 realistic sample prospects (India + UAE, mixed services & stages)
│   │   ├── initialIntegrations.js     # 9 integration adapter definitions
│   │   ├── initialSettings.js         # Default branding, pipeline probabilities, user roles, appearance
│   │   ├── initialTasksAndMeetings.js # Follow-ups, calendar sessions, proposals seed data
│   │   └── initialTemplates.js        # Multi-channel outreach copy and sequences
│   ├── hooks/
│   │   ├── useCounter.js              # Animated number counter on KPIs with quartic easing
│   │   ├── useKeyboardShortcuts.js    # Cmd+K (Palette), N (New Lead), / (Search), G+D/P/L navigation
│   │   ├── useScrollReveal.js         # IntersectionObserver scroll reveal
│   │   └── useToast.js                # Sliding toast notifications with undo callback
│   ├── lib/
│   │   ├── constants.js               # Pipeline stages, services, markets (INR/AED), sources, colors
│   │   ├── formatters.js              # Currency (₹ / AED), relative dates, 0-100 lead score algorithm
│   │   ├── pdfGenerator.js            # jsPDF + html2canvas high-res proposal export
│   │   └── store.js                   # Unified Zustand data layer with localStorage persistence
│   ├── pages/
│   │   ├── AnalyticsPage.jsx          # Stage velocity, channel ROI, territory comparison, CSV export
│   │   ├── DashboardPage.jsx          # KPI cockpit, animated funnel, progress rings, today's focus
│   │   ├── IntegrationsPage.jsx       # 9 external API cards with live test connection & REST tester
│   │   ├── LeadsPage.jsx              # Full registry, sorting, column chooser, CSV import with mapping
│   │   ├── LoginPage.jsx              # Demo auth, agency branding, first-run onboarding checklist
│   │   ├── MeetingsPage.jsx           # Agenda / calendar, Google Meet link generator, .ics export
│   │   ├── NotificationsPage.jsx      # Overdue follow-ups, stale prospect alerts, quota warnings
│   │   ├── OutreachPage.jsx           # Templates library, dynamic variables, 1-click dispatch, sequences
│   │   ├── PipelinePage.jsx           # Switchable Kanban, List & Table views, bulk select actions
│   │   ├── ProposalsPage.jsx          # Proposal builder, milestone tables, GST/VAT tax toggle, PDF
│   │   ├── SettingsPage.jsx           # Branding, logo upload (max 2MB), accent picker, backup/restore
│   │   ├── TargetsPage.jsx            # Editable monthly quotas, auto actuals, pace progress rings
│   │   └── WonLostPage.jsx            # Won contract revenue, advance cash flow, loss reason analysis
│   ├── services/
│   │   └── integrations/              # Uniform adapters (testConnection, send, sync)
│   │       ├── aiAssistant.js         # OpenAI (GPT-4o) / Gemini / Claude adapter
│   │       ├── customRest.js          # Generic REST webhook adapter with sandbox tester
│   │       ├── email.js               # Resend / SendGrid / Brevo API adapter
│   │       ├── googleMeet.js          # Google Calendar & Meet link generator
│   │       ├── index.js               # Unified integration registry
│   │       ├── linkedin.js            # LinkedIn sales outreach adapter
│   │       ├── payments.js            # Razorpay (INR) & Stripe (AED) link adapter
│   │       ├── supabase.js            # Supabase Postgres sync adapter
│   │       ├── webhooks.js            # Inbound lead capture webhook adapter
│   │       └── whatsapp.js            # Meta Cloud WhatsApp Business API adapter
│   ├── styles/
│   │   └── index.css                  # Solid flat color tokens, CSS variables, dark theme
│   ├── App.jsx                        # React Router layout & auth guards
│   └── main.jsx                       # React 18 DOM mount
├── vercel.json                        # SPA rewrite rules
├── vite.config.js                     # Vendor chunking & alias configuration
└── tailwind.config.js                 # Custom solid flat color palette & typography
```

---

## 🎨 Design System

- **Solid Flat Colors Only**: Zero gradients, zero glassmorphism, zero blur.
- **Palette Tokens**:
  - `Navy`: `#0B1F3A` (Primary surfaces, sidebar, brand base)
  - `Gold`: `#C9A24B` (Signature agency accent)
  - `Off-White`: `#F5F1E8` (Light surface background)
  - `Ink`: `#101828` (Primary typography text)
  - `Success`: `#1F8A5B` | `Warning`: `#D98A1B` | `Danger`: `#C23B3B` | `Info`: `#2F6FB5`
- **Typography**: `Inter` for data density & UI + `Manrope` for executive headings.
- **Light & Dark Mode**: Persistent toggle in top bar and Settings.

---

## 🔌 Where to Paste Your API Keys

Navigate directly to **Settings > Integrations & API** (`/settings/integrations`):

| Integration | Fields to Configure | What it Unlocks |
| :--- | :--- | :--- |
| **WhatsApp Business API** | Base URL, Phone Number ID, System User Access Token | 1-click official template dispatch from Outreach Center & automated follow-ups. |
| **Email (Resend / SendGrid)** | API Key, Sender Email, Sender Name | Direct serverless delivery of proposals with PDF attachments and sequence cadences. |
| **Google Calendar & Meet** | Client ID, Google Calendar API Key | Auto-generation of unique Google Meet video links when booking discovery calls. |
| **AI Sales Assistant** | Provider (OpenAI / Gemini / Claude), API Key, Model | Contextual sales pitch generator, objection-handling scripts, and next-best-action guidance. |
| **Payment Gateways** | Razorpay Key ID/Secret or Stripe Publishable/Secret | One-click payment link generation for 30% advance collection on client proposals. |
| **Supabase Cloud** | Project URL, Anon Public API Key | Cross-device PostgreSQL synchronization and backup. |
| **Inbound Webhooks** | Webhook Signing Secret | Inbound endpoint for Meta Lead Ads, Google Forms, and website inquiries. |
| **Custom REST API** | Base URL, Auth Header (Bearer / API-Key), Custom JSON headers | Connect external ERPs or n8n / Zapier webhooks with built-in sandbox tester. |

> **Note on Simulated Mode**: If any key is left blank, the adapter automatically runs in **"Simulated Mode"** with realistic responses and deep-link fallbacks (e.g. `wa.me`, `mailto:`) so every screen functions smoothly during demos.

---

## 🔄 How to Replace `store.js` with a Real Backend

The frontend communicates with a single data layer: `src/lib/store.js`. To replace `localStorage` with a remote REST or GraphQL API:

1. **Keep Component Signatures Identical**:
   Components simply call store actions:
   ```js
   const { leads, addLead, moveLeadStage, updateLead } = useAppStore();
   ```

2. **Replace Storage Calls with HTTP Requests in `src/lib/store.js`**:
   In `src/lib/store.js`, update the store actions to perform asynchronous HTTP calls:
   ```javascript
   // Example: Replace addLead with your backend API
   addLead: async (leadInput) => {
     try {
       const res = await fetch('https://api.yourdomain.com/v1/leads', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${getAuthToken()}`,
         },
         body: JSON.stringify(leadInput),
       });
       const newLead = await res.json();
       set((state) => ({ leads: [newLead, ...state.leads] }));
       return { success: true, lead: newLead };
     } catch (err) {
       console.error('Failed to create lead on backend', err);
       return { success: false, error: err.message };
     }
   },
   ```

3. **Supabase Cloud Sync Alternative**:
   Alternatively, toggle the **Supabase** adapter in `src/services/integrations/supabase.js` to synchronize mutations directly to PostgreSQL tables without altering UI JSX code.
