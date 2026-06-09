'use client';

import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { Sidebar } from './Sidebar';
import { Header } from '../components/Header';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { authed, authLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authed) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        collapsed={sidebarCollapsed}
        onCollapsedToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header alertCount={3} onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      <button
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-fab hover:bg-primary-600 active:bg-primary-700 transition-colors flex items-center justify-center z-20"
        aria-label="New Task"
      >
        <span className="text-2xl font-light leading-none">+</span>
      </button>
    </div>
  );
}
