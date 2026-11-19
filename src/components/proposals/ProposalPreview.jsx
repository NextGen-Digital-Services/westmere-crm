import React from 'react';
import { useAppStore } from '../../lib/store';
import { formatCurrency, formatDate } from '../../lib/formatters';

export function ProposalPreview({ proposal, elementId = 'proposal-print-area' }) {
  const branding = useAppStore((s) => s.settings.branding);

  if (!proposal) return null;

  return (
    <div
      id={elementId}
      className="p-8 bg-white text-[#101828] font-sans rounded-card border border-[#E2DBD0] shadow-solid max-w-3xl mx-auto space-y-6"
    >
      {/* Header with Agency Branding & Logo */}
      <div className="flex items-start justify-between border-b-2 border-[#0B1F3A] pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-[#0B1F3A] flex items-center justify-center p-2 text-white shrink-0">
              {branding.logo ? (
                <img src={branding.logo} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
                  <path d="M8 9L12 23L16 13L20 23L24 9" stroke="#C9A24B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#0B1F3A] tracking-tight">{branding.companyName}</h2>
              <p className="text-xs text-[#536471]">{branding.tagline}</p>
            </div>
          </div>
          <div className="text-[11px] text-[#536471] space-y-0.5">
            <p>{proposal.currency === 'AED' ? branding.addressUAE : branding.addressIndia}</p>
            <p>Email: {branding.companyEmail} | Tel: {branding.companyPhone}</p>
            <p>{proposal.currency === 'AED' ? `TRN: ${branding.trnNumber}` : `GSTIN: ${branding.gstNumber}`}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="inline-block px-3 py-1 bg-[#0B1F3A] text-[#C9A24B] font-extrabold text-xs tracking-wider rounded uppercase">
            Commercial Proposal
          </span>
          <p className="text-xs font-bold text-[#101828] mt-2">{proposal.proposalNumber}</p>
          <p className="text-xs text-[#536471]">Version: {proposal.version}</p>
          <p className="text-xs text-[#536471]">Date: {formatDate(proposal.createdAt)}</p>
          <p className="text-xs font-semibold text-[#C23B3B] mt-1">Valid Until: {formatDate(proposal.validityDate)}</p>
        </div>
      </div>

      {/* Prepared For Client */}
      <div className="grid grid-cols-2 gap-4 p-4 rounded-button bg-[#F5F1E8] border border-[#E2DBD0] text-xs">
        <div>
          <span className="text-[10px] font-bold text-[#536471] uppercase tracking-wider">Prepared For</span>
          <p className="text-sm font-bold text-[#0B1F3A] mt-0.5">{proposal.businessName}</p>
          <p className="text-xs text-[#101828] font-medium">{proposal.leadName}</p>
        </div>
        <div>
          <span className="text-[10px] font-bold text-[#536471] uppercase tracking-wider">Project Timeline</span>
          <p className="text-sm font-bold text-[#0B1F3A] mt-0.5">{proposal.timeline || '8–12 Weeks'}</p>
          <p className="text-xs text-[#536471]">Agile Sprint Model</p>
        </div>
      </div>

      {/* Scope Deliverables */}
      <div>
        <h3 className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider mb-2">Scope of Work & Deliverables</h3>
        <ul className="space-y-1.5 text-xs text-[#101828]">
          {(proposal.scopeItems || []).map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-[#C9A24B] font-bold">▪</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pricing Line Items Table */}
      <div>
        <h3 className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider mb-2">Commercial Investment</h3>
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-[#0B1F3A] text-[#0B1F3A] font-bold">
              <th className="py-2">Item & Description</th>
              <th className="py-2 text-center w-16">Qty</th>
              <th className="py-2 text-right w-28">Rate ({proposal.currency})</th>
              <th className="py-2 text-right w-28">Amount ({proposal.currency})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2DBD0]">
            {(proposal.items || []).map((line, idx) => (
              <tr key={idx}>
                <td className="py-2 font-medium">{line.description}</td>
                <td className="py-2 text-center">{line.quantity}</td>
                <td className="py-2 text-right">{formatCurrency(line.rate, proposal.currency)}</td>
                <td className="py-2 text-right font-bold">{formatCurrency(line.amount, proposal.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Calculation summary */}
        <div className="flex justify-end pt-3">
          <div className="w-64 space-y-1.5 text-xs">
            <div className="flex justify-between text-[#536471]">
              <span>Subtotal:</span>
              <span>{formatCurrency(proposal.subtotal, proposal.currency)}</span>
            </div>
            {proposal.discount > 0 && (
              <div className="flex justify-between text-[#1F8A5B] font-medium">
                <span>Discount:</span>
                <span>-{formatCurrency(proposal.discount, proposal.currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#536471]">
              <span>Tax ({proposal.taxRate}%):</span>
              <span>{formatCurrency(proposal.taxAmount, proposal.currency)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-[#0B1F3A] pt-2 border-t-2 border-[#0B1F3A]">
              <span>Total Investment:</span>
              <span>{formatCurrency(proposal.total, proposal.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Schedule */}
      <div>
        <h3 className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider mb-2">Payment Milestone Schedule</h3>
        <div className="rounded-button border border-[#E2DBD0] overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F5F1E8] border-b border-[#E2DBD0] text-[#536471] font-semibold">
              <tr>
                <th className="py-2 px-3">Milestone Deliverable</th>
                <th className="py-2 px-3 text-center w-20">% Tranche</th>
                <th className="py-2 px-3 text-right w-28">Amount</th>
                <th className="py-2 px-3 text-center w-24">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2DBD0]">
              {(proposal.milestones || []).map((m, idx) => (
                <tr key={idx}>
                  <td className="py-2 px-3 font-medium">{m.title}</td>
                  <td className="py-2 px-3 text-center font-bold text-[#C9A24B]">{m.percentage}%</td>
                  <td className="py-2 px-3 text-right font-semibold">{formatCurrency(m.amount, proposal.currency)}</td>
                  <td className="py-2 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FDF4E7] text-[#D98A1B]">
                      {m.status || 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Terms & Signatures */}
      <div className="pt-4 border-t border-[#E2DBD0] text-[11px] text-[#536471] space-y-4">
        <div>
          <p className="font-bold text-[#101828] mb-0.5">Commercial Terms & Warranty:</p>
          <p>{proposal.terms || '30 days invoice payment term. Includes 90 days complimentary hypercare SLA warranty post-launch.'}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 pt-4">
          <div className="border-t border-[#101828] pt-2">
            <p className="font-bold text-[#101828]">Authorized Signatory</p>
            <p className="text-[10px]">Westmere Solutions Pvt Ltd / Westmere FZ-LLC</p>
          </div>
          <div className="border-t border-[#101828] pt-2">
            <p className="font-bold text-[#101828]">Accepted & Confirmed By</p>
            <p className="text-[10px]">{proposal.businessName} (Client Sign & Stamp)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
