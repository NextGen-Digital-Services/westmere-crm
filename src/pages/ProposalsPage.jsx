import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Download,
  Eye,
  Send,
  CheckCircle2,
  Clock,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { ProposalBuilderModal } from '../components/proposals/ProposalBuilderModal';
import { ProposalPreview } from '../components/proposals/ProposalPreview';
import { exportProposalToPdf } from '../lib/pdfGenerator';
import { formatCurrency, formatDate } from '../lib/formatters';
import { showToast } from '../hooks/useToast';

export function ProposalsPage() {
  const { proposals, deleteProposal, updateProposal, sendProposal, openLeadDrawer } = useAppStore();

  const [builderOpen, setBuilderOpen] = useState(false);
  const [previewProposal, setPreviewProposal] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [downloadingId, setDownloadingId] = useState(null);

  const statuses = ['All', 'Draft', 'Sent', 'Viewed', 'Accepted', 'Rejected'];

  const filteredProposals = proposals.filter((p) => {
    if (filterStatus === 'All') return true;
    return p.status === filterStatus;
  });

  const handleDownload = async (prop) => {
    setDownloadingId(prop.id);
    try {
      // Temporarily set previewProposal to render DOM element for html2canvas
      setPreviewProposal(prop);
      setTimeout(async () => {
        await exportProposalToPdf('standalone-proposal-view', `${prop.businessName || 'Proposal'}_${prop.proposalNumber}.pdf`);
        setDownloadingId(null);
        showToast({ type: 'success', title: 'PDF Exported', message: `${prop.proposalNumber} downloaded.` });
      }, 300);
    } catch (e) {
      setDownloadingId(null);
      showToast({ type: 'danger', title: 'Export Failed', message: e.message });
    }
  };

  const handleMarkAccepted = (prop) => {
    updateProposal(prop.id, { status: 'Accepted' });
    showToast({ type: 'success', title: 'Proposal Accepted!', message: 'Deal terms signed off by client.' });
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-ink)] tracking-tight">Commercial Proposals</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Deliver bespoke digital engineering proposals with GST / VAT tax toggles, milestone tranches, and PDF export.
          </p>
        </div>

        <Button variant="gold" size="sm" icon={Plus} onClick={() => setBuilderOpen(true)}>
          Create Proposal
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border-subtle)] pb-2 text-xs">
        {statuses.map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-button font-medium transition-colors ${
              filterStatus === st
                ? 'bg-[#0B1F3A] text-white dark:bg-[var(--accent-color)] dark:text-[#0B1F3A] font-bold'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:border-[#0B1F3A]'
            }`}
          >
            {st} {st !== 'All' && `(${proposals.filter((p) => p.status === st).length})`}
          </button>
        ))}
      </div>

      {/* Proposals List */}
      <div className="space-y-3">
        {filteredProposals.length === 0 ? (
          <Card className="p-8 text-center text-xs text-[var(--text-muted)]">
            No proposals found in this category. Click "Create Proposal" to draft your next client scope.
          </Card>
        ) : (
          filteredProposals.map((prop) => (
            <Card key={prop.id} className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#0B1F3A] text-[#C9A24B] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[var(--text-ink)]">{prop.proposalNumber}</span>
                      <span className="text-[10px] text-[var(--text-subtle)] font-medium">({prop.version})</span>
                      <Badge
                        variant={
                          prop.status === 'Accepted'
                            ? 'success'
                            : prop.status === 'Sent'
                            ? 'info'
                            : prop.status === 'Rejected'
                            ? 'danger'
                            : 'warning'
                        }
                        size="sm"
                      >
                        {prop.status}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-bold text-[var(--text-ink)] mt-0.5">{prop.title}</h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-extrabold text-[#0B1F3A] dark:text-[var(--accent-color)]">
                    {formatCurrency(prop.total, prop.currency)}
                  </span>
                  <p className="text-[10px] text-[var(--text-subtle)]">Valid till {formatDate(prop.validityDate)}</p>
                </div>
              </div>

              {/* Client & Scope summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-[var(--text-subtle)] uppercase">Client Prospect</span>
                  <p className="font-semibold text-[var(--text-ink)] mt-0.5">{prop.businessName || '—'}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">{prop.leadName}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[var(--text-subtle)] uppercase">Milestones Tranches</span>
                  <p className="font-semibold text-[var(--text-ink)] mt-0.5">
                    {prop.milestones?.length || 5} Milestone Deliverables
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">30% Advance signing</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[var(--text-subtle)] uppercase">Tax & Compliance</span>
                  <p className="font-semibold text-[var(--text-ink)] mt-0.5">
                    {prop.taxRate > 0 ? `${prop.currency === 'AED' ? 'VAT' : 'GST'} ${prop.taxRate}% Included` : 'Zero Tax'}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">Subtotal: {formatCurrency(prop.subtotal, prop.currency)}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border-subtle)]">
                {prop.leadId ? (
                  <button
                    type="button"
                    onClick={() => openLeadDrawer(prop.leadId)}
                    className="text-xs font-semibold text-[#0B1F3A] dark:text-[var(--accent-color)] hover:underline"
                  >
                    View Lead File →
                  </button>
                ) : <span />}

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Eye}
                    onClick={() => setPreviewProposal(prop)}
                  >
                    View Preview
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    icon={Download}
                    loading={downloadingId === prop.id}
                    onClick={() => handleDownload(prop)}
                  >
                    PDF
                  </Button>

                  {prop.status !== 'Sent' && prop.status !== 'Accepted' && (
                    <Button
                      variant="gold"
                      size="sm"
                      icon={Send}
                      onClick={() => {
                        sendProposal(prop.id);
                        showToast({ type: 'success', title: 'Proposal Sent', message: 'Lead moved to Proposal Sent stage.' });
                      }}
                    >
                      Mark as Sent
                    </Button>
                  )}

                  {prop.status === 'Sent' && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={CheckCircle2}
                      onClick={() => handleMarkAccepted(prop)}
                    >
                      Mark Accepted
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => {
                      deleteProposal(prop.id);
                      showToast({ type: 'warning', title: 'Proposal Removed', message: prop.proposalNumber });
                    }}
                    className="text-[#C23B3B]"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Proposal Builder Modal */}
      <ProposalBuilderModal
        isOpen={builderOpen}
        onClose={() => setBuilderOpen(false)}
      />

      {/* Full Preview Modal */}
      {previewProposal && (
        <Modal
          isOpen={Boolean(previewProposal)}
          onClose={() => setPreviewProposal(null)}
          title={`Proposal: ${previewProposal.proposalNumber}`}
          subtitle="Ready to print or export as high-resolution PDF"
          maxWidth="max-w-4xl"
        >
          <div className="space-y-4">
            <div className="flex justify-end gap-2 pb-2 border-b border-[var(--border-subtle)]">
              <Button
                variant="primary"
                size="sm"
                icon={Download}
                onClick={() => handleDownload(previewProposal)}
              >
                Download PDF
              </Button>
            </div>
            <div className="max-h-[75vh] overflow-y-auto p-2 bg-[#F5F1E8] rounded-card">
              <ProposalPreview proposal={previewProposal} elementId="standalone-proposal-view" />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
