import React, { useState, useMemo } from 'react';
import { Kanban, List, Table as TableIcon, Plus, Download, Trash2, Tag, UserCheck, ChevronRight } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { LeadFilters } from '../components/leads/LeadFilters';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { formatCurrency, formatDate } from '../lib/formatters';
import { PIPELINE_STAGES } from '../lib/constants';
import { showToast } from '../hooks/useToast';
import Papa from 'papaparse';

export function PipelinePage() {
  const { leads, setQuickAddModalOpen, openLeadDrawer, moveLeadStage, deleteLead, settings } = useAppStore();

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list' | 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    stage: '',
    market: '',
    priority: '',
    service: '',
    source: '',
  });
  const [activePreset, setActivePreset] = useState('all');
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          lead.name?.toLowerCase().includes(q) ||
          lead.businessName?.toLowerCase().includes(q) ||
          lead.city?.toLowerCase().includes(q) ||
          lead.notes?.toLowerCase().includes(q) ||
          (lead.services || []).some((s) => s.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Stage
      if (filters.stage && lead.stage !== filters.stage) return false;
      // Market
      if (filters.market && lead.market !== filters.market) return false;
      // Priority
      if (filters.priority && lead.priority !== filters.priority) return false;
      // Source
      if (filters.source && lead.source !== filters.source) return false;
      // Service
      if (filters.service && !(lead.services || []).includes(filters.service)) return false;

      return true;
    });
  }, [leads, searchQuery, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setActivePreset('');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({ stage: '', market: '', priority: '', service: '', source: '' });
    setActivePreset('all');
  };

  const handleSavePreset = (preset) => {
    setActivePreset(preset.id);
    setSearchQuery('');
    setFilters({
      stage: preset.stage || '',
      market: preset.market || '',
      priority: preset.priority || '',
      service: preset.service || '',
      source: preset.source || '',
    });
  };

  // Bulk actions
  const toggleSelectLead = (id) => {
    if (selectedLeadIds.includes(id)) {
      setSelectedLeadIds(selectedLeadIds.filter((item) => item !== id));
    } else {
      setSelectedLeadIds([...selectedLeadIds, id]);
    }
  };

  const selectAll = () => {
    if (selectedLeadIds.length === filteredLeads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(filteredLeads.map((l) => l.id));
    }
  };

  const handleBulkMove = (targetStage) => {
    selectedLeadIds.forEach((id) => moveLeadStage(id, targetStage));
    showToast({ type: 'success', title: 'Bulk Move', message: `Moved ${selectedLeadIds.length} deals to ${targetStage}.` });
    setSelectedLeadIds([]);
  };

  const handleBulkDelete = () => {
    selectedLeadIds.forEach((id) => deleteLead(id));
    showToast({ type: 'warning', title: 'Bulk Delete', message: `Deleted ${selectedLeadIds.length} deals.` });
    setSelectedLeadIds([]);
  };

  const handleExportCsv = () => {
    const toExport = filteredLeads.map((l) => ({
      ID: l.id,
      Name: l.name,
      Business: l.businessName,
      Role: l.contactPersonRole,
      Phone: l.phone,
      Email: l.email,
      Market: l.market,
      City: l.city,
      Stage: l.stage,
      Priority: l.priority,
      Value: l.expectedValue,
      Currency: l.currency,
      Services: (l.services || []).join('; '),
      Source: l.source,
      CreatedAt: l.createdAt,
    }));

    const csv = Papa.unparse(toExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'Westmere_Pipeline_Export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast({ type: 'success', title: 'Export Ready', message: 'Pipeline CSV exported successfully.' });
  };

  return (
    <div className="space-y-4">
      {/* Page Title & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-ink)] tracking-tight">Sales Pipeline</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {filteredLeads.length} active deals • Drag and drop cards to progress deal stages
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex rounded-button border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`px-2.5 py-1.5 rounded-button flex items-center gap-1.5 font-medium transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-[#0B1F3A] text-white dark:bg-[var(--accent-color)] dark:text-[#0B1F3A]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-ink)]'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1.5 rounded-button flex items-center gap-1.5 font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#0B1F3A] text-white dark:bg-[var(--accent-color)] dark:text-[#0B1F3A]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-ink)]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1.5 rounded-button flex items-center gap-1.5 font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-[#0B1F3A] text-white dark:bg-[var(--accent-color)] dark:text-[#0B1F3A]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-ink)]'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <Button variant="outline" size="sm" icon={Download} onClick={handleExportCsv}>
            Export
          </Button>

          <Button variant="gold" size="sm" icon={Plus} onClick={() => setQuickAddModalOpen(true)}>
            Add Deal
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <LeadFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        onSavePreset={handleSavePreset}
        activePreset={activePreset}
      />

      {/* Bulk Select Action Bar (shown when 1+ deals selected) */}
      {selectedLeadIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-card bg-[#0B1F3A] text-white shadow-solid animate-fadeIn">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-[var(--accent-color)]">{selectedLeadIds.length} deals selected</span>
            <button
              type="button"
              onClick={() => setSelectedLeadIds([])}
              className="text-[11px] text-[#8EA3BF] hover:text-white underline"
            >
              Deselect All
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              onChange={(e) => e.target.value && handleBulkMove(e.target.value)}
              className="text-xs rounded-button bg-[#16335C] border border-[#1E3E6B] text-white px-2 py-1 focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Move Stage...
              </option>
              {PIPELINE_STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <Button variant="danger" size="sm" icon={Trash2} onClick={handleBulkDelete}>
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Render Current View */}
      {viewMode === 'kanban' && <KanbanBoard filteredLeads={filteredLeads} />}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-2">
          {filteredLeads.map((lead) => {
            const stageObj = PIPELINE_STAGES.find((s) => s.id === lead.stage) || PIPELINE_STAGES[0];
            return (
              <Card
                key={lead.id}
                hoverable
                onClick={() => openLeadDrawer(lead.id)}
                padding="p-3"
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <input
                    type="checkbox"
                    checked={selectedLeadIds.includes(lead.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleSelectLead(lead.id);
                    }}
                    className="rounded text-[#0B1F3A] cursor-pointer"
                  />
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[var(--text-ink)] truncate">{lead.businessName}</span>
                      <span className="text-[10px] text-[var(--text-muted)] truncate">({lead.name})</span>
                      <Badge variant={lead.priority === 'Hot' ? 'danger' : lead.priority === 'Warm' ? 'warning' : 'default'} size="sm">
                        {lead.priority}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
                      {lead.city}, {lead.market} • {(lead.services || []).join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                    style={{ backgroundColor: stageObj.color }}
                  >
                    {stageObj.name}
                  </span>
                  <span className="text-xs font-extrabold text-[#0B1F3A] dark:text-[var(--accent-color)]">
                    {formatCurrency(lead.expectedValue, lead.currency)}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[var(--text-subtle)]" />
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto rounded-card border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-solid">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-muted)] font-semibold uppercase text-[11px]">
                <th className="p-3 w-8">
                  <input
                    type="checkbox"
                    checked={selectedLeadIds.length === filteredLeads.length && filteredLeads.length > 0}
                    onChange={selectAll}
                    className="rounded text-[#0B1F3A]"
                  />
                </th>
                <th className="p-3">Company & Contact</th>
                <th className="p-3">Market</th>
                <th className="p-3">Stage</th>
                <th className="p-3">Priority</th>
                <th className="p-3 text-right">Value</th>
                <th className="p-3">Services</th>
                <th className="p-3">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => openLeadDrawer(lead.id)}
                  className="hover:bg-[var(--bg-subtle)]/50 cursor-pointer transition-colors"
                >
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedLeadIds.includes(lead.id)}
                      onChange={() => toggleSelectLead(lead.id)}
                      className="rounded text-[#0B1F3A]"
                    />
                  </td>
                  <td className="p-3 font-semibold text-[var(--text-ink)]">
                    <p className="truncate font-bold">{lead.businessName}</p>
                    <p className="text-[11px] text-[var(--text-muted)] font-normal">{lead.name}</p>
                  </td>
                  <td className="p-3 text-[var(--text-muted)]">{lead.city}, {lead.market}</td>
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={lead.stage}
                      onChange={(e) => moveLeadStage(lead.id, e.target.value)}
                      className="text-xs rounded border border-[var(--border-subtle)] p-1 bg-[var(--bg-surface)] text-[var(--text-ink)] focus:outline-none"
                    >
                      {PIPELINE_STAGES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    <Badge variant={lead.priority === 'Hot' ? 'danger' : lead.priority === 'Warm' ? 'warning' : 'default'} size="sm">
                      {lead.priority}
                    </Badge>
                  </td>
                  <td className="p-3 text-right font-extrabold text-[#0B1F3A] dark:text-[var(--accent-color)]">
                    {formatCurrency(lead.expectedValue, lead.currency)}
                  </td>
                  <td className="p-3 text-[11px] text-[var(--text-muted)] truncate max-w-[160px]">
                    {(lead.services || []).join(', ')}
                  </td>
                  <td className="p-3 text-[var(--text-muted)]">{lead.owner || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
