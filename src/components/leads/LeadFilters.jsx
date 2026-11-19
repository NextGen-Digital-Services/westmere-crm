import React from 'react';
import { Search, Filter, X, Bookmark } from 'lucide-react';
import { PIPELINE_STAGES, SOURCES, SERVICES, MARKETS, PRIORITIES } from '../../lib/constants';
import { Button } from '../ui/Button';

export function LeadFilters({
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  onResetFilters,
  onSavePreset,
  activePreset,
}) {
  const hasActiveFilters =
    Boolean(searchQuery) ||
    Boolean(filters.stage) ||
    Boolean(filters.market) ||
    Boolean(filters.priority) ||
    Boolean(filters.service) ||
    Boolean(filters.source);

  return (
    <div className="space-y-2.5 mb-4">
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search prospect by name, company, city, notes..."
            className="w-full text-xs rounded-button border border-[var(--border-subtle)] pl-9 pr-3 py-2 bg-[var(--bg-surface)] text-[var(--text-ink)] focus:outline-none focus:border-[#0B1F3A]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2.5 text-[var(--text-muted)] hover:text-[var(--text-ink)]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Market Filter */}
        <select
          value={filters.market || ''}
          onChange={(e) => onFilterChange('market', e.target.value)}
          className="text-xs rounded-button border border-[var(--border-subtle)] px-2.5 py-2 bg-[var(--bg-surface)] text-[var(--text-ink)] focus:outline-none"
        >
          <option value="">All Markets</option>
          {MARKETS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.flag} {m.name}
            </option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={filters.priority || ''}
          onChange={(e) => onFilterChange('priority', e.target.value)}
          className="text-xs rounded-button border border-[var(--border-subtle)] px-2.5 py-2 bg-[var(--bg-surface)] text-[var(--text-ink)] focus:outline-none"
        >
          <option value="">All Priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>

        {/* Service Filter */}
        <select
          value={filters.service || ''}
          onChange={(e) => onFilterChange('service', e.target.value)}
          className="text-xs rounded-button border border-[var(--border-subtle)] px-2.5 py-2 bg-[var(--bg-surface)] text-[var(--text-ink)] focus:outline-none max-w-[150px] truncate"
        >
          <option value="">All Services</option>
          {SERVICES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Source Filter */}
        <select
          value={filters.source || ''}
          onChange={(e) => onFilterChange('source', e.target.value)}
          className="text-xs rounded-button border border-[var(--border-subtle)] px-2.5 py-2 bg-[var(--bg-surface)] text-[var(--text-ink)] focus:outline-none max-w-[150px] truncate"
        >
          <option value="">All Sources</option>
          {SOURCES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Reset button */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onResetFilters} className="text-[#C23B3B]">
            Reset Filters
          </Button>
        )}
      </div>

      {/* Quick Preset Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
        <span className="text-[var(--text-subtle)] font-medium mr-1 flex items-center gap-1 shrink-0">
          <Bookmark className="w-3 h-3" /> Quick views:
        </span>
        {[
          { id: 'all', label: 'All Deals' },
          { id: 'hot_india', label: '🔥 Hot India Deals', market: 'India', priority: 'Hot' },
          { id: 'dubai_luxury', label: '🇦🇪 UAE High Value', market: 'UAE' },
          { id: 'inbound', label: '🚀 Inbound Leads', source: 'Inbound Website' },
        ].map((preset) => {
          const isActive = activePreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSavePreset(preset)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors shrink-0 ${
                isActive
                  ? 'bg-[#0B1F3A] text-white dark:bg-[var(--accent-color)] dark:text-[#0B1F3A] font-bold'
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:border-[#0B1F3A]'
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
