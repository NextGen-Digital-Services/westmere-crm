import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { TargetsPage } from './pages/TargetsPage';
import { PipelinePage } from './pages/PipelinePage';
import { LeadsPage } from './pages/LeadsPage';
import { OutreachPage } from './pages/OutreachPage';
import { MeetingsPage } from './pages/MeetingsPage';
import { TasksPage } from './pages/TasksPage';
import { ProposalsPage } from './pages/ProposalsPage';
import { WonLostPage } from './pages/WonLostPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { useAppStore } from './lib/store';

// Protected Route Guard
function ProtectedRoute({ children }) {
  const isAuthenticated = useAppStore((s) => s.auth.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  const { settings } = useAppStore();

  // Apply initial theme, accent color, and favicon on app mount
  useEffect(() => {
    // Theme
    if (settings.appearance?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Accent color
    if (settings.branding?.accentColor) {
      document.documentElement.style.setProperty('--accent-color', settings.branding.accentColor);
    }

    // Favicon
    const favicon = document.getElementById('app-favicon');
    if (favicon) {
      favicon.href = settings.branding?.logo || '/favicon.svg';
    }
  }, [settings.appearance?.theme, settings.branding?.accentColor, settings.branding?.logo]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected App Shell */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="targets" element={<TargetsPage />} />
          <Route path="pipeline" element={<PipelinePage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="outreach" element={<OutreachPage />} />
          <Route path="meetings" element={<MeetingsPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="proposals" element={<ProposalsPage />} />
          <Route path="won-lost" element={<WonLostPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="settings/integrations" element={<IntegrationsPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
