import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Plus, Bell, Sun, Moon, LogOut } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { Dropdown } from '../ui/Dropdown';

export function TopBar() {
  const { settings, auth, updateSettings, setQuickAddModalOpen, setCommandPaletteOpen, tasks, leads } = useAppStore();
  const theme = settings.appearance?.theme || 'light';

  // Compute unread notification count
  const overdueTasks = tasks.filter((t) => t.status === 'pending' && t.dueDate < '2026-11-19').length;
  const staleLeadsCount = leads.filter((l) => {
    if (!l.lastActivityDate) return false;
    const diff = (Date.now() - new Date(l.lastActivityDate).getTime()) / (1000 * 60 * 60 * 24);
    return diff >= (settings.pipeline?.staleThresholdDays || 7);
  }).length;
  const totalNotifications = overdueTasks + staleLeadsCount;

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    updateSettings({
      appearance: {
        ...settings.appearance,
        theme: nextTheme,
      },
    });
  };

  const userMenuItems = [
    { label: `${auth.user?.name || 'User'} (${auth.user?.role || 'Sales'})`, onClick: () => {} },
    { divider: true },
    { label: 'Branding Settings', onClick: () => { window.location.href = '/settings'; } },
    { label: 'Integrations & API', onClick: () => { window.location.href = '/settings/integrations'; } },
    { divider: true },
    { label: 'Sign Out (Demo)', icon: LogOut, danger: true, onClick: () => useAppStore.getState().logout() },
  ];

  return (
    <header className="h-16 px-4 md:px-6 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-solid-sm">
      {/* Left side: Mobile Brand or Search Bar */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Logo View */}
        <div className="flex md:hidden items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center p-1 border border-[var(--border-subtle)] shrink-0">
            {settings.branding?.logo ? (
              <img src={settings.branding.logo} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="4" fill="#0B1F3A" />
                <path d="M8 9L12 23L16 13L20 23L24 9" stroke="#C9A24B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span className="font-bold text-sm text-[var(--text-ink)] truncate">{settings.branding?.companyName || 'Westmere'}</span>
        </div>

        {/* Global Search Button / Command Palette Trigger */}
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-button border border-[var(--border-subtle)] bg-[var(--bg-main)] text-xs text-[var(--text-muted)] hover:border-[#0B1F3A] dark:hover:border-[var(--accent-color)] transition-colors w-64 md:w-80 cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 shrink-0 text-[var(--text-subtle)]" />
          <span className="truncate">Search leads, companies, actions...</span>
          <kbd className="ml-auto px-1.5 py-0.5 rounded text-[10px] bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-[var(--text-subtle)]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Add Lead Button */}
        <Button
          variant="gold"
          size="sm"
          icon={Plus}
          onClick={() => setQuickAddModalOpen(true)}
          className="hidden xs:inline-flex shadow-solid-sm"
        >
          Add Lead
        </Button>

        {/* Light/Dark Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-button text-[var(--text-muted)] hover:text-[var(--text-ink)] hover:bg-[var(--bg-subtle)] border border-[var(--border-subtle)] transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-[var(--accent-color)]" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Bell */}
        <NavLink
          to="/notifications"
          className="relative p-2 rounded-button text-[var(--text-muted)] hover:text-[var(--text-ink)] hover:bg-[var(--bg-subtle)] border border-[var(--border-subtle)] transition-colors"
          title="Notification Center"
        >
          <Bell className="w-4 h-4" />
          {totalNotifications > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C23B3B] text-white text-[9px] font-bold flex items-center justify-center">
              {totalNotifications}
            </span>
          )}
        </NavLink>

        {/* User Profile Avatar Dropdown */}
        <Dropdown
          trigger={
            <button type="button" className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[var(--border-subtle)] transition-all">
              <Avatar name={auth.user?.name || 'Fahad Al-Maktoum'} size="md" />
            </button>
          }
          items={userMenuItems}
          align="right"
        />
      </div>
    </header>
  );
}
