import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  Mail,
  Linkedin,
  Calendar,
  Sparkles,
  Copy,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { Drawer } from '../ui/Drawer';
import { Tabs } from '../ui/Tabs';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { LeadScoreBreakdown } from './LeadScoreBreakdown';
import { LeadActivityFeed } from './LeadActivityFeed';
import { formatCurrency, formatDate } from '../../lib/formatters';
import { PIPELINE_STAGES } from '../../lib/constants';
import { showToast } from '../../hooks/useToast';
import { aiAssistantAdapter } from '../../services/integrations/aiAssistant';

export function LeadDrawer() {
  const {
    leads,
    activeLeadId,
    activeLeadDrawerOpen,
    closeLeadDrawer,
    updateLead,
    deleteLead,
    undoDeleteLead,
    tasks,
    toggleTaskComplete,
    addTask,
    proposals,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [aiAction, setAiAction] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const lead = leads.find((l) => l.id === activeLeadId);

  if (!lead) return null;

  const leadTasks = tasks.filter((t) => t.leadId === lead.id);
  const leadProposals = proposals.filter((p) => p.leadId === lead.id);

  // Quick Action Handlers
  const handleCall = () => {
    window.open(`tel:${lead.phone}`, '_self');
    updateLead(lead.id, {}, `Phone call initiated to ${lead.phone}`);
  };

  const handleWhatsApp = () => {
    const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hi ${lead.name}, this is from Westmere Solutions regarding ${lead.businessName}.`);
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
    updateLead(lead.id, {}, `WhatsApp conversation opened with ${lead.name}`);
  };

  const handleEmail = () => {
    window.open(`mailto:${lead.email}?subject=Westmere Solutions + ${lead.businessName}`, '_self');
    updateLead(lead.id, {}, `Email client opened for ${lead.email}`);
  };

  const handleFetchAi = async () => {
    setLoadingAi(true);
    const res = await aiAssistantAdapter.suggestNextAction(lead);
    setAiAction(res);
    setLoadingAi(false);
  };

  const handleDuplicate = () => {
    const dup = {
      ...lead,
      name: `${lead.name} (Copy)`,
      businessName: `${lead.businessName} (Copy)`,
    };
    useAppStore.getState().addLead(dup);
    showToast({ type: 'success', title: 'Lead Duplicated', message: `Created copy of ${lead.businessName}` });
  };

  const handleDelete = () => {
    deleteLead(lead.id);
    closeLeadDrawer();
    showToast({
      type: 'warning',
      title: 'Lead Deleted',
      message: `${lead.businessName} removed from CRM.`,
      action: {
        label: 'Undo Delete',
        onClick: () => undoDeleteLead(),
      },
    });
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({
      leadId: lead.id,
      leadName: `${lead.name} (${lead.businessName})`,
      title: newTaskTitle,
      dueDate: new Date().toISOString().split('T')[0],
      priority: lead.priority || 'Warm',
      category: 'Follow-up',
    });
    setNewTaskTitle('');
    showToast({ type: 'success', title: 'Task Added', message: 'Task linked to lead' });
  };

  const drawerTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'timeline', label: 'Activity Timeline', count: lead.activities?.length || 0 },
    { id: 'tasks', label: 'Tasks & Follow-ups', count: leadTasks.length },
    { id: 'proposals', label: 'Proposals', count: leadProposals.length },
    { id: 'notes', label: 'Notes & Files' },
  ];

  const currentStage = PIPELINE_STAGES.find((s) => s.id === lead.stage) || PIPELINE_STAGES[0];

  return (
    <Drawer
      isOpen={activeLeadDrawerOpen}
      onClose={closeLeadDrawer}
      width="max-w-2xl"
      title={lead.businessName || lead.name}
      subtitle={`${lead.name} • ${lead.city}, ${lead.country} • ${lead.market}`}
      footer={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={Copy} onClick={handleDuplicate}>
              Duplicate
            </Button>
            <Button variant="danger" size="sm" icon={Trash2} onClick={handleDelete}>
              Delete
            </Button>
          </div>
          <Button variant="secondary" size="sm" onClick={closeLeadDrawer}>
            Close
          </Button>
        </div>
      }
    >
      {/* Top Banner: Stage Badge + Quick Action Buttons */}
      <div className="mb-5 pb-4 border-b border-[var(--border-subtle)] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)] font-medium">Stage:</span>
            <span
              className="px-2.5 py-1 rounded text-xs font-bold text-white shadow-solid-sm"
              style={{ backgroundColor: currentStage.color }}
            >
              {currentStage.name}
            </span>
            <Badge variant={lead.priority === 'Hot' ? 'danger' : lead.priority === 'Warm' ? 'warning' : 'default'}>
              {lead.priority} Priority
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[var(--text-subtle)] uppercase tracking-wider font-semibold">Value</p>
            <p className="text-base font-extrabold text-[#0B1F3A] dark:text-[var(--accent-color)]">
              {formatCurrency(lead.expectedValue, lead.currency)}
            </p>
          </div>
        </div>

        {/* Quick Actions Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Button variant="outline" size="sm" icon={Phone} onClick={handleCall}>
            Call
          </Button>
          <Button variant="outline" size="sm" icon={MessageSquare} onClick={handleWhatsApp} className="text-[#1F8A5B]">
            WhatsApp
          </Button>
          <Button variant="outline" size="sm" icon={Mail} onClick={handleEmail} className="text-[#2F6FB5]">
            Email
          </Button>
          {lead.linkedin && (
            <Button
              variant="outline"
              size="sm"
              icon={Linkedin}
              onClick={() => window.open(lead.linkedin, '_blank')}
              className="text-[#0A66C2]"
            >
              LinkedIn
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            icon={Sparkles}
            onClick={handleFetchAi}
            loading={loadingAi}
            className="text-[#8A2BE2]"
          >
            AI Insight
          </Button>
        </div>
      </div>

      {/* AI Suggestion Alert Banner (if generated) */}
      {aiAction && (
        <div className="mb-4 p-3 rounded-card bg-[#8A2BE2]/10 border border-[#8A2BE2]/30 text-xs">
          <div className="flex items-center gap-2 font-bold text-[#8A2BE2] mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Next-Best-Action Recommended</span>
          </div>
          <p className="font-semibold text-[var(--text-ink)] mb-0.5">{aiAction.action}</p>
          <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">{aiAction.reason}</p>
        </div>
      )}

      {/* Tabs */}
      <Tabs tabs={drawerTabs} activeTab={activeTab} onChange={setActiveTab} className="mb-4" />

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <LeadScoreBreakdown lead={lead} />

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs rounded-card border border-[var(--border-subtle)] p-4 bg-[var(--bg-card)]">
            <div>
              <p className="text-[11px] text-[var(--text-muted)]">Contact Person</p>
              <p className="font-semibold text-[var(--text-ink)] mt-0.5">{lead.name}</p>
              <p className="text-[10px] text-[var(--text-subtle)]">{lead.contactPersonRole}</p>
            </div>
            <div>
              <p className="text-[11px] text-[var(--text-muted)]">Sales Owner</p>
              <p className="font-semibold text-[var(--text-ink)] mt-0.5">{lead.owner || 'Unassigned'}</p>
            </div>
            <div>
              <p className="text-[11px] text-[var(--text-muted)]">Phone</p>
              <p className="font-semibold text-[var(--text-ink)] mt-0.5 font-mono">{lead.phone || '—'}</p>
            </div>
            <div>
              <p className="text-[11px] text-[var(--text-muted)]">Email</p>
              <p className="font-semibold text-[var(--text-ink)] mt-0.5 truncate">{lead.email || '—'}</p>
            </div>
            <div>
              <p className="text-[11px] text-[var(--text-muted)]">Lead Source</p>
              <p className="font-semibold text-[var(--text-ink)] mt-0.5">{lead.source}</p>
            </div>
            <div>
              <p className="text-[11px] text-[var(--text-muted)]">Expected Close</p>
              <p className="font-semibold text-[var(--text-ink)] mt-0.5">{formatDate(lead.expectedCloseDate)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-[11px] text-[var(--text-muted)] mb-1">Services Interested</p>
              <div className="flex flex-wrap gap-1">
                {(lead.services || []).map((s) => (
                  <Badge key={s} variant="info" size="sm">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="col-span-2">
              <p className="text-[11px] text-[var(--text-muted)] mb-1">Tags</p>
              <div className="flex flex-wrap gap-1">
                {(lead.tags || []).map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded text-[10px] bg-[var(--bg-subtle)] text-[var(--text-muted)]">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Qualification Highlights */}
          <div className="rounded-card border border-[var(--border-subtle)] p-4 bg-[var(--bg-card)] text-xs space-y-2">
            <h4 className="font-bold text-[var(--text-ink)]">Qualification Status</h4>
            <div className="flex items-center justify-between py-1 border-b border-[var(--border-subtle)]">
              <span>Budget Verified</span>
              <span className={`font-bold ${lead.budgetVerified ? 'text-[#1F8A5B]' : 'text-[var(--text-subtle)]'}`}>
                {lead.budgetVerified ? '✓ Verified' : '✕ Pending'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-[var(--border-subtle)]">
              <span>Decision Maker Confirmed</span>
              <span className={`font-bold ${lead.decisionMakerVerified ? 'text-[#1F8A5B]' : 'text-[var(--text-subtle)]'}`}>
                {lead.decisionMakerVerified ? '✓ Verified' : '✕ Pending'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>Timeline Urgency</span>
              <span className="font-semibold text-[var(--text-ink)]">{lead.timelineUrgency || 'Moderate'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Activity Timeline */}
      {activeTab === 'timeline' && (
        <LeadActivityFeed
          lead={lead}
          onAddActivity={(note) => updateLead(lead.id, {}, note)}
        />
      )}

      {/* Tab 3: Tasks & Follow-ups */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <form onSubmit={handleCreateTask} className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add next follow-up action..."
              className="flex-1 text-xs rounded-button border border-[var(--border-subtle)] px-3 py-2 bg-[var(--bg-surface)] text-[var(--text-ink)] focus:outline-none"
            />
            <Button variant="primary" size="sm" type="submit" disabled={!newTaskTitle.trim()}>
              Add Task
            </Button>
          </form>

          <div className="space-y-2">
            {leadTasks.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] text-center py-6">No tasks assigned to this lead yet.</p>
            ) : (
              leadTasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-button border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleTaskComplete(t.id)}
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 cursor-pointer ${
                        t.status === 'completed'
                          ? 'bg-[#1F8A5B] border-[#1F8A5B] text-white'
                          : 'border-[var(--border-subtle)] hover:border-[#0B1F3A]'
                      }`}
                    >
                      {t.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <span className={`truncate ${t.status === 'completed' ? 'line-through text-[var(--text-subtle)]' : 'text-[var(--text-ink)] font-medium'}`}>
                      {t.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--text-subtle)] shrink-0 ml-2">Due {formatDate(t.dueDate)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Proposals */}
      {activeTab === 'proposals' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-[var(--text-ink)]">Client Proposals</span>
            <Button
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={() => {
                closeLeadDrawer();
                window.location.href = '/proposals';
              }}
            >
              New Proposal
            </Button>
          </div>

          {leadProposals.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)] text-center py-6">No proposals generated for this lead yet.</p>
          ) : (
            leadProposals.map((prop) => (
              <div key={prop.id} className="p-3 rounded-card border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold">
                  <span>{prop.proposalNumber}</span>
                  <Badge variant={prop.status === 'Accepted' ? 'success' : prop.status === 'Sent' ? 'info' : 'warning'}>
                    {prop.status}
                  </Badge>
                </div>
                <p className="text-xs text-[var(--text-ink)] font-semibold">{prop.title}</p>
                <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-1">
                  <span>Total: {formatCurrency(prop.total, prop.currency)}</span>
                  <span>Valid till: {formatDate(prop.validityDate)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 5: Notes & Files */}
      {activeTab === 'notes' && (
        <div className="space-y-3 text-xs">
          <div className="rounded-card border border-[var(--border-subtle)] p-4 bg-[var(--bg-card)] space-y-2">
            <h4 className="font-bold text-[var(--text-ink)]">Project Requirements & Scope Notes</h4>
            <p className="text-[var(--text-ink)] leading-relaxed bg-[var(--bg-subtle)]/50 p-3 rounded-button font-mono text-[11px]">
              {lead.notes || 'No project notes recorded yet.'}
            </p>
          </div>

          <div className="rounded-card border border-[var(--border-subtle)] p-4 bg-[var(--bg-card)] space-y-2">
            <h4 className="font-bold text-[var(--text-ink)]">Files & Attachments</h4>
            <p className="text-[11px] text-[var(--text-muted)]">Technical specs, RFPs, and wireframes</p>
            <div className="p-3 border border-dashed border-[var(--border-subtle)] rounded-button text-center text-xs text-[var(--text-muted)]">
              Drop project briefs, RFPs or NDA documents here to link with prospect
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}
