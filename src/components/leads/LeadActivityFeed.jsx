import React, { useState } from 'react';
import { MessageSquare, Phone, Mail, Calendar, CheckCircle2, FileText, Plus, Clock } from 'lucide-react';
import { formatTimeAgo, formatDate } from '../../lib/formatters';
import { Button } from '../ui/Button';

export function LeadActivityFeed({ lead, onAddActivity }) {
  const [newNote, setNewNote] = useState('');

  const activities = lead.activities || [];

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddActivity(newNote);
    setNewNote('');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'call': return <Phone className="w-3.5 h-3.5 text-[#D98A1B]" />;
      case 'email': return <Mail className="w-3.5 h-3.5 text-[#2F6FB5]" />;
      case 'outreach': return <MessageSquare className="w-3.5 h-3.5 text-[#1F8A5B]" />;
      case 'meeting_scheduled':
      case 'meeting_completed': return <Calendar className="w-3.5 h-3.5 text-[#D98A1B]" />;
      case 'proposal_sent': return <FileText className="w-3.5 h-3.5 text-[#C9A24B]" />;
      case 'stage_change': return <CheckCircle2 className="w-3.5 h-3.5 text-[#0B1F3A] dark:text-[var(--accent-color)]" />;
      default: return <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Add note form */}
      <form onSubmit={handleAddNote} className="rounded-card border border-[var(--border-subtle)] p-3 bg-[var(--bg-card)]">
        <textarea
          rows={2}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Log a call note, meeting takeaway, or internal comment..."
          className="w-full text-xs bg-transparent border-0 resize-none focus:outline-none text-[var(--text-ink)] placeholder-[var(--text-subtle)]"
        />
        <div className="flex justify-end pt-2 border-t border-[var(--border-subtle)]">
          <Button variant="primary" size="sm" type="submit" disabled={!newNote.trim()} icon={Plus}>
            Log Note
          </Button>
        </div>
      </form>

      {/* Activity Timeline list */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border-subtle)]">
        {activities.map((act) => (
          <div key={act.id} className="relative group">
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center">
              {getIcon(act.type)}
            </div>
            <div className="rounded-button border border-[var(--border-subtle)] bg-[var(--bg-card)] p-2.5 shadow-solid-sm">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-semibold text-[var(--text-ink)]">{act.author || 'System'}</span>
                <span className="text-[var(--text-subtle)]" title={formatDate(act.timestamp, 'PPpp')}>
                  {formatTimeAgo(act.timestamp)}
                </span>
              </div>
              <p className="text-xs text-[var(--text-ink)] leading-relaxed whitespace-pre-wrap">{act.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
