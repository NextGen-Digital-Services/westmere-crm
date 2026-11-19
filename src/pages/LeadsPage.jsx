import React, { useState, useMemo, useRef } from 'react';
import {
  Users,
  Search,
  Download,
  Upload,
  Plus,
  ArrowUpDown,
  Filter,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import Papa from 'papaparse';
import { useAppStore } from '../lib/store';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { formatCurrency, formatDate } from '../lib/formatters';
import { PIPELINE_STAGES, PRIORITIES, SERVICES, MARKETS } from '../lib/constants';
import { showToast } from '../hooks/useToast';

export function LeadsPage() {
  const { leads, addLead, updateLead, deleteLead, setQuickAddModalOpen, openLeadDrawer } = useAppStore();

  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Column visibility chooser
  const [visibleColumns, setVisibleColumns] = useState({
    business: true,
    contact: true,
    market: true,
    stage: true,
    priority: true,
    value: true,
    services: true,
    owner: true,
    date: true,
  });
  const [columnChooserOpen, setColumnChooserOpen] = useState(false);

  // CSV Import State
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [csvRows, setCsvRows] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [columnMapping, setColumnMapping] = useState({
    name: '',
    businessName: '',
    phone: '',
    email: '',
    market: '',
    expectedValue: '',
  });
  const fileInputRef = useRef(null);

  // Sorting
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  // Filtered & Sorted Data
  const filteredData = useMemo(() => {
    let result = [...leads];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.businessName.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          l.email.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let valA = a[sortKey] || '';
      let valB = b[sortKey] || '';

      if (sortKey === 'expectedValue') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      }

      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [leads, search, sortKey, sortDir]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // CSV File Handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const headers = results.meta.fields || Object.keys(results.data[0]);
          setCsvHeaders(headers);
          setCsvRows(results.data);

          // Auto-guess column mapping
          const guessed = { ...columnMapping };
          headers.forEach((h) => {
            const lower = h.toLowerCase();
            if (lower.includes('name') && !lower.includes('business') && !lower.includes('company')) guessed.name = h;
            if (lower.includes('business') || lower.includes('company') || lower.includes('client')) guessed.businessName = h;
            if (lower.includes('phone') || lower.includes('mobile')) guessed.phone = h;
            if (lower.includes('email') || lower.includes('mail')) guessed.email = h;
            if (lower.includes('market') || lower.includes('country')) guessed.market = h;
            if (lower.includes('value') || lower.includes('budget') || lower.includes('price')) guessed.expectedValue = h;
          });
          setColumnMapping(guessed);
          setCsvModalOpen(true);
        }
      },
    });
  };

  const handleImportSubmit = () => {
    let importedCount = 0;
    let duplicateCount = 0;

    csvRows.forEach((row) => {
      const name = row[columnMapping.name] || 'Imported Prospect';
      const businessName = row[columnMapping.businessName] || name;
      const phone = row[columnMapping.phone] || '';
      const email = row[columnMapping.email] || '';
      const market = row[columnMapping.market] || 'India';
      const expectedValue = Number(row[columnMapping.expectedValue]) || 500000;

      const res = addLead({
        name,
        businessName,
        phone,
        email,
        market: market.includes('UAE') ? 'UAE' : 'India',
        currency: market.includes('UAE') ? 'AED' : 'INR',
        city: market.includes('UAE') ? 'Dubai' : 'Mumbai',
        expectedValue,
        source: 'CSV Import',
      });

      if (res.isDuplicate) duplicateCount++;
      importedCount++;
    });

    setCsvModalOpen(false);
    showToast({
      type: 'success',
      title: 'CSV Import Complete',
      message: `Imported ${importedCount} records. (${duplicateCount} duplicate warnings flagged).`,
    });
  };

  const handleExportCsv = () => {
    const toExport = filteredData.map((l) => ({
      ID: l.id,
      Business: l.businessName,
      Contact: l.name,
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
    link.setAttribute('download', 'Westmere_Leads_Full_Export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast({ type: 'success', title: 'Export Complete', message: 'Downloaded leads spreadsheet.' });
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-ink)] tracking-tight">Leads Directory</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Full searchable prospect registry with inline editing, CSV import, and column chooser.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Hidden file input for CSV */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv"
            className="hidden"
          />

          <Button variant="outline" size="sm" icon={Upload} onClick={() => fileInputRef.current.click()}>
            Import CSV
          </Button>

          <Button variant="outline" size="sm" icon={Download} onClick={handleExportCsv}>
            Export
          </Button>

          <Button variant="gold" size="sm" icon={Plus} onClick={() => setQuickAddModalOpen(true)}>
            Add Lead
          </Button>
        </div>
      </div>

      {/* Control bar: Search + Column Chooser + Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-card border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-solid-sm">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)] pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by company, name, phone, email..."
            className="w-full text-xs rounded-button border border-[var(--border-subtle)] pl-9 pr-3 py-2 bg-[var(--bg-surface)] text-[var(--text-ink)] focus:outline-none focus:border-[#0B1F3A]"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--text-muted)] font-medium">
            Showing <span className="font-bold text-[var(--text-ink)]">{filteredData.length}</span> prospects
          </span>

          {/* Column Chooser Button */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              icon={Eye}
              onClick={() => setColumnChooserOpen(!columnChooserOpen)}
            >
              Columns
            </Button>

            {columnChooserOpen && (
              <div className="absolute right-0 mt-1 w-44 rounded-card border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-solid-md p-2 z-30 space-y-1">
                {Object.keys(visibleColumns).map((col) => (
                  <label key={col} className="flex items-center gap-2 text-xs capitalize text-[var(--text-ink)] cursor-pointer py-1 px-1 hover:bg-[var(--bg-subtle)] rounded">
                    <input
                      type="checkbox"
                      checked={visibleColumns[col]}
                      onChange={() => setVisibleColumns({ ...visibleColumns, [col]: !visibleColumns[col] })}
                      className="rounded text-[#0B1F3A]"
                    />
                    <span>{col}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-card border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-solid">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-muted)] font-semibold uppercase text-[11px]">
              {visibleColumns.business && (
                <th className="p-3 cursor-pointer select-none" onClick={() => handleSort('businessName')}>
                  <div className="flex items-center gap-1.5">
                    <span>Company & Business</span>
                    <ArrowUpDown className="w-3 h-3 text-[var(--text-subtle)]" />
                  </div>
                </th>
              )}
              {visibleColumns.contact && (
                <th className="p-3 cursor-pointer select-none" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1.5">
                    <span>Contact Person</span>
                    <ArrowUpDown className="w-3 h-3 text-[var(--text-subtle)]" />
                  </div>
                </th>
              )}
              {visibleColumns.market && <th className="p-3">Market</th>}
              {visibleColumns.stage && <th className="p-3">Stage</th>}
              {visibleColumns.priority && <th className="p-3">Priority</th>}
              {visibleColumns.value && (
                <th className="p-3 text-right cursor-pointer select-none" onClick={() => handleSort('expectedValue')}>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Value</span>
                    <ArrowUpDown className="w-3 h-3 text-[var(--text-subtle)]" />
                  </div>
                </th>
              )}
              {visibleColumns.services && <th className="p-3">Services</th>}
              {visibleColumns.owner && <th className="p-3">Owner</th>}
              {visibleColumns.date && <th className="p-3">Created</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {paginatedData.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => openLeadDrawer(lead.id)}
                className="hover:bg-[var(--bg-subtle)]/40 cursor-pointer transition-colors"
              >
                {visibleColumns.business && (
                  <td className="p-3">
                    <p className="font-bold text-[var(--text-ink)] leading-snug">{lead.businessName || lead.name}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{lead.city}, {lead.country}</p>
                  </td>
                )}
                {visibleColumns.contact && (
                  <td className="p-3">
                    <p className="font-semibold text-[var(--text-ink)]">{lead.name}</p>
                    <p className="text-[10px] text-[var(--text-subtle)]">{lead.phone || lead.email}</p>
                  </td>
                )}
                {visibleColumns.market && (
                  <td className="p-3">
                    <span className="font-semibold">{lead.market === 'UAE' ? '🇦🇪 UAE' : '🇮🇳 India'}</span>
                  </td>
                )}
                {visibleColumns.stage && (
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={lead.stage}
                      onChange={(e) => updateLead(lead.id, { stage: e.target.value }, `Inline stage update: ${e.target.value}`)}
                      className="text-xs rounded border border-[var(--border-subtle)] px-2 py-1 bg-[var(--bg-surface)] text-[var(--text-ink)] focus:outline-none"
                    >
                      {PIPELINE_STAGES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </td>
                )}
                {visibleColumns.priority && (
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={lead.priority}
                      onChange={(e) => updateLead(lead.id, { priority: e.target.value })}
                      className="text-xs rounded border border-[var(--border-subtle)] px-2 py-1 bg-[var(--bg-surface)] text-[var(--text-ink)] focus:outline-none"
                    >
                      {PRIORITIES.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </td>
                )}
                {visibleColumns.value && (
                  <td className="p-3 text-right font-extrabold text-[#0B1F3A] dark:text-[var(--accent-color)]">
                    {formatCurrency(lead.expectedValue, lead.currency)}
                  </td>
                )}
                {visibleColumns.services && (
                  <td className="p-3 text-[11px] text-[var(--text-muted)] truncate max-w-[180px]">
                    {(lead.services || []).join(', ')}
                  </td>
                )}
                {visibleColumns.owner && (
                  <td className="p-3 text-[var(--text-muted)]">{lead.owner || '—'}</td>
                )}
                {visibleColumns.date && (
                  <td className="p-3 text-[11px] text-[var(--text-subtle)]">{formatDate(lead.createdAt)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] px-1">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* CSV Import Mapping Modal */}
      <Modal
        isOpen={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        title="Map CSV Columns to CRM Fields"
        subtitle={`Detected ${csvRows.length} rows in uploaded CSV`}
        maxWidth="max-w-lg"
      >
        <div className="space-y-3.5 text-xs">
          <p className="text-[var(--text-muted)]">
            Match the columns from your uploaded CSV to the corresponding CRM prospect fields:
          </p>

          <div className="space-y-2">
            {[
              { field: 'businessName', label: 'Company / Business Name' },
              { field: 'name', label: 'Contact Person Name' },
              { field: 'phone', label: 'Phone Number' },
              { field: 'email', label: 'Email Address' },
              { field: 'market', label: 'Market (India / UAE)' },
              { field: 'expectedValue', label: 'Deal Value' },
            ].map((item) => (
              <div key={item.field} className="flex items-center justify-between gap-3">
                <span className="font-semibold text-[var(--text-ink)] w-1/2">{item.label}</span>
                <select
                  value={columnMapping[item.field] || ''}
                  onChange={(e) => setColumnMapping({ ...columnMapping, [item.field]: e.target.value })}
                  className="w-1/2 rounded border border-[var(--border-subtle)] p-1.5 bg-[var(--bg-surface)] text-[var(--text-ink)]"
                >
                  <option value="">-- Choose Column --</option>
                  {csvHeaders.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-button bg-[#FDF4E7] border border-[#FBE3BF] flex items-center gap-2 text-[#D98A1B]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Automatic phone & email deduplication will be applied upon import.</span>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
            <Button variant="secondary" size="sm" onClick={() => setCsvModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleImportSubmit}>
              Execute Import
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
