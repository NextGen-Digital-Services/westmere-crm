import React, { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Palette,
  Kanban,
  Database,
  Users,
  Sun,
  Moon,
  Sparkles,
  Upload,
  Trash2,
  RotateCcw,
  Download,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Tabs } from '../components/ui/Tabs';
import { ACCENT_SWATCHES, PIPELINE_STAGES, MARKETS } from '../lib/constants';
import { showToast } from '../hooks/useToast';

export function SettingsPage() {
  const {
    settings,
    updateSettings,
    updateLogo,
    removeLogo,
    clearSampleData,
    restoreSampleData,
    exportFullBackup,
    importFullBackup,
    resetAllData,
    leads,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('branding');
  const [brandingForm, setBrandingForm] = useState({ ...settings.branding });
  const [pipelineForm, setPipelineForm] = useState({ ...settings.pipeline });
  const [sourcesList, setSourcesList] = useState([...settings.sources]);
  const [newSource, setNewSource] = useState('');

  const logoInputRef = useRef(null);
  const backupInputRef = useRef(null);

  // Logo upload handler
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast({ type: 'danger', title: 'File Too Large', message: 'Logo must be under 2 MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      updateLogo(base64);
      setBrandingForm((prev) => ({ ...prev, logo: base64 }));
      showToast({
        type: 'success',
        title: 'Logo Updated',
        message: 'Agency logo applied to sidebar, login, proposals and favicon.',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBranding = (e) => {
    e.preventDefault();
    updateSettings({ branding: brandingForm });
    showToast({ type: 'success', title: 'Branding Saved', message: 'Company settings updated successfully.' });
  };

  const handleAccentChange = (color) => {
    setBrandingForm((prev) => ({ ...prev, accentColor: color }));
    updateSettings({ branding: { ...brandingForm, accentColor: color } });
  };

  const handleExportBackup = () => {
    const jsonStr = exportFullBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Westmere_CRM_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showToast({ type: 'success', title: 'Backup Downloaded', message: 'Full CRM state JSON exported.' });
  };

  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = importFullBackup(event.target.result);
      if (result.success) {
        showToast({ type: 'success', title: 'Restore Complete', message: 'All CRM data loaded from backup.' });
      } else {
        showToast({ type: 'danger', title: 'Restore Failed', message: result.error });
      }
    };
    reader.readAsText(file);
  };

  const tabs = [
    { id: 'branding', label: 'Branding & Identity', icon: Palette },
    { id: 'pipeline', label: 'Pipeline Stages & Probabilities', icon: Kanban },
    { id: 'sources', label: 'Lead Sources' },
    { id: 'users', label: 'Users & Roles', icon: Users },
    { id: 'data', label: 'Data Management & Sample Data', icon: Database },
    { id: 'appearance', label: 'Appearance & Themes' },
  ];

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-ink)] tracking-tight">System Settings</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Configure white-label agency branding, pipeline probabilities, and operational data.
          </p>
        </div>

        {/* Dedicated link to Integrations */}
        <NavLink to="/settings/integrations">
          <Button variant="gold" size="sm" icon={Sparkles}>
            Configure Integrations & APIs →
          </Button>
        </NavLink>
      </div>

      {/* Settings Navigation Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: Branding & Logo */}
      {activeTab === 'branding' && (
        <form onSubmit={handleSaveBranding} className="space-y-5">
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-ink)] border-b border-[var(--border-subtle)] pb-2.5">
              Agency Logo & Visual Identity
            </h3>

            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Logo Preview Tile */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[var(--text-ink)]">Current Logo</span>
                <div className="w-28 h-28 rounded-card border-2 border-[var(--border-subtle)] bg-white p-3 flex items-center justify-center shadow-solid">
                  {settings.branding?.logo ? (
                    <img
                      src={settings.branding.logo}
                      alt="Brand Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <svg className="w-12 h-12 mx-auto" viewBox="0 0 32 32" fill="none">
                        <rect width="32" height="32" rx="6" fill="#0B1F3A" />
                        <path d="M8 9L12 23L16 13L20 23L24 9" stroke="#C9A24B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-[10px] text-[var(--text-muted)] font-bold mt-1 block">Default Mark</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-3 text-xs">
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Upload your agency logo (PNG, JPG, SVG or WebP, max 2 MB). The logo is instantly updated across the sidebar header, mobile bar, login portal, PDF proposals, and browser favicon.
                </p>

                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={handleLogoUpload}
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Upload}
                    onClick={() => logoInputRef.current?.click()}
                  >
                    Upload New Logo
                  </Button>

                  {settings.branding?.logo && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Trash2}
                      onClick={() => {
                        removeLogo();
                        setBrandingForm((prev) => ({ ...prev, logo: null }));
                        showToast({ type: 'info', title: 'Logo Reset', message: 'Restored default Westmere mark.' });
                      }}
                      className="text-[#C23B3B]"
                    >
                      Remove Logo
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Accent Color Picker (8 solid presets) */}
            <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
              <span className="text-xs font-semibold text-[var(--text-ink)]">
                Brand Accent Color (Solid Swatches)
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                {ACCENT_SWATCHES.map((swatch) => (
                  <button
                    key={swatch.value}
                    type="button"
                    onClick={() => handleAccentChange(swatch.value)}
                    className={`w-8 h-8 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                      brandingForm.accentColor === swatch.value ? 'ring-2 ring-offset-2 ring-[#0B1F3A] scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: swatch.value }}
                    title={swatch.name}
                  >
                    {brandingForm.accentColor === swatch.value && (
                      <CheckCircle2 className="w-4 h-4 text-white stroke-[3]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Company & Billing Info */}
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-ink)] border-b border-[var(--border-subtle)] pb-2.5">
              Corporate & Billing Details (Used in Proposals)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Company Legal Name"
                value={brandingForm.companyName}
                onChange={(e) => setBrandingForm({ ...brandingForm, companyName: e.target.value })}
                required
              />

              <Input
                label="Tagline / Positioning"
                value={brandingForm.tagline}
                onChange={(e) => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
              />

              <Input
                label="Corporate Email"
                type="email"
                value={brandingForm.companyEmail}
                onChange={(e) => setBrandingForm({ ...brandingForm, companyEmail: e.target.value })}
                required
              />

              <Input
                label="Contact Phone Numbers"
                value={brandingForm.companyPhone}
                onChange={(e) => setBrandingForm({ ...brandingForm, companyPhone: e.target.value })}
              />

              <Input
                label="India Office Address (BKC Mumbai)"
                value={brandingForm.addressIndia}
                onChange={(e) => setBrandingForm({ ...brandingForm, addressIndia: e.target.value })}
              />

              <Input
                label="UAE Office Address (Downtown Dubai)"
                value={brandingForm.addressUAE}
                onChange={(e) => setBrandingForm({ ...brandingForm, addressUAE: e.target.value })}
              />

              <Input
                label="India GSTIN (Used for GST 18% proposals)"
                value={brandingForm.gstNumber}
                onChange={(e) => setBrandingForm({ ...brandingForm, gstNumber: e.target.value })}
              />

              <Input
                label="UAE Tax Registration Number (TRN - VAT 5%)"
                value={brandingForm.trnNumber}
                onChange={(e) => setBrandingForm({ ...brandingForm, trnNumber: e.target.value })}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" size="md" type="submit">
                Save Branding & Details
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* TAB 2: Pipeline Stages & Probabilities */}
      {activeTab === 'pipeline' && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-ink)]">
                Pipeline Stages, Probabilities & Stale Alert Days
              </h3>
              <p className="text-xs text-[var(--text-muted)]">Configure weighted pipeline forecasting accuracy</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="max-w-xs">
              <Input
                label="Stale Lead Inactivity Threshold (Days)"
                type="number"
                value={pipelineForm.staleThresholdDays || 7}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPipelineForm({ ...pipelineForm, staleThresholdDays: val });
                  updateSettings({ pipeline: { ...pipelineForm, staleThresholdDays: val } });
                }}
              />
            </div>

            <div className="overflow-x-auto rounded-button border border-[var(--border-subtle)]">
              <table className="w-full text-xs text-left">
                <thead className="bg-[var(--bg-subtle)] text-[var(--text-muted)] font-semibold uppercase text-[11px]">
                  <tr>
                    <th className="p-2.5">Stage Name</th>
                    <th className="p-2.5 text-center">Color</th>
                    <th className="p-2.5 text-center w-36">Win Probability (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {PIPELINE_STAGES.map((s, idx) => (
                    <tr key={s.id}>
                      <td className="p-2.5 font-bold text-[var(--text-ink)]">{s.name}</td>
                      <td className="p-2.5 text-center">
                        <span className="w-3.5 h-3.5 rounded-full inline-block" style={{ backgroundColor: s.color }} />
                      </td>
                      <td className="p-2.5 text-center font-bold text-[#0B1F3A] dark:text-[var(--accent-color)]">
                        {s.probability}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 3: Sources */}
      {activeTab === 'sources' && (
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-ink)] border-b border-[var(--border-subtle)] pb-2.5">
            Lead Acquisition Channels
          </h3>

          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
              placeholder="e.g. Dubai Expo 2026 Booth..."
              className="flex-1 text-xs rounded-button border border-[var(--border-subtle)] p-2 bg-[var(--bg-surface)] text-[var(--text-ink)]"
            />
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (!newSource.trim()) return;
                const updated = [...sourcesList, newSource.trim()];
                setSourcesList(updated);
                updateSettings({ sources: updated });
                setNewSource('');
                showToast({ type: 'success', title: 'Source Added', message: newSource });
              }}
            >
              Add Channel
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {sourcesList.map((src, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-button border border-[var(--border-subtle)] bg-[var(--bg-main)]">
                <span className="font-semibold text-[var(--text-ink)]">{src}</span>
                <button
                  type="button"
                  onClick={() => {
                    const updated = sourcesList.filter((s) => s !== src);
                    setSourcesList(updated);
                    updateSettings({ sources: updated });
                  }}
                  className="text-[var(--text-subtle)] hover:text-[#C23B3B]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 4: Users */}
      {activeTab === 'users' && (
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-ink)] border-b border-[var(--border-subtle)] pb-2.5">
            Internal Sales Representatives & Permissions
          </h3>
          <div className="space-y-2 text-xs">
            {settings.users.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-3 rounded-button border border-[var(--border-subtle)] bg-[var(--bg-card)]">
                <div>
                  <p className="font-bold text-[var(--text-ink)]">{u.name}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">{u.email}</p>
                </div>
                <Badge variant={u.role === 'Admin' ? 'navy' : 'gold'}>{u.role}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 5: Data Management */}
      {activeTab === 'data' && (
        <div className="space-y-4">
          <Card className="space-y-4 border-l-4 border-l-[#C9A24B]">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-ink)]">Sample Data Controls</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Seed or clear the 40 realistic sample prospects (India + UAE businesses) to test workflows.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                icon={Trash2}
                onClick={() => {
                  clearSampleData();
                  showToast({ type: 'warning', title: 'Sample Data Cleared', message: 'Removed all sample flagged prospects.' });
                }}
              >
                Clear Sample Data
              </Button>

              <Button
                variant="gold"
                size="sm"
                icon={RotateCcw}
                onClick={() => {
                  restoreSampleData();
                  showToast({ type: 'success', title: 'Sample Data Restored', message: 'Restored 40 realistic prospects.' });
                }}
              >
                Restore 40 Sample Prospects
              </Button>
            </div>
          </Card>

          <Card className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-ink)]">Full CRM State Backup & Migration</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Export all prospects, proposals, templates, and settings as a standalone JSON backup.
              </p>
            </div>

            <input
              type="file"
              ref={backupInputRef}
              onChange={handleImportBackup}
              accept=".json"
              className="hidden"
            />

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm" icon={Download} onClick={handleExportBackup}>
                Export Full JSON Backup
              </Button>

              <Button variant="outline" size="sm" icon={Upload} onClick={() => backupInputRef.current?.click()}>
                Import JSON Backup
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  if (window.confirm('Reset all CRM data back to initial defaults?')) {
                    resetAllData();
                    showToast({ type: 'info', title: 'CRM Reset', message: 'Reset to factory seed state.' });
                  }
                }}
              >
                Reset Factory State
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 6: Appearance */}
      {activeTab === 'appearance' && (
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-ink)] border-b border-[var(--border-subtle)] pb-2.5">
            Display & Visual Preferences
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-button border border-[var(--border-subtle)]">
              <div>
                <p className="font-bold text-[var(--text-ink)]">Theme Mode</p>
                <p className="text-[11px] text-[var(--text-muted)]">Solid flat light & dark themes</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={settings.appearance?.theme === 'light' ? 'primary' : 'outline'}
                  size="sm"
                  icon={Sun}
                  onClick={() => updateSettings({ appearance: { ...settings.appearance, theme: 'light' } })}
                >
                  Light
                </Button>
                <Button
                  variant={settings.appearance?.theme === 'dark' ? 'primary' : 'outline'}
                  size="sm"
                  icon={Moon}
                  onClick={() => updateSettings({ appearance: { ...settings.appearance, theme: 'dark' } })}
                >
                  Dark
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-button border border-[var(--border-subtle)]">
              <div>
                <p className="font-bold text-[var(--text-ink)]">Reduced Motion</p>
                <p className="text-[11px] text-[var(--text-muted)]">Disable spring animations and confetti particles</p>
              </div>
              <input
                type="checkbox"
                checked={settings.appearance?.reducedMotion || false}
                onChange={(e) =>
                  updateSettings({
                    appearance: { ...settings.appearance, reducedMotion: e.target.checked },
                  })
                }
                className="rounded text-[#0B1F3A]"
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
