import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { LOSS_REASONS } from '../../lib/constants';

export function StageValidationModal({
  isOpen,
  onClose,
  lead,
  targetStage,
  onConfirm,
}) {
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (lead) {
      setData({
        budgetVerified: lead.budgetVerified || false,
        expectedValue: lead.expectedValue || '',
        decisionMakerVerified: lead.decisionMakerVerified || false,
        timelineUrgency: lead.timelineUrgency || 'Immediate (within 30 days)',
        // Won fields
        advanceReceivedAmount: lead.advanceReceivedAmount || Math.round((lead.expectedValue || 500000) * 0.3),
        advanceReceivedDate: lead.advanceReceivedDate || new Date().toISOString().split('T')[0],
        advancePaymentMode: lead.advancePaymentMode || 'Bank Wire Transfer',
        projectKickoffDate: lead.projectKickoffDate || '',
        // Lost fields
        lossReason: lead.lossReason || LOSS_REASONS[0],
        lossNotes: lead.lossNotes || '',
      });
      setErrors({});
    }
  }, [lead, targetStage]);

  if (!lead) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (targetStage === 'qualified') {
      if (!data.budgetVerified && !data.expectedValue) {
        newErrors.budget = 'Please specify or verify budget';
      }
    } else if (targetStage === 'won') {
      if (!data.advanceReceivedAmount) newErrors.advanceReceivedAmount = 'Advance amount received is required';
      if (!data.projectKickoffDate) newErrors.projectKickoffDate = 'Project kickoff date is required';
    } else if (targetStage === 'lost') {
      if (!data.lossReason) newErrors.lossReason = 'Mandatory loss reason must be selected';
      if (!data.lossNotes.trim()) newErrors.lossNotes = 'Loss context notes are required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onConfirm(data);
    onClose();
  };

  const getTitle = () => {
    if (targetStage === 'qualified') return 'Stage Entry: Qualify Prospect';
    if (targetStage === 'won') return '🎉 Stage Entry: Mark Deal Closed WON';
    if (targetStage === 'lost') return 'Stage Entry: Mark Deal Closed LOST';
    return `Move to ${targetStage}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      subtitle={`Required milestone fields to transition "${lead.businessName || lead.name}"`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Qualified Stage Requirements */}
        {targetStage === 'qualified' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-2.5 rounded-button bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
              <input
                type="checkbox"
                id="budgetVerified"
                checked={data.budgetVerified}
                onChange={(e) => setData({ ...data, budgetVerified: e.target.checked })}
                className="rounded text-[#0B1F3A] focus:ring-[#0B1F3A] cursor-pointer"
              />
              <label htmlFor="budgetVerified" className="text-xs font-semibold text-[var(--text-ink)] cursor-pointer">
                Budget verified with client committee
              </label>
            </div>

            <Input
              label={`Estimated Project Budget (${lead.currency})`}
              type="number"
              value={data.expectedValue}
              error={errors.budget}
              onChange={(e) => setData({ ...data, expectedValue: Number(e.target.value) })}
            />

            <div className="flex items-center gap-2 p-2.5 rounded-button bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
              <input
                type="checkbox"
                id="decisionMakerVerified"
                checked={data.decisionMakerVerified}
                onChange={(e) => setData({ ...data, decisionMakerVerified: e.target.checked })}
                className="rounded text-[#0B1F3A] focus:ring-[#0B1F3A] cursor-pointer"
              />
              <label htmlFor="decisionMakerVerified" className="text-xs font-semibold text-[var(--text-ink)] cursor-pointer">
                Decision-maker (MD / Founder / CTO) confirmed
              </label>
            </div>

            <Select
              label="Timeline Urgency"
              options={['Immediate (within 30 days)', 'High (30-60 days)', 'Moderate (Q1/Q2)', 'Flexible']}
              value={data.timelineUrgency}
              onChange={(e) => setData({ ...data, timelineUrgency: e.target.value })}
            />
          </div>
        )}

        {/* Won Stage Requirements */}
        {targetStage === 'won' && (
          <div className="space-y-3">
            <Input
              label={`Advance Amount Received (${lead.currency}) *`}
              type="number"
              value={data.advanceReceivedAmount}
              error={errors.advanceReceivedAmount}
              onChange={(e) => setData({ ...data, advanceReceivedAmount: Number(e.target.value) })}
            />

            <Input
              label="Advance Payment Date"
              type="date"
              value={data.advanceReceivedDate}
              onChange={(e) => setData({ ...data, advanceReceivedDate: e.target.value })}
            />

            <Select
              label="Payment Mode / Reference"
              options={['NEFT / RTGS Wire', 'Mashreq / ENBD Wire', 'Razorpay Link', 'Stripe Payment', 'Cheque']}
              value={data.advancePaymentMode}
              onChange={(e) => setData({ ...data, advancePaymentMode: e.target.value })}
            />

            <Input
              label="Project Kickoff Workshop Date *"
              type="date"
              value={data.projectKickoffDate}
              error={errors.projectKickoffDate}
              onChange={(e) => setData({ ...data, projectKickoffDate: e.target.value })}
            />
          </div>
        )}

        {/* Lost Stage Requirements */}
        {targetStage === 'lost' && (
          <div className="space-y-3">
            <Select
              label="Mandatory Reason for Loss *"
              options={LOSS_REASONS}
              value={data.lossReason}
              error={errors.lossReason}
              onChange={(e) => setData({ ...data, lossReason: e.target.value })}
            />

            <div>
              <label className="block text-xs font-semibold text-[var(--text-ink)] mb-1.5">
                Loss Context & Learning Notes *
              </label>
              <textarea
                rows={3}
                value={data.lossNotes}
                onChange={(e) => setData({ ...data, lossNotes: e.target.value })}
                placeholder="What feedback did client give? (e.g. Budget difference, competitor chosen, scope mismatch...)"
                className="w-full text-xs rounded-button border border-[var(--border-subtle)] p-2.5 bg-[var(--bg-surface)] text-[var(--text-ink)] focus:outline-none"
              />
              {errors.lossNotes && <p className="mt-1 text-xs text-[#C23B3B]">{errors.lossNotes}</p>}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            Confirm & Transition
          </Button>
        </div>
      </form>
    </Modal>
  );
}
