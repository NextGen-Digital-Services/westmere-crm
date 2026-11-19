import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Video,
  Clock,
  Plus,
  ExternalLink,
  Download,
  MapPin,
  Users,
  Edit2,
  Trash2,
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { formatDate } from '../lib/formatters';
import { showToast } from '../hooks/useToast';
import { googleMeetAdapter } from '../services/integrations/googleMeet';

export function MeetingsPage() {
  const { meetings, addMeeting, updateMeeting, deleteMeeting, leads, openLeadDrawer } = useAppStore();

  const [view, setView] = useState('agenda'); // 'agenda' | 'week' | 'month'
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);

  const [form, setForm] = useState({
    leadId: leads[0]?.id || '',
    title: '',
    dateTime: '2026-11-20T10:30',
    durationMinutes: 45,
    mode: 'Google Meet',
    link: 'https://meet.google.com/wm-demo-call',
    location: '',
    notes: '',
  });

  const handleGenerateMeet = async () => {
    const res = await googleMeetAdapter.send({ title: form.title, dateTime: form.dateTime });
    setForm((prev) => ({ ...prev, link: res.meetLink }));
    showToast({ type: 'success', title: 'Google Meet Created', message: res.meetLink });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const selectedLead = leads.find((l) => l.id === form.leadId);

    const payload = {
      ...form,
      leadName: selectedLead?.name || 'Prospect',
      businessName: selectedLead?.businessName || '',
    };

    if (editingMeeting) {
      updateMeeting(editingMeeting.id, payload);
      showToast({ type: 'success', title: 'Meeting Updated', message: form.title });
    } else {
      addMeeting(payload);
      showToast({ type: 'success', title: 'Meeting Scheduled', message: form.title });
    }

    setModalOpen(false);
    setEditingMeeting(null);
  };

  // Generate .ics calendar download
  const handleDownloadIcs = (meeting) => {
    const start = new Date(meeting.dateTime).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const end = new Date(new Date(meeting.dateTime).getTime() + (meeting.durationMinutes || 45) * 60000)
      .toISOString()
      .replace(/[-:]/g, '')
      .split('.')[0] + 'Z';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Westmere Solutions//Sales CRM//EN',
      'BEGIN:VEVENT',
      `UID:wm-meet-${meeting.id}@westmere.io`,
      `DTSTAMP:${start}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${meeting.title}`,
      `DESCRIPTION:${meeting.notes || ''}\\nMeeting Link: ${meeting.link || ''}`,
      `LOCATION:${meeting.location || meeting.link || 'Google Meet'}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${meeting.businessName || 'Westmere'}_Meeting.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast({ type: 'success', title: 'Calendar Invite Ready', message: 'Downloaded .ics file.' });
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-ink)] tracking-tight">Discovery Meetings & Demos</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Coordinate video walkthroughs and in-person consultations with prospects in India and Dubai.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex rounded-button border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-0.5 text-xs">
            {['agenda', 'week', 'month'].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-button capitalize font-medium transition-colors ${
                  view === v
                    ? 'bg-[#0B1F3A] text-white dark:bg-[var(--accent-color)] dark:text-[#0B1F3A]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-ink)]'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <Button
            variant="gold"
            size="sm"
            icon={Plus}
            onClick={() => {
              setEditingMeeting(null);
              setForm({
                leadId: leads[0]?.id || '',
                title: 'Product Discovery & Architecture Demo',
                dateTime: '2026-11-20T10:30',
                durationMinutes: 45,
                mode: 'Google Meet',
                link: 'https://meet.google.com/wm-demo-call',
                location: '',
                notes: '',
              });
              setModalOpen(true);
            }}
          >
            Schedule Meeting
          </Button>
        </div>
      </div>

      {/* Agenda View */}
      {view === 'agenda' && (
        <div className="space-y-3">
          {meetings.length === 0 ? (
            <Card className="p-8 text-center text-xs text-[var(--text-muted)]">
              No meetings scheduled yet. Click "Schedule Meeting" to book a demo.
            </Card>
          ) : (
            meetings.map((meeting) => (
              <Card key={meeting.id} className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-[#D98A1B]/15 text-[#D98A1B] flex items-center justify-center font-bold shrink-0">
                      <CalendarIcon className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-[var(--text-ink)]">{meeting.title}</h3>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                        Client: <span className="font-semibold text-[var(--text-ink)]">{meeting.businessName || meeting.leadName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={meeting.mode === 'In Person' ? 'navy' : 'warning'}>
                      {meeting.mode}
                    </Badge>
                    <span className="text-xs font-semibold text-[var(--text-ink)]">
                      {formatDate(meeting.dateTime, 'EEE, MMM d, yyyy • h:mm a')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-[var(--text-subtle)] uppercase">Meeting Link / Location</span>
                    {meeting.link ? (
                      <p className="mt-0.5">
                        <a
                          href={meeting.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#2F6FB5] hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>{meeting.link}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </p>
                    ) : (
                      <p className="text-[var(--text-ink)] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        <span>{meeting.location || 'Client Office'}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[var(--text-subtle)] uppercase">Agenda & Key Focus</span>
                    <p className="text-[var(--text-muted)] mt-0.5 leading-relaxed text-[11px]">
                      {meeting.notes || 'Requirements gathering and commercial presentation.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={() => openLeadDrawer(meeting.leadId)}
                    className="text-xs font-semibold text-[#0B1F3A] dark:text-[var(--accent-color)] hover:underline"
                  >
                    View Prospect File →
                  </button>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Download}
                      onClick={() => handleDownloadIcs(meeting)}
                    >
                      .ICS Invite
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Edit2}
                      onClick={() => {
                        setEditingMeeting(meeting);
                        setForm({ ...meeting });
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={() => {
                        deleteMeeting(meeting.id);
                        showToast({ type: 'warning', title: 'Meeting Cancelled', message: meeting.title });
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
      )}

      {/* Week & Month placeholder visual representation */}
      {(view === 'week' || view === 'month') && (
        <Card className="p-6 text-center space-y-3">
          <CalendarIcon className="w-8 h-8 mx-auto text-[#0B1F3A] dark:text-[var(--accent-color)]" />
          <h3 className="text-sm font-bold text-[var(--text-ink)]">
            {view === 'week' ? 'Week View (Nov 16 – Nov 22, 2026)' : 'Month View (November 2026)'}
          </h3>
          <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
            {meetings.length} client meetings scheduled across India & UAE timezones. All sessions are synced with Google Meet and downloadable as .ics invites.
          </p>
          <div className="pt-2">
            <Button variant="outline" size="sm" onClick={() => setView('agenda')}>
              Back to Agenda List
            </Button>
          </div>
        </Card>
      )}

      {/* Schedule / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingMeeting ? 'Reschedule Meeting' : 'Schedule Discovery Meeting / Demo'}
        subtitle="Book a video consultation or onsite meeting with client"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSave} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-ink)] mb-1">Target Prospect</label>
            <select
              value={form.leadId}
              onChange={(e) => setForm({ ...form, leadId: e.target.value })}
              className="w-full text-xs rounded-button border border-[var(--border-subtle)] p-2 bg-[var(--bg-surface)] text-[var(--text-ink)] focus:outline-none"
            >
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.businessName || l.name} ({l.city}, {l.market})
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Meeting Subject *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Bespoke ERP Architecture Demo"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date & Time *"
              type="datetime-local"
              value={form.dateTime}
              onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
              required
            />
            <Select
              label="Duration"
              options={[{ value: 30, label: '30 Minutes' }, { value: 45, label: '45 Minutes' }, { value: 60, label: '60 Minutes' }]}
              value={form.durationMinutes}
              onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
            />
          </div>

          <Select
            label="Meeting Mode"
            options={['Google Meet', 'Zoom', 'In Person', 'Phone Call']}
            value={form.mode}
            onChange={(e) => setForm({ ...form, mode: e.target.value })}
          />

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[var(--text-ink)]">Google Meet Link</label>
              <button
                type="button"
                onClick={handleGenerateMeet}
                className="text-[11px] font-bold text-[#D98A1B] hover:underline"
              >
                + Auto-Generate
              </button>
            </div>
            <Input
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="https://meet.google.com/..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-ink)] mb-1">Internal Notes & Prep</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Case study to present, attendees, client objectives..."
              className="w-full text-xs rounded-button border border-[var(--border-subtle)] p-2 bg-[var(--bg-surface)] text-[var(--text-ink)] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingMeeting ? 'Save Changes' : 'Confirm Meeting'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
