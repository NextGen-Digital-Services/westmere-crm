import React, { useState } from 'react';
import { useAppStore } from '../../lib/store';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { ProposalPreview } from './ProposalPreview';
import { exportProposalToPdf } from '../../lib/pdfGenerator';
import { showToast } from '../../hooks/useToast';
import { Plus, Trash2, Download, Eye, Send } from 'lucide-react';

export function ProposalBuilderModal({ isOpen, onClose }) {
  const { leads, addProposal, sendProposal } = useAppStore();

  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || '');
  const [title, setTitle] = useState('Enterprise Digital Transformation & Web Portal');
  const [version, setVersion] = useState('v1.0');
  const [validityDate, setValidityDate] = useState('2026-12-15');
  const [timeline, setTimeline] = useState('10 Weeks');
  const [applyTax, setApplyTax] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || leads[0];
  const currency = selectedLead?.currency || 'INR';
  const taxRate = currency === 'AED' ? 5 : 18;

  // Scope bullets
  const [scopeItems, setScopeItems] = useState([
    'High-performance Next.js / React interactive portal with responsive typography',
    'Custom microservices backend with secure role-based authorization',
    'Automated CRM integration, notification engine & WhatsApp dispatch API',
    'Full QA testing, 99.9% uptime SLA deployment & 90-day post-launch hypercare',
  ]);

  // Pricing line items
  const [items, setItems] = useState([
    { id: '1', description: 'Core Application UI/UX Design System & Prototyping', quantity: 1, rate: 250000, amount: 250000 },
    { id: '2', description: 'Bespoke Frontend Architecture & Component Engineering', quantity: 1, rate: 350000, amount: 350000 },
    { id: '3', description: 'Backend Microservices, Database Schema & API Connector', quantity: 1, rate: 250000, amount: 250000 },
  ]);

  // Default 30/20/20/20/10 milestone schedule
  const [milestones, setMilestones] = useState([
    { step: 1, title: 'Contract Signing & Architecture Blueprint', percentage: 30, amount: 255000, status: 'Pending' },
    { step: 2, title: 'UI/UX Design Sign-Off & Database Architecture', percentage: 20, amount: 170000, status: 'Pending' },
    { step: 3, title: 'Alpha Release & Core Workflow Demonstration', percentage: 20, amount: 170000, status: 'Pending' },
    { step: 4, title: 'Beta Release & External API Integrations', percentage: 20, amount: 170000, status: 'Pending' },
    { step: 5, title: 'UAT Sign-Off & Production Launch Handover', percentage: 10, amount: 85000, status: 'Pending' },
  ]);

  // Calculations
  const subtotal = items.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const discount = 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const taxAmount = applyTax ? Math.round(taxableAmount * (taxRate / 100)) : 0;
  const total = taxableAmount + taxAmount;

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: String(Date.now()), description: 'Additional Engineering Deliverable', quantity: 1, rate: 100000, amount: 100000 },
    ]);
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id, field, value) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.amount = (Number(updated.quantity) || 0) * (Number(updated.rate) || 0);
        }
        return updated;
      })
    );
  };

  const proposalData = {
    leadId: selectedLead?.id,
    leadName: selectedLead?.name,
    businessName: selectedLead?.businessName,
    proposalNumber: `WM-PROP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    title,
    version,
    validityDate,
    timeline,
    currency,
    subtotal,
    discount,
    taxRate: applyTax ? taxRate : 0,
    taxAmount,
    total,
    scopeItems,
    items,
    milestones,
    createdAt: new Date().toISOString(),
  };

  const handleSaveDraft = () => {
    const created = addProposal(proposalData);
    showToast({ type: 'success', title: 'Proposal Saved', message: `Draft ${created.proposalNumber} created.` });
    onClose();
  };

  const handleSendProposal = () => {
    const created = addProposal(proposalData);
    sendProposal(created.id);
    showToast({
      type: 'success',
      title: 'Proposal Dispatched',
      message: `${created.proposalNumber} sent! Lead stage moved to "Proposal Sent".`,
    });
    onClose();
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      await exportProposalToPdf('modal-proposal-preview', `${selectedLead?.businessName || 'Westmere'}_Proposal.pdf`);
      showToast({ type: 'success', title: 'PDF Exported', message: 'Proposal PDF downloaded successfully!' });
    } catch (e) {
      showToast({ type: 'danger', title: 'Export Failed', message: e.message });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={previewMode ? 'Client Proposal Preview' : 'Proposal Builder'}
      subtitle={`Configure commercial scope, line items, and milestones for ${selectedLead?.businessName || 'Client'}`}
      maxWidth={previewMode ? 'max-w-4xl' : 'max-w-3xl'}
    >
      <div className="space-y-4">
        {/* Toggle between Edit and Preview */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex gap-2">
            <Button
              variant={!previewMode ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode(false)}
            >
              Editor
            </Button>
            <Button
              variant={previewMode ? 'primary' : 'outline'}
              size="sm"
              icon={Eye}
              onClick={() => setPreviewMode(true)}
            >
              Live Branded Preview
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              loading={isExporting}
              onClick={handleExportPdf}
            >
              Download PDF
            </Button>
            <Button variant="gold" size="sm" icon={Send} onClick={handleSendProposal}>
              Mark as Sent
            </Button>
          </div>
        </div>

        {/* Preview Mode */}
        {previewMode ? (
          <div className="max-h-[70vh] overflow-y-auto p-2 bg-[#F5F1E8] rounded-card">
            <ProposalPreview proposal={proposalData} elementId="modal-proposal-preview" />
          </div>
        ) : (
          /* Editor Mode */
          <div className="max-h-[65vh] overflow-y-auto space-y-4 pr-1 text-xs">
            {/* Header Form */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-ink)] mb-1">Target Prospect</label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full text-xs rounded-button border border-[var(--border-subtle)] p-2 bg-[var(--bg-surface)] text-[var(--text-ink)] focus:outline-none"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.businessName || l.name} ({l.market})
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Proposal Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Input
                label="Timeline Sprints"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
              />

              <Input
                label="Version"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
              />

              <Input
                label="Validity Date"
                type="date"
                value={validityDate}
                onChange={(e) => setValidityDate(e.target.value)}
              />

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="taxToggle"
                  checked={applyTax}
                  onChange={(e) => setApplyTax(e.target.checked)}
                  className="rounded text-[#0B1F3A] focus:ring-[#0B1F3A]"
                />
                <label htmlFor="taxToggle" className="font-semibold text-[var(--text-ink)] cursor-pointer">
                  Apply {currency === 'AED' ? 'UAE VAT (5%)' : 'Indian GST (18%)'}
                </label>
              </div>
            </div>

            {/* Line items table */}
            <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-[var(--text-ink)]">Price Line Items</h4>
                <Button variant="outline" size="sm" icon={Plus} onClick={handleAddItem}>
                  Add Row
                </Button>
              </div>

              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                      placeholder="Item description..."
                      className="flex-1 text-xs rounded-button border border-[var(--border-subtle)] p-2 bg-[var(--bg-surface)] text-[var(--text-ink)] focus:outline-none"
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)}
                      placeholder="Qty"
                      className="w-16 text-xs text-center rounded-button border border-[var(--border-subtle)] p-2 bg-[var(--bg-surface)] text-[var(--text-ink)] focus:outline-none"
                    />
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleUpdateItem(item.id, 'rate', e.target.value)}
                      placeholder="Rate"
                      className="w-28 text-xs text-right rounded-button border border-[var(--border-subtle)] p-2 bg-[var(--bg-surface)] text-[var(--text-ink)] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-[var(--text-muted)] hover:text-[#C23B3B]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Total summary chip */}
            <div className="p-3 rounded-card bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-between font-bold">
              <span>Grand Total:</span>
              <span className="text-sm text-[#0B1F3A] dark:text-[var(--accent-color)]">
                {currency} {total.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSaveDraft}>
            Save Draft
          </Button>
        </div>
      </div>
    </Modal>
  );
}
