import React, { useState } from 'react';
import {
  Send,
  MessageSquare,
  Mail,
  Linkedin,
  Clock,
  Plus,
  Play,
  CheckCircle2,
  Copy,
  ExternalLink,
  Edit2,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Tabs } from '../components/ui/Tabs';
import { showToast } from '../hooks/useToast';
import { whatsappAdapter } from '../services/integrations/whatsapp';
import { emailAdapter } from '../services/integrations/email';
import { linkedinAdapter } from '../services/integrations/linkedin';
import { aiAssistantAdapter } from '../services/integrations/aiAssistant';

export function OutreachPage() {
  const {
    templates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    sequences,
    toggleSequence,
    leads,
    updateLead,
    integrations,
    logApiActivity,
    openLeadDrawer,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'templates' | 'sequences'
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || '');
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id || '');
  const [isSending, setIsSending] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Template Modal State
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [tplForm, setTplForm] = useState({
    name: '',
    channel: 'WhatsApp',
    category: 'First Outreach',
    subject: '',
    content: '',
  });

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || leads[0];
  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];

  // Daily Outreach Queue: Leads in lead_generated, contacted, or qualified needing outreach
  const queueLeads = leads
    .filter((l) => ['lead_generated', 'contacted', 'qualified'].includes(l.stage))
    .slice(0, 10);

  // Variable replacement
  const getRenderedContent = (rawText, lead) => {
    if (!rawText || !lead) return '';
    return rawText
      .replace(/{name}/g, lead.name || 'there')
      .replace(/{business}/g, lead.businessName || 'your company')
      .replace(/{service}/g, lead.services?.[0] || 'digital transformation')
      .replace(/{city}/g, lead.city || 'your region')
      .replace(/{currency}/g, lead.currency || 'INR');
  };

  const renderedContent = getRenderedContent(selectedTemplate?.content, selectedLead);
  const renderedSubject = getRenderedContent(selectedTemplate?.subject, selectedLead);

  // One-click send dispatch
  const handleSendOutreach = async () => {
    if (!selectedLead) return;
    setIsSending(true);

    const channel = selectedTemplate?.channel || 'WhatsApp';
    let res = null;

    if (channel === 'WhatsApp') {
      const waConfig = integrations.find((i) => i.id === 'whatsapp')?.credentials || {};
      res = await whatsappAdapter.send(
        {
          phone: selectedLead.phone,
          text: renderedContent,
          templateName: selectedTemplate?.name,
        },
        waConfig
      );

      logApiActivity('WhatsApp Business API', 'Send Outreach Template', res.mode === 'live' ? 'Live' : 'Simulated', res.duration, `Sent to ${selectedLead.phone} (${selectedLead.name})`);

      if (res.deepLink) {
        window.open(res.deepLink, '_blank');
      }
    } else if (channel === 'Email') {
      const emailConfig = integrations.find((i) => i.id === 'email')?.credentials || {};
      res = await emailAdapter.send(
        {
          to: selectedLead.email,
          subject: renderedSubject || `Westmere Digital Engineering + ${selectedLead.businessName}`,
          text: renderedContent,
        },
        emailConfig
      );

      logApiActivity('Email Provider API', 'Dispatch Sequence Email', res.mode === 'live' ? 'Live' : 'Simulated', res.duration, `Delivered to ${selectedLead.email}`);

      if (res.mailtoLink) {
        window.open(res.mailtoLink, '_self');
      }
    } else {
      // LinkedIn
      const linkedinConfig = integrations.find((i) => i.id === 'linkedin')?.credentials || {};
      res = await linkedinAdapter.send(
        {
          profileUrl: selectedLead.linkedin || '',
          message: renderedContent,
          leadName: selectedLead.name,
        },
        linkedinConfig
      );
      logApiActivity('LinkedIn Automation', 'Log Outreach Note', 'Simulated', res.duration, `Logged for ${selectedLead.name}`);
    }

    // Auto-update lead stage to 'contacted' if it was in 'lead_generated'
    const newStage = selectedLead.stage === 'lead_generated' ? 'contacted' : selectedLead.stage;
    updateLead(
      selectedLead.id,
      {
        stage: newStage,
        contactChannel: channel,
        contactMessage: renderedContent,
        contactDate: new Date().toISOString(),
        responseStatus: 'Outreach dispatched',
      },
      `Dispatched ${channel} template: "${selectedTemplate?.name}"`
    );

    setIsSending(false);
    showToast({
      type: 'success',
      title: `${channel} Outreach Dispatched`,
      message: `Message sent to ${selectedLead.businessName} (${res?.mode === 'live' ? 'Live API' : 'Simulated / Deep Link'}).`,
    });
  };

  const handleGenerateAiPitch = async () => {
    if (!selectedLead) return;
    setAiGenerating(true);
    const aiConfig = integrations.find((i) => i.id === 'ai_assistant')?.credentials || {};
    const res = await aiAssistantAdapter.generateSalesPitch(selectedLead, aiConfig);

    logApiActivity('AI Sales Assistant', 'Generate Personalised Pitch', res.mode === 'live' ? 'Live' : 'Simulated', res.duration, `Created pitch for ${selectedLead.businessName}`);

    // Update form with AI pitch
    if (selectedTemplate) {
      updateTemplate(selectedTemplate.id, {
        content: res.text,
      });
    }
    setAiGenerating(false);
    showToast({ type: 'success', title: 'AI Pitch Injected', message: 'Personalized copy inserted into editor.' });
  };

  const handleSaveTemplate = (e) => {
    e.preventDefault();
    if (editingTemplate) {
      updateTemplate(editingTemplate.id, tplForm);
      showToast({ type: 'success', title: 'Template Updated', message: tplForm.name });
    } else {
      addTemplate(tplForm);
      showToast({ type: 'success', title: 'Template Created', message: tplForm.name });
    }
    setTemplateModalOpen(false);
    setEditingTemplate(null);
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-ink)] tracking-tight">Outreach Center</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Omni-channel cadence engine (WhatsApp, Email & LinkedIn) with live template variables and automated sequences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={() => {
              setEditingTemplate(null);
              setTplForm({
                name: '',
                channel: 'WhatsApp',
                category: 'First Outreach',
                subject: '',
                content: '',
              });
              setTemplateModalOpen(true);
            }}
          >
            New Template
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'queue', label: 'Daily Outreach Queue', count: queueLeads.length },
          { id: 'templates', label: 'Templates Library', count: templates.length },
          { id: 'sequences', label: 'Multi-Day Cadence Sequences', count: sequences.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* TAB 1: Outreach Queue & Dispatch Studio */}
      {activeTab === 'queue' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Queue List */}
          <div className="lg:col-span-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
              <span className="font-bold text-[var(--text-ink)] uppercase tracking-wider text-[11px]">
                Today's Priority Contacts
              </span>
              <span>{queueLeads.length} leads</span>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto no-scrollbar">
              {queueLeads.map((lead) => {
                const isSelected = selectedLead?.id === lead.id;
                return (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLeadId(lead.id)}
                    className={`p-3 rounded-card border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#0B1F3A] bg-[var(--bg-surface)] ring-2 ring-[#0B1F3A]/20 shadow-solid-md dark:border-[var(--accent-color)] dark:ring-[var(--accent-color)]/20'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#0B1F3A]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[var(--text-ink)] leading-snug truncate">
                        {lead.businessName}
                      </h4>
                      <Badge variant={lead.priority === 'Hot' ? 'danger' : 'warning'} size="sm">
                        {lead.priority}
                      </Badge>
                    </div>

                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5 truncate">
                      {lead.name} • {lead.city}, {lead.market}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-[var(--text-subtle)] mt-2 pt-2 border-t border-[var(--border-subtle)]">
                      <span>Interest: {lead.services?.[0] || 'Web'}</span>
                      <span className="font-semibold text-[#0B1F3A] dark:text-[var(--accent-color)]">
                        {lead.stage.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Dispatch Console */}
          <div className="lg:col-span-7">
            <Card className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div>
                  <h3 className="text-xs font-bold text-[var(--text-ink)] uppercase tracking-wider">
                    Outreach Dispatch Console
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Target: <span className="font-bold text-[var(--text-ink)]">{selectedLead?.businessName}</span> ({selectedLead?.phone || selectedLead?.email})
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  icon={Sparkles}
                  loading={aiGenerating}
                  onClick={handleGenerateAiPitch}
                  className="text-[#8A2BE2]"
                >
                  AI Personalize
                </Button>
              </div>

              {/* Template selector */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-ink)] mb-1.5">
                  Select Template
                </label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full text-xs rounded-button border border-[var(--border-subtle)] p-2 bg-[var(--bg-surface)] text-[var(--text-ink)] focus:outline-none"
                >
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      [{tpl.channel}] {tpl.name} ({tpl.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject (if Email) */}
              {selectedTemplate?.channel === 'Email' && (
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-ink)] mb-1">Email Subject</label>
                  <input
                    type="text"
                    value={renderedSubject}
                    readOnly
                    className="w-full text-xs rounded-button border border-[var(--border-subtle)] p-2 bg-[var(--bg-subtle)]/50 text-[var(--text-ink)]"
                  />
                </div>
              )}

              {/* Live Rendered Message Preview */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[var(--text-ink)]">
                    Live Rendered Message (Variables Substituted)
                  </label>
                  <span className="text-[10px] text-[var(--text-subtle)] font-mono">
                    Channel: {selectedTemplate?.channel}
                  </span>
                </div>
                <div className="p-3.5 rounded-card border border-[var(--border-subtle)] bg-[var(--bg-main)]/60 text-xs font-sans whitespace-pre-wrap leading-relaxed text-[var(--text-ink)] max-h-60 overflow-y-auto">
                  {renderedContent}
                </div>
              </div>

              {/* Dispatch Action Button */}
              <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => openLeadDrawer(selectedLead?.id)}
                  className="text-xs font-semibold text-[#0B1F3A] dark:text-[var(--accent-color)] hover:underline"
                >
                  Open Lead Details →
                </button>

                <Button
                  variant="gold"
                  size="md"
                  icon={Send}
                  loading={isSending}
                  onClick={handleSendOutreach}
                >
                  Dispatch via {selectedTemplate?.channel || 'WhatsApp'}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: Templates Library */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((tpl) => (
            <Card key={tpl.id} className="flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant={tpl.channel === 'WhatsApp' ? 'success' : tpl.channel === 'Email' ? 'info' : 'navy'}>
                    {tpl.channel}
                  </Badge>
                  <span className="text-[10px] text-[var(--text-subtle)] font-semibold">{tpl.category}</span>
                </div>

                <h3 className="text-xs font-bold text-[var(--text-ink)] leading-snug">{tpl.name}</h3>
                {tpl.subject && (
                  <p className="text-[11px] font-semibold text-[var(--text-muted)] mt-1 truncate">
                    Subj: {tpl.subject}
                  </p>
                )}
                <p className="text-[11px] text-[var(--text-muted)] mt-2 line-clamp-4 leading-relaxed font-mono bg-[var(--bg-subtle)]/40 p-2 rounded">
                  {tpl.content}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Edit2}
                  onClick={() => {
                    setEditingTemplate(tpl);
                    setTplForm({ ...tpl });
                    setTemplateModalOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={() => {
                    deleteTemplate(tpl.id);
                    showToast({ type: 'warning', title: 'Template Removed', message: tpl.name });
                  }}
                  className="text-[#C23B3B]"
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 3: Sequences */}
      {activeTab === 'sequences' && (
        <div className="space-y-4">
          {sequences.map((seq) => (
            <Card key={seq.id} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[var(--text-ink)]">{seq.name}</h3>
                    <Badge variant={seq.enabled ? 'success' : 'default'} size="sm">
                      {seq.enabled ? 'Active Cadence' : 'Disabled'}
                    </Badge>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{seq.description}</p>
                </div>

                <Button
                  variant={seq.enabled ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => toggleSequence(seq.id)}
                >
                  {seq.enabled ? 'Pause Sequence' : 'Activate Sequence'}
                </Button>
              </div>

              {/* Step Flow */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                {seq.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-button border border-[var(--border-subtle)] bg-[var(--bg-main)]/60 text-xs space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[var(--accent-color)]">Day {step.day}</span>
                      <Badge variant={step.channel === 'WhatsApp' ? 'success' : 'info'} size="sm">
                        {step.channel}
                      </Badge>
                    </div>
                    <p className="font-semibold text-[var(--text-ink)]">{step.title}</p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Template Create / Edit Modal */}
      <Modal
        isOpen={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        title={editingTemplate ? 'Edit Outreach Template' : 'Create Outreach Template'}
        subtitle="Use variables: {name}, {business}, {service}, {city}, {currency}"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveTemplate} className="space-y-3 text-xs">
          <Input
            label="Template Title"
            value={tplForm.name}
            onChange={(e) => setTplForm({ ...tplForm, name: e.target.value })}
            placeholder="e.g. Dubai Luxury Agency Intro"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Communication Channel"
              options={['WhatsApp', 'Email', 'LinkedIn']}
              value={tplForm.channel}
              onChange={(e) => setTplForm({ ...tplForm, channel: e.target.value })}
            />
            <Select
              label="Sequence Category"
              options={['First Outreach', 'Follow-up', 'Post-Meeting', 'Proposal Follow-up']}
              value={tplForm.category}
              onChange={(e) => setTplForm({ ...tplForm, category: e.target.value })}
            />
          </div>

          {tplForm.channel === 'Email' && (
            <Input
              label="Email Subject"
              value={tplForm.subject}
              onChange={(e) => setTplForm({ ...tplForm, subject: e.target.value })}
              placeholder="e.g. Strategic idea for {business} — {service}"
            />
          )}

          <div>
            <label className="block text-xs font-semibold text-[var(--text-ink)] mb-1">
              Template Body Copy
            </label>
            <textarea
              rows={6}
              value={tplForm.content}
              onChange={(e) => setTplForm({ ...tplForm, content: e.target.value })}
              placeholder="Type template message with variables..."
              className="w-full text-xs rounded-button border border-[var(--border-subtle)] p-2.5 bg-[var(--bg-surface)] text-[var(--text-ink)] focus:outline-none font-sans"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
            <Button variant="secondary" size="sm" onClick={() => setTemplateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Template
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
