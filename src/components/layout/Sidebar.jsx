import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Target,
  Kanban,
  Users,
  Send,
  Calendar,
  CheckSquare,
  FileText,
  Award,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../../lib/store';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/targets', label: 'Targets & Goals', icon: Target },
  { path: '/pipeline', label: 'Pipeline', icon: Kanban },
  { path: '/leads', label: 'Leads Directory', icon: Users },
  { path: '/outreach', label: 'Outreach Center', icon: Send },
  { path: '/meetings', label: 'Meetings & Demos', icon: Calendar },
  { path: '/tasks', label: 'Tasks & Follow-ups', icon: CheckSquare },
  { path: '/proposals', label: 'Proposals Builder', icon: FileText },
  { path: '/won-lost', label: 'Won & Lost Analysis', icon: Award },
  { path: '/analytics', label: 'Analytics & ROI', icon: BarChart3 },
  { path: '/notifications', label: 'Notifications', icon: Bell },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ collapsed, setCollapsed }) {
  const branding = useAppStore((s) => s.settings.branding);
  const tasks = useAppStore((s) => s.tasks);
  const overdueCount = tasks.filter((t) => t.status === 'pending' && t.dueDate < '2026-11-19').length;

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 248 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="hidden md:flex flex-col bg-[#0B1F3A] text-[#E2E8F0] border-r border-[#183359] h-screen sticky top-0 shrink-0 select-none z-30 overflow-hidden"
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#183359] shrink-0">
        <NavLink to="/" className="flex items-center gap-3 overflow-hidden">
          {/* Logo with light/dark safe solid backing tile */}
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center p-1.5 shrink-0 shadow-solid">
            {branding.logo ? (
              <img src={branding.logo} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="6" fill="#0B1F3A" />
                <path d="M8 9L12 23L16 13L20 23L24 9" stroke="#C9A24B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-white tracking-tight truncate leading-tight">
                {branding.companyName || 'Westmere CRM'}
              </h1>
              <p className="text-[10px] text-[var(--accent-color)] font-semibold truncate tracking-wider uppercase">
                Sales Pipeline
              </p>
            </div>
          )}
        </NavLink>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-[#8EA3BF] hover:text-white hover:bg-[#16335C] transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1 no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-button text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'bg-[#16335C] text-white font-semibold shadow-solid-sm'
                    : 'text-[#9BB1CF] hover:text-white hover:bg-[#122A4C]'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[var(--accent-color)]' : 'text-[#8EA3BF] group-hover:text-white'
                    }`}
                  />
                  {!collapsed && <span className="truncate flex-1">{item.label}</span>}
                  {!collapsed && item.label === 'Tasks & Follow-ups' && overdueCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#C23B3B] text-white">
                      {overdueCount}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[var(--accent-color)] rounded-r" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Integrations Badge / Agency Info */}
      <div className="p-3 border-t border-[#183359] shrink-0 bg-[#071529]">
        <NavLink
          to="/settings/integrations"
          className="flex items-center gap-2.5 p-2 rounded-button bg-[#0E2342] hover:bg-[#16335C] text-xs transition-colors border border-[#1E3E6B]"
        >
          <Sparkles className="w-4 h-4 text-[var(--accent-color)] shrink-0" />
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-semibold text-white truncate text-[11px]">Integrations & API</p>
              <p className="text-[10px] text-[#8EA3BF] truncate">WhatsApp • AI • Email</p>
            </div>
          )}
        </NavLink>
      </div>
    </motion.aside>
  );
}
