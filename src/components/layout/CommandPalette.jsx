import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Building, ArrowRight, Plus, FileText, Calendar, Kanban, Users, Settings, Sparkles } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { formatCurrency } from '../../lib/formatters';

export function CommandPalette() {
  const navigate = useNavigate();
  const { commandPaletteOpen, setCommandPaletteOpen, leads, setQuickAddModalOpen, openLeadDrawer } = useAppStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const filteredLeads = query.trim()
    ? leads
        .filter(
          (l) =>
            l.name.toLowerCase().includes(query.toLowerCase()) ||
            l.businessName.toLowerCase().includes(query.toLowerCase()) ||
            l.city.toLowerCase().includes(query.toLowerCase()) ||
            (l.services || []).some((s) => s.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, 6)
    : [];

  const pages = [
    { label: 'Pipeline Kanban', path: '/pipeline', icon: Kanban },
    { label: 'Leads Directory', path: '/leads', icon: Users },
    { label: 'Targets & Goals', path: '/targets', icon: TargetIcon },
    { label: 'Outreach Center', path: '/outreach', icon: ArrowRight },
    { label: 'Meetings Calendar', path: '/meetings', icon: Calendar },
    { label: 'Proposals Builder', path: '/proposals', icon: FileText },
    { label: 'Integrations & API', path: '/settings/integrations', icon: Sparkles },
    { label: 'Branding Settings', path: '/settings', icon: Settings },
  ].filter((p) => !query || p.label.toLowerCase().includes(query.toLowerCase()));

  function TargetIcon(props) {
    return <Kanban {...props} />;
  }

  const handleSelectPage = (path) => {
    setCommandPaletteOpen(false);
    navigate(path);
  };

  const handleSelectLead = (id) => {
    setCommandPaletteOpen(false);
    openLeadDrawer(id);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
        {/* Flat backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCommandPaletteOpen(false)}
          className="fixed inset-0 bg-[#061224]/75"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-xl rounded-modal border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-solid-lg overflow-hidden z-10"
        >
          {/* Search Input bar */}
          <div className="flex items-center px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-card)]">
            <Search className="w-4 h-4 text-[var(--text-muted)] shrink-0 mr-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search prospects, pages, or actions..."
              className="w-full bg-transparent text-sm text-[var(--text-ink)] placeholder-[var(--text-subtle)] focus:outline-none"
            />
            <kbd className="text-[10px] bg-[var(--bg-subtle)] px-2 py-0.5 rounded border border-[var(--border-subtle)] font-mono text-[var(--text-muted)]">
              ESC
            </kbd>
          </div>

          <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[var(--border-subtle)]">
            {/* Quick Actions */}
            <div className="pb-2">
              <p className="px-3 py-1.5 text-[10px] font-bold text-[var(--text-subtle)] uppercase tracking-wider">
                Quick Actions
              </p>
              <button
                type="button"
                onClick={() => {
                  setCommandPaletteOpen(false);
                  setQuickAddModalOpen(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-[var(--text-ink)] rounded-button hover:bg-[var(--bg-subtle)] transition-colors text-left"
              >
                <div className="w-6 h-6 rounded bg-[#C9A24B] text-[#0B1F3A] flex items-center justify-center shrink-0 font-bold">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                <span>Create New Prospect (Shortcut: N)</span>
              </button>
            </div>

            {/* Prospects matching query */}
            {filteredLeads.length > 0 && (
              <div className="py-2">
                <p className="px-3 py-1.5 text-[10px] font-bold text-[var(--text-subtle)] uppercase tracking-wider">
                  Prospects ({filteredLeads.length})
                </p>
                {filteredLeads.map((lead) => (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={() => handleSelectLead(lead.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-button hover:bg-[var(--bg-subtle)] transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Building className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                      <div className="truncate">
                        <p className="font-semibold text-[var(--text-ink)] truncate">{lead.businessName || lead.name}</p>
                        <p className="text-[11px] text-[var(--text-muted)] truncate">{lead.name} • {lead.city}, {lead.market}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-xs text-[#0B1F3A] dark:text-[var(--accent-color)] shrink-0 ml-2">
                      {formatCurrency(lead.expectedValue, lead.currency)}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Navigation Pages */}
            <div className="pt-2">
              <p className="px-3 py-1.5 text-[10px] font-bold text-[var(--text-subtle)] uppercase tracking-wider">
                Navigate Pages
              </p>
              {pages.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.path}
                    type="button"
                    onClick={() => handleSelectPage(p.path)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-[var(--text-ink)] rounded-button hover:bg-[var(--bg-subtle)] transition-colors text-left"
                  >
                    <Icon className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
