import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { CommandPalette } from './CommandPalette';
import { LeadDrawer } from '../leads/LeadDrawer';
import { LeadModal } from '../leads/LeadModal';
import { ToastContainer } from '../ui/Toast';
import { ConfettiBurst } from '../ui/ConfettiBurst';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useAppStore } from '../../lib/store';

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { quickAddModalOpen, setQuickAddModalOpen } = useAppStore();

  // Enable global keyboard shortcuts (Cmd+K, N, /, G-sequences)
  useKeyboardShortcuts();

  return (
    <div className="min-h-screen flex bg-[var(--bg-main)] text-[var(--text-ink)] antialiased font-sans">
      {/* Desktop & Tablet Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopBar />
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Global Interactive Modals & Overlays */}
      <CommandPalette />
      <LeadDrawer />
      <LeadModal
        isOpen={quickAddModalOpen}
        onClose={() => setQuickAddModalOpen(false)}
      />
      <ToastContainer />
      <ConfettiBurst />
    </div>
  );
}
