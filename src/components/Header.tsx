'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../lib/auth';

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  'project-explorer': 'Project Explorer',
  'day4-lock': 'Day-4 Lock Center',
  'pour-readiness': 'Pour Readiness Center',
  'escalation-center': 'Escalation Command Center',
  'communication-center': 'Communication Center',
};

interface HeaderProps {
  alertCount?: number;
  onMobileToggle: () => void;
}

export function Header({ alertCount = 3, onMobileToggle }: HeaderProps) {
  const pathname = usePathname();
  const currentPage = pathname.split('/').pop() ?? 'dashboard';
  const { logout } = useAuth();

  return (
    <header className="h-14 bg-white border-b border-border flex items-center justify-between px-4 lg:px-6 gap-4 flex-shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button
          className="lg:hidden p-2 -ml-2 hover:bg-neutral-100 rounded-lg transition-colors"
          onClick={onMobileToggle}
          aria-label="Open menu"
        >
          <Menu size={20} className="text-neutral-700" />
        </button>
        <h1 className="text-base font-semibold text-[#1C1B1B] truncate">{pageTitles[currentPage] ?? 'GPL AI Control Tower'}</h1>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors" aria-label="Search">
          <Search size={18} className="text-neutral-500" />
        </button>
        <button className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors" aria-label="Notifications">
          <Bell size={18} className="text-neutral-500" />
          {alertCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
          )}
        </button>
        <button
          onClick={logout}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          aria-label="Logout"
        >
          <LogOut size={18} className="text-neutral-500" />
        </button>
      </div>
    </header>
  );
}
