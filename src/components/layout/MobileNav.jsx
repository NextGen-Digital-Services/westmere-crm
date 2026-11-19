import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Kanban, Users, Plus, Send, Settings } from 'lucide-react';
import { useAppStore } from '../../lib/store';

export function MobileNav() {
  const setQuickAddModalOpen = useAppStore((s) => s.setQuickAddModalOpen);

  const items = [
    { path: '/', label: 'Home', icon: LayoutDashboard },
    { path: '/pipeline', label: 'Pipeline', icon: Kanban },
    { path: '/leads', label: 'Leads', icon: Users },
    { path: '/outreach', label: 'Outreach', icon: Send },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Floating Add Lead Button on Mobile */}
      <div className="md:hidden fixed bottom-20 right-4 z-40">
        <button
          type="button"
          onClick={() => setQuickAddModalOpen(true)}
          className="w-13 h-13 rounded-full bg-[#C9A24B] text-[#0B1F3A] flex items-center justify-center shadow-solid-lg font-bold hover:scale-105 active:scale-95 transition-transform"
          aria-label="Add new lead"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0B1F3A] border-t border-[#183359] z-40 flex items-center justify-around px-2 text-[#8EA3BF]">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-14 py-1 gap-1 text-[10px] font-medium transition-colors ${
                  isActive ? 'text-[var(--accent-color)] font-bold' : 'hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </>
  );
}
