import React, { useState } from 'react';
import {
  Sparkles,
  MessageSquare,
  Mail,
  Linkedin,
  Calendar,
  Webhook,
  CreditCard,
  Database,
  Terminal,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Trash2,
  Play,
  ArrowRight,
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { showToast } from '../hooks/useToast';
import { formatDate, formatTimeAgo } from '../lib/formatters';
import { getAdapter } from '../services/integrations';

export function IntegrationsPage() {
  const {
    integrations,
    updateIntegrationCredentials,
    disconnectIntegration,
    apiLogs,
    logApiActivity,
    clearApiLogs,
  } = useAppStore();

  const [testingId, setTestingId] = useState(null);
  const [testResults, setTestResults] = useState({});
  const [showMasked, setShowMasked] = useState({});
  const [formsData, setFormsData] = useState(() => {
    const initial = {};
    integrations.forEach((item) => {
      initial[item.id] = { ...item.credentials };
    });
    return initial;
  });

  // REST API sandbox tester state
  const [restTester, setRestTester] = useState({
    endpoint: '/leads/test',
    method: 'POST',
    payload: '{\n  "leadName": "Rashid Al-Nuaimi",\n  "market": "UAE"\n}',
    response: null,
    loading: false,
  });

  const [logFilter, setLogFilter] = useState('All');

  const icons = {
    whatsapp: MessageSquare,
    email: Mail,
    linkedin: Linkedin,
    google_meet: Calendar,
    ai_assistant: Sparkles,
    webhooks: Webhook,
    payments: CreditCard,
    supabase: Database,
    custom_rest: Terminal,
  };

  const handleFieldChange = (integrationId, fieldKey, value) => {
    setFormsData((prev) => ({
      ...prev,
      [integrationId]: {
        ...prev[integrationId],
        [fieldKey]: value,
      },
    }));
  };

  const handleTestConnection = async (integration) => {
    setTestingId(integration.id);
    const adapter = getAdapter(integration.id);
    const credentials = formsData[integration.id] || {};

    if (!adapter) {
      setTestingId(null);
      return;
    }

    const res = await adapter.testConnection(credentials);

    setTestResults((prev) => ({
      ...prev,
      [integration.id]: res,
    }));

    // Log this action to the API Activity Log
    logApiActivity(
      integration.name,
      'Test Connection Ping',
      res.mode === 'live' ? (res.success ? 'Live' : 'Failed') : 'Simulated',
      res.duration || 320,
      res.message
    );

    if (res.success) {
      updateIntegrationCredentials(integration.id, credentials, 'Connected');
      showToast({
        type: res.mode === 'live' ? 'success' : 'info',
        title: `${integration.name}: ${res.mode === 'live' ? 'Live Connected' : 'Simulated Active'}`,
        message: res.message,
      });
    } else {
      updateIntegrationCredentials(integration.id, credentials, 'Error');
      showToast({
        type: 'danger',
        title: `${integration.name} Error`,
        message: res.message,
      });
    }

    setTestingId(null);
  };

  const handleSaveCredentials = (integration) => {
    const creds = formsData[integration.id] || {};
    updateIntegrationCredentials(integration.id, creds, 'Connected');
    showToast({
      type: 'success',
      title: 'Credentials Saved',
      message: `${integration.name} configuration saved securely in local storage.`,
    });
  };

  const handleDisconnect = (integration) => {
    disconnectIntegration(integration.id);
    setFormsData((prev) => ({
      ...prev,
      [integration.id]: {},
    }));
    setTestResults((prev) => ({
      ...prev,
      [integration.id]: null,
    }));
    showToast({
      type: 'info',
      title: 'Disconnected',
      message: `${integration.name} keys removed. Mode reverted to Simulated.`,
    });
  };

  // REST sandbox test execution
  const handleRunRestTest = async () => {
    setRestTester((prev) => ({ ...prev, loading: true, response: null }));
    const adapter = getAdapter('custom_rest');
    const creds = formsData['custom_rest'] || {};

    let body = {};
    try {
      body = JSON.parse(restTester.payload);
    } catch (e) {
      // payload not json
    }

    const res = await adapter.send({
      endpoint: restTester.endpoint,
      method: restTester.method,
      body,
      action: 'API Sandbox Test',
    }, creds);

    setRestTester((prev) => ({
      ...prev,
      loading: false,
      response: res,
    }));

    logApiActivity('Custom REST API', `Sandbox ${restTester.method}`, res.mode === 'live' ? 'Live' : 'Simulated', res.duration || 450, res.message);
  };

  const filteredLogs = apiLogs.filter((log) => {
    if (logFilter === 'All') return true;
    return log.provider.toLowerCase().includes(logFilter.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#C9A24B] text-[#0B1F3A] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
            </span>
            <h1 className="text-xl font-bold text-[var(--text-ink)] tracking-tight">Integrations & API Engine</h1>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1 max-w-2xl">
            Plug and play live external APIs. When keys are pasted, CRM modules switch from Simulated Demo mode to live production calls immediately without any code edits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="md">
            Simulated Fallbacks Active
          </Badge>
        </div>
      </div>

      {/* 9 Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrations.map((item) => {
          const Icon = icons[item.id] || Sparkles;
          const creds = formsData[item.id] || {};
          const testRes = testResults[item.id];
          const isTesting = testingId === item.id;
          const isConnected = item.status === 'Connected';

          return (
            <Card key={item.id} className="flex flex-col justify-between space-y-4">
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-solid-sm"
                      style={{ backgroundColor: item.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[var(--text-ink)] leading-snug">{item.name}</h3>
                      <p className="text-[10px] text-[var(--text-muted)]">{item.category}</p>
                    </div>
                  </div>

                  <Badge
                    variant={item.status === 'Connected' ? 'success' : item.status === 'Error' ? 'danger' : 'outline'}
                    size="sm"
                  >
                    {item.status}
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-xs text-[var(--text-muted)] mt-3 leading-relaxed">{item.description}</p>

                {/* Form Fields */}
                <div className="space-y-2.5 mt-3 pt-2 border-t border-[var(--border-subtle)] text-xs">
                  {item.fields.map((field) => {
                    const isMasked = field.type === 'password';
                    const showKey = `${item.id}-${field.key}`;
                    const isVisible = showMasked[showKey];
                    const val = creds[field.key] ?? field.defaultValue ?? '';

                    return (
                      <div key={field.key} className="relative">
                        <label className="block text-[11px] font-semibold text-[var(--text-ink)] mb-1">
                          {field.label}
                        </label>

                        {field.type === 'select' ? (
                          <select
                            value={val}
                            onChange={(e) => handleFieldChange(item.id, field.key, e.target.value)}
                            className="w-full text-xs rounded-button border border-[var(--border-subtle)] p-2 bg-[var(--bg-surface)] text-[var(--text-ink)] focus:outline-none"
                          >
                            {field.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : field.type === 'textarea' ? (
                          <textarea
                            rows={2}
                            value={val}
                            onChange={(e) => handleFieldChange(item.id, field.key, e.target.value)}
                            className="w-full text-xs font-mono rounded-button border border-[var(--border-subtle)] p-2 bg-[var(--bg-surface)] text-[var(--text-ink)] focus:outline-none"
                          />
                        ) : (
                          <div className="relative flex items-center">
                            <input
                              type={isMasked && !isVisible ? 'password' : 'text'}
                              value={val}
                              placeholder={field.placeholder}
                              onChange={(e) => handleFieldChange(item.id, field.key, e.target.value)}
                              className="w-full text-xs rounded-button border border-[var(--border-subtle)] py-2 pl-2.5 pr-8 bg-[var(--bg-surface)] text-[var(--text-ink)] font-mono placeholder-[var(--text-subtle)] focus:outline-none focus:border-[#0B1F3A]"
                            />
                            {isMasked && (
                              <button
                                type="button"
                                onClick={() => setShowMasked({ ...showMasked, [showKey]: !isVisible })}
                                className="absolute right-2 text-[var(--text-muted)] hover:text-[var(--text-ink)] p-0.5"
                              >
                                {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* What This Enables */}
                <div className="mt-3 pt-2 border-t border-[var(--border-subtle)]">
                  <span className="text-[10px] font-bold text-[var(--text-subtle)] uppercase tracking-wider block mb-1">
                    What this enables:
                  </span>
                  <ul className="space-y-1 text-[11px] text-[var(--text-muted)]">
                    {item.enables.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#1F8A5B] font-bold">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Test Result Banner */}
                {testRes && (
                  <div
                    className={`mt-3 p-2.5 rounded-button text-[11px] leading-snug border ${
                      testRes.success
                        ? testRes.mode === 'live'
                          ? 'bg-[#E8F5EE] border-[#C5E8D4] text-[#1F8A5B]'
                          : 'bg-[#EAF1F9] border-[#C5DCF4] text-[#2F6FB5]'
                        : 'bg-[#FAECEC] border-[#F4C7C7] text-[#C23B3B]'
                    }`}
                  >
                    <span className="font-bold">[{testRes.mode?.toUpperCase()}]:</span> {testRes.message}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  loading={isTesting}
                  onClick={() => handleTestConnection(item)}
                >
                  Test Connection
                </Button>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleSaveCredentials(item)}
                  >
                    Save
                  </Button>

                  {isConnected && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDisconnect(item)}
                      className="text-[#C23B3B] px-2"
                    >
                      Disconnect
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Custom REST API Sandbox Tester Card */}
      <Card className="space-y-4 border-l-4 border-l-[#16335C]">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#0B1F3A] dark:text-[var(--accent-color)]" />
            <h3 className="text-sm font-bold text-[var(--text-ink)]">
              Custom REST API Request & Response Tester
            </h3>
          </div>
          <Badge variant="navy">Developer Sandbox</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Request Payload */}
          <div className="space-y-2">
            <span className="font-semibold text-[var(--text-ink)]">HTTP Request Dispatcher</span>
            <div className="flex gap-2">
              <select
                value={restTester.method}
                onChange={(e) => setRestTester({ ...restTester, method: e.target.value })}
                className="w-24 rounded border border-[var(--border-subtle)] p-1.5 bg-[var(--bg-surface)] font-bold text-[var(--text-ink)]"
              >
                <option>POST</option>
                <option>GET</option>
                <option>PUT</option>
              </select>
              <input
                type="text"
                value={restTester.endpoint}
                onChange={(e) => setRestTester({ ...restTester, endpoint: e.target.value })}
                placeholder="/v1/leads"
                className="flex-1 rounded border border-[var(--border-subtle)] p-1.5 bg-[var(--bg-surface)] font-mono text-[var(--text-ink)]"
              />
            </div>

            <textarea
              rows={4}
              value={restTester.payload}
              onChange={(e) => setRestTester({ ...restTester, payload: e.target.value })}
              className="w-full rounded border border-[var(--border-subtle)] p-2 font-mono text-[11px] bg-[var(--bg-surface)] text-[var(--text-ink)]"
            />

            <Button
              variant="gold"
              size="sm"
              icon={Play}
              loading={restTester.loading}
              onClick={handleRunRestTest}
            >
              Dispatch Request
            </Button>
          </div>

          {/* Response Payload */}
          <div className="space-y-2">
            <span className="font-semibold text-[var(--text-ink)]">Response Output</span>
            <div className="p-3 rounded-card bg-[var(--bg-main)] border border-[var(--border-subtle)] font-mono text-[11px] text-[var(--text-ink)] h-36 overflow-auto">
              {restTester.response ? (
                <pre>{JSON.stringify(restTester.response, null, 2)}</pre>
              ) : (
                <span className="text-[var(--text-subtle)]">Click "Dispatch Request" to test endpoint live or simulated.</span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* API Activity Log Table */}
      <Card className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-ink)]">API Activity & Telemetry Audit Log</h3>
            <p className="text-[11px] text-[var(--text-muted)]">Real-time log of all outbound messages, webhooks, and AI pings</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={logFilter}
              onChange={(e) => setLogFilter(e.target.value)}
              className="text-xs rounded-button border border-[var(--border-subtle)] px-2.5 py-1.5 bg-[var(--bg-surface)] text-[var(--text-ink)] focus:outline-none"
            >
              <option>All</option>
              <option>WhatsApp</option>
              <option>Email</option>
              <option>AI</option>
              <option>REST</option>
            </select>

            <Button variant="ghost" size="sm" icon={Trash2} onClick={clearApiLogs} className="text-[#C23B3B]">
              Clear Log
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-button border border-[var(--border-subtle)]">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[var(--bg-subtle)] text-[var(--text-muted)] font-semibold uppercase text-[11px]">
              <tr>
                <th className="p-2.5">Timestamp</th>
                <th className="p-2.5">Provider</th>
                <th className="p-2.5">Action Executed</th>
                <th className="p-2.5 text-center">Status</th>
                <th className="p-2.5 text-right">Latency</th>
                <th className="p-2.5">Response Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[var(--bg-subtle)]/40 transition-colors">
                  <td className="p-2.5 text-[11px] text-[var(--text-subtle)]">{formatDate(log.timestamp, 'h:mm:ss a')}</td>
                  <td className="p-2.5 font-bold text-[var(--text-ink)]">{log.provider}</td>
                  <td className="p-2.5 font-medium text-[var(--text-ink)]">{log.action}</td>
                  <td className="p-2.5 text-center">
                    <Badge variant={log.status === 'Live' ? 'success' : log.status === 'Failed' ? 'danger' : 'info'} size="sm">
                      {log.status}
                    </Badge>
                  </td>
                  <td className="p-2.5 text-right font-mono text-[var(--text-muted)]">{log.durationMs}ms</td>
                  <td className="p-2.5 text-[11px] text-[var(--text-muted)] truncate max-w-xs">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
