import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  AlertTriangle,
  Calendar,
  Clock,
  Trash2,
  CheckCircle2,
  Repeat,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../lib/store';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { formatDate } from '../lib/formatters';
import { showToast } from '../hooks/useToast';

export function TasksPage() {
  const { tasks, addTask, toggleTaskComplete, deleteTask, leads, openLeadDrawer } = useAppStore();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'today' | 'overdue' | 'upcoming' | 'completed'
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    title: '',
    leadId: leads[0]?.id || '',
    dueDate: '2026-11-19',
    priority: 'Hot',
    category: 'Follow-up',
    isRecurring: false,
    recurringInterval: 'Weekly',
  });

  const todayStr = '2026-11-19';

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'today') return t.status === 'pending' && t.dueDate === todayStr;
    if (activeFilter === 'overdue') return t.status === 'pending' && t.dueDate < todayStr;
    if (activeFilter === 'upcoming') return t.status === 'pending' && t.dueDate > todayStr;
    if (activeFilter === 'completed') return t.status === 'completed';
    return true;
  });

  const overdueCount = tasks.filter((t) => t.status === 'pending' && t.dueDate < todayStr).length;
  const todayCount = tasks.filter((t) => t.status === 'pending' && t.dueDate === todayStr).length;
  const upcomingCount = tasks.filter((t) => t.status === 'pending' && t.dueDate > todayStr).length;

  const handleCreateTask = (e) => {
    e.preventDefault();
    const lead = leads.find((l) => l.id === form.leadId);

    addTask({
      ...form,
      leadName: lead ? `${lead.name} (${lead.businessName})` : 'General Task',
    });

    setModalOpen(false);
    showToast({ type: 'success', title: 'Task Scheduled', message: form.title });
    setForm({
      title: '',
      leadId: leads[0]?.id || '',
      dueDate: todayStr,
      priority: 'Hot',
      category: 'Follow-up',
      isRecurring: false,
      recurringInterval: 'Weekly',
    });
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-ink)] tracking-tight">Tasks & Follow-ups</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Never let a prospect slip: track scheduled call notes, follow-up messages, and commercial actions.
          </p>
        </div>

        <Button variant="gold" size="sm" icon={Plus} onClick={() => setModalOpen(true)}>
          New Task
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border-subtle)] pb-2 text-xs">
        {[
          { id: 'all', label: 'All Tasks', count: tasks.length },
          { id: 'today', label: 'Due Today', count: todayCount },
          { id: 'overdue', label: 'Overdue', count: overdueCount, alert: overdueCount > 0 },
          { id: 'upcoming', label: 'Upcoming', count: upcomingCount },
          { id: 'completed', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3 py-1.5 rounded-button font-medium flex items-center gap-1.5 transition-colors ${
              activeFilter === tab.id
                ? 'bg-[#0B1F3A] text-white dark:bg-[var(--accent-color)] dark:text-[#0B1F3A] font-bold'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:border-[#0B1F3A]'
            }`}
          >
            <span>{tab.label}</span>
            {typeof tab.count !== 'undefined' && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  tab.alert
                    ? 'bg-[#C23B3B] text-white'
                    : activeFilter === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-[var(--bg-subtle)] text-[var(--text-muted)]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-2.5">
        <AnimatePresence>
          {filteredTasks.length === 0 ? (
            <Card className="p-8 text-center text-xs text-[var(--text-muted)]">
              No tasks found in this view. All follow-ups are up to date!
            </Card>
          ) : (
            filteredTasks.map((task) => {
              const isOverdue = task.status === 'pending' && task.dueDate < todayStr;
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15 }}
                >
                  <Card
                    padding="p-3.5"
                    className={`flex items-center justify-between gap-3 ${
                      isOverdue ? 'border-[#F4C7C7] bg-[#FAECEC]/30' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={() => {
                          toggleTaskComplete(task.id);
                          showToast({
                            type: 'success',
                            title: task.status === 'completed' ? 'Task Reopened' : 'Task Completed',
                            message: task.title,
                          });
                        }}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                          task.status === 'completed'
                            ? 'bg-[#1F8A5B] border-[#1F8A5B] text-white'
                            : 'border-[var(--border-subtle)] hover:border-[#0B1F3A] bg-[var(--bg-surface)]'
                        }`}
                      >
                        {task.status === 'completed' && <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />}
                      </button>

                      {/* Title & Linked Lead */}
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-semibold leading-snug truncate ${
                              task.status === 'completed' ? 'line-through text-[var(--text-subtle)]' : 'text-[var(--text-ink)]'
                            }`}
                          >
                            {task.title}
                          </span>
                          <Badge variant={task.priority === 'Hot' ? 'danger' : 'warning'} size="sm">
                            {task.priority}
                          </Badge>
                          {task.isRecurring && (
                            <span className="text-[10px] text-[var(--text-subtle)] flex items-center gap-0.5">
                              <Repeat className="w-2.5 h-2.5" />
                              {task.recurringInterval}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[var(--text-muted)]">
                          {task.leadId && (
                            <button
                              type="button"
                              onClick={() => openLeadDrawer(task.leadId)}
                              className="text-[#0B1F3A] dark:text-[var(--accent-color)] font-medium hover:underline truncate"
                            >
                              {task.leadName}
                            </button>
                          )}
                          <span>•</span>
                          <span className={isOverdue ? 'text-[#C23B3B] font-bold flex items-center gap-1' : ''}>
                            {isOverdue && <AlertTriangle className="w-3 h-3" />}
                            Due {formatDate(task.dueDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => {
                          deleteTask(task.id);
                          showToast({ type: 'warning', title: 'Task Removed', message: task.title });
                        }}
                        className="text-[var(--text-muted)] hover:text-[#C23B3B]"
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Schedule Task or Follow-Up"
        subtitle="Link action item to prospect for pipeline accountability"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
          <Input
            label="Task Action / Summary *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Follow up on proposal v2 commercial discount"
            required
          />

          <div>
            <label className="block text-xs font-semibold text-[var(--text-ink)] mb-1">Link to Prospect</label>
            <select
              value={form.leadId}
              onChange={(e) => setForm({ ...form, leadId: e.target.value })}
              className="w-full text-xs rounded-button border border-[var(--border-subtle)] p-2 bg-[var(--bg-surface)] text-[var(--text-ink)] focus:outline-none"
            >
              <option value="">General (No specific prospect)</option>
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.businessName || l.name} ({l.market})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Due Date *"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              required
            />
            <Select
              label="Priority Level"
              options={['Hot', 'Warm', 'Cold']}
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2 p-2 rounded-button bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
            <input
              type="checkbox"
              id="recur"
              checked={form.isRecurring}
              onChange={(e) => setForm({ ...form, isRecurring: e.target.checked })}
              className="rounded text-[#0B1F3A]"
            />
            <label htmlFor="recur" className="font-semibold text-[var(--text-ink)] cursor-pointer">
              Set as Recurring Cadence
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
