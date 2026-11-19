import React, { useState } from 'react';
import { useAppStore } from '../../lib/store';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { MultiSelect } from '../ui/MultiSelect';
import { Button } from '../ui/Button';
import { SOURCES, SERVICES, MARKETS, PRIORITIES } from '../../lib/constants';
import { showToast } from '../../hooks/useToast';
import { AlertTriangle } from 'lucide-react';

export function LeadModal({ isOpen, onClose }) {
  const { addLead, leads } = useAppStore();

  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    contactPersonRole: 'Managing Director',
    phone: '',
    email: '',
    market: 'India',
    city: 'Mumbai',
    country: 'India',
    currency: 'INR',
    source: 'Inbound Website',
    services: ['Website Development'],
    priority: 'Warm',
    expectedValue: '650000',
    expectedCloseDate: '',
    timelineUrgency: 'Moderate (within 45 days)',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [duplicateWarning, setDuplicateWarning] = useState(null);

  const handleMarketChange = (marketId) => {
    const market = MARKETS.find((m) => m.id === marketId);
    setFormData((prev) => ({
      ...prev,
      market: marketId,
      country: marketId === 'UAE' ? 'UAE' : 'India',
      city: marketId === 'UAE' ? 'Dubai' : 'Mumbai',
      currency: market?.currency || 'INR',
      expectedValue: marketId === 'UAE' ? '45000' : '650000',
    }));
  };

  const checkDuplicates = (phone, email) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanPhone && !cleanEmail) {
      setDuplicateWarning(null);
      return;
    }

    const found = leads.find((l) => {
      if (cleanEmail && l.email && l.email.trim().toLowerCase() === cleanEmail) return true;
      if (cleanPhone && l.phone && l.phone.replace(/[^0-9]/g, '') === cleanPhone) return true;
      return false;
    });

    if (found) {
      setDuplicateWarning(`Potential duplicate detected: ${found.businessName || found.name} (${found.email || found.phone})`);
    } else {
      setDuplicateWarning(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Contact person name is required';
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = addLead(formData);
    if (result.success) {
      showToast({
        type: 'success',
        title: 'Prospect Created',
        message: `${formData.businessName} successfully added to pipeline.`,
      });
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Prospect"
      subtitle="Add a new lead to the Westmere agency pipeline"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {duplicateWarning && (
          <div className="flex items-center gap-2 p-3 rounded-button bg-[#FDF4E7] border border-[#FBE3BF] text-xs text-[#D98A1B]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{duplicateWarning}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Business / Client Name *"
            placeholder="e.g. Al-Nuaimi Luxury Holdings"
            value={formData.businessName}
            error={errors.businessName}
            onChange={(e) => {
              setFormData({ ...formData, businessName: e.target.value });
              if (errors.businessName) setErrors({ ...errors, businessName: null });
            }}
          />

          <Input
            label="Contact Person Name *"
            placeholder="e.g. Rashid Al-Nuaimi"
            value={formData.name}
            error={errors.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: null });
            }}
          />

          <Input
            label="Phone Number (with Country Code) *"
            placeholder="e.g. +971501234890 or +919820123456"
            value={formData.phone}
            error={errors.phone}
            onChange={(e) => {
              setFormData({ ...formData, phone: e.target.value });
              checkDuplicates(e.target.value, formData.email);
              if (errors.phone) setErrors({ ...errors, phone: null });
            }}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="rashid@alnuaimi.ae"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              checkDuplicates(formData.phone, e.target.value);
            }}
          />

          <Select
            label="Target Market"
            options={MARKETS.map((m) => ({ value: m.id, label: `${m.flag} ${m.name} (${m.currency})` }))}
            value={formData.market}
            onChange={(e) => handleMarketChange(e.target.value)}
          />

          <Input
            label="City"
            placeholder="e.g. Dubai or Mumbai"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />

          <Select
            label="Acquisition Channel / Source"
            options={SOURCES}
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          />

          <Select
            label="Lead Priority"
            options={PRIORITIES.map((p) => p.id)}
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          />

          <div className="col-span-1 sm:col-span-2">
            <MultiSelect
              label="Services of Interest"
              options={SERVICES}
              value={formData.services}
              onChange={(services) => setFormData({ ...formData, services })}
            />
          </div>

          <Input
            label={`Expected Deal Value (${formData.currency})`}
            type="number"
            placeholder="e.g. 850000"
            value={formData.expectedValue}
            onChange={(e) => setFormData({ ...formData, expectedValue: e.target.value })}
          />

          <Input
            label="Expected Close Date"
            type="date"
            value={formData.expectedCloseDate}
            onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
          />

          <div className="col-span-1 sm:col-span-2">
            <label className="block text-xs font-semibold text-[var(--text-ink)] mb-1.5">
              Initial Requirements & Context
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Outline business problem, current tech stack, or inquiry notes..."
              className="w-full text-xs rounded-button border border-[var(--border-subtle)] p-2.5 bg-[var(--bg-surface)] text-[var(--text-ink)] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Create Prospect
          </Button>
        </div>
      </form>
    </Modal>
  );
}
