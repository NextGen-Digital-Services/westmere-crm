import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, ArrowRight, UserCheck } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function LoginPage() {
  const navigate = useNavigate();
  const { settings, login, onboarding, toggleOnboardingItem } = useAppStore();
  const branding = settings.branding;

  const [email, setEmail] = useState('fahad@westmeresolutions.com');
  const [password, setPassword] = useState('demo1234');

  const handleLogin = (e) => {
    e.preventDefault();
    login(email, email.split('@')[0]);
    navigate('/');
  };

  const handleQuickDemo = (userEmail) => {
    setEmail(userEmail);
    login(userEmail, userEmail.split('@')[0]);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-modal border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-solid-lg overflow-hidden"
      >
        {/* Left Side: Agency Brand & Login Form */}
        <div className="p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[var(--border-subtle)]">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#0B1F3A] flex items-center justify-center p-2 text-white shrink-0 shadow-solid">
                {branding.logo ? (
                  <img src={branding.logo} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
                    <rect width="32" height="32" rx="4" fill="#0B1F3A" />
                    <path d="M8 9L12 23L16 13L20 23L24 9" stroke="#C9A24B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-[var(--text-ink)] tracking-tight">
                  {branding.companyName || 'Westmere CRM'}
                </h1>
                <p className="text-[11px] text-[var(--text-muted)]">{branding.tagline}</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-base font-bold text-[var(--text-ink)]">Sales Executive Portal</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Manage high-ticket digital engineering deals across India and the UAE.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3.5">
              <Input
                label="Corporate Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="fahad@westmeresolutions.com"
                required
              />

              <Input
                label="Security Access Key / Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button variant="primary" type="submit" size="md" className="w-full" icon={ArrowRight} iconPosition="right">
                Enter CRM Dashboard
              </Button>
            </form>
          </div>

          {/* Quick Demo Rep Switcher */}
          <div className="mt-8 pt-4 border-t border-[var(--border-subtle)]">
            <p className="text-[10px] font-bold text-[var(--text-subtle)] uppercase tracking-wider mb-2">
              Instant 1-Click Demo Profiles:
            </p>
            <div className="flex flex-wrap gap-2">
              {settings.users.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickDemo(u.email)}
                  className="px-2.5 py-1 text-xs rounded-button border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[#0B1F3A] transition-colors text-[var(--text-ink)]"
                >
                  <span className="font-semibold">{u.name}</span>{' '}
                  <span className="text-[10px] text-[var(--text-subtle)]">({u.role})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Onboarding Checklist & System Overview */}
        <div className="p-8 bg-[var(--bg-main)]/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-[#1F8A5B]" />
              <h3 className="text-sm font-bold text-[var(--text-ink)]">First-Run Onboarding Checklist</h3>
            </div>
            <p className="text-xs text-[var(--text-muted)] mb-5">
              Welcome to Westmere Sales CRM! All data is fully populated with 40 realistic prospects. Complete these steps to configure your agency:
            </p>

            <div className="space-y-3">
              {onboarding.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleOnboardingItem(item.id)}
                  className="flex items-start gap-3 p-3 rounded-card border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#0B1F3A] cursor-pointer transition-all"
                >
                  <div className="pt-0.5">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        item.completed
                          ? 'bg-[#1F8A5B] border-[#1F8A5B] text-white'
                          : 'border-[var(--border-subtle)]'
                      }`}
                    >
                      {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-bold ${item.completed ? 'line-through text-[var(--text-subtle)]' : 'text-[var(--text-ink)]'}`}>
                      {item.title}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-subtle)] flex items-center justify-between">
            <span>Client Markets: India (INR) & Dubai (AED)</span>
            <span className="font-semibold text-[#1F8A5B]">Ready-to-Demo</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
