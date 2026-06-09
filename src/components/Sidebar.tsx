'use client';

import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  ListChecks,
  Lock,
  Droplets,
  AlertTriangle,
  MessageSquare,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../lib/utils';

interface NavItem {
  page: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { page: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { page: 'project-explorer', label: 'Project Explorer', icon: <ListChecks size={18} /> },
  { page: 'escalation-center', label: 'Escalation Center', icon: <AlertTriangle size={18} /> },
  { page: 'communication-center', label: 'Communication Center', icon: <MessageSquare size={18} /> },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileToggle: () => void;
  collapsed: boolean;
  onCollapsedToggle: () => void;
}

export function Sidebar({ mobileOpen, onMobileToggle, collapsed, onCollapsedToggle }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentPage = pathname.split('/').pop() ?? 'dashboard';

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onMobileToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full z-40 flex flex-col bg-sidebar border-r border-border transition-all duration-300 ease-in-out',
          'lg:static lg:z-auto',
          collapsed ? 'w-[68px]' : 'w-64',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <header className="h-14 px-4 border-b border-border flex items-center justify-between">
          <div className={cn('flex items-center gap-3 overflow-hidden', collapsed && 'justify-center px-0')}>
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 size={15} className="text-white" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-primary leading-tight tracking-tight truncate">GPL AI Control Tower</p>
                <p className="text-[10px] text-neutral-500 tracking-widest uppercase">OPS CONTROL CENTER</p>
              </div>
            )}
          </div>
          {/* Desktop collapse toggle */}
          <button
            onClick={onCollapsedToggle}
            className="hidden lg:flex w-6 h-6 items-center justify-center rounded-md hover:bg-neutral-100 transition-colors flex-shrink-0"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={14} className="text-neutral-500" /> : <ChevronLeft size={14} className="text-neutral-500" />}
          </button>
        </header>

        {/* Nav items */}
        <nav className="flex-1 px-2 flex flex-col gap-0.5 pt-2 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const active = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => { router.push(`/${item.page}`); if (mobileOpen) onMobileToggle(); }}
                title={collapsed ? item.label : undefined}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors duration-150',
                  collapsed && 'justify-center px-0',
                  active
                    ? 'bg-primary text-white'
                    : 'text-[#424656] hover:bg-primary-50 hover:text-primary'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <span className={cn('flex-shrink-0', active ? 'text-white' : 'text-current')}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className={cn('text-sm leading-tight truncate', active ? 'font-semibold' : 'font-normal')}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User footer */}
        <footer className={cn('px-4 py-4 border-t border-border', collapsed && 'px-2')}>
          <div className={cn('flex items-center gap-3', collapsed && 'justify-center gap-0 px-0')}>
            <div className="w-9 h-9 rounded-full bg-primary-100 border border-secondary-300 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">CM</span>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#1C1B1B] truncate">Construction Manager</p>
                <p className="text-[10px] text-neutral-500 tracking-widest uppercase">OPS CONTROL CENTER</p>
              </div>
            )}
          </div>
        </footer>

        {/* Mobile close button */}
        {mobileOpen && (
          <button
            className="absolute top-4 right-4 lg:hidden p-1 hover:bg-neutral-100 rounded-lg transition-colors"
            onClick={onMobileToggle}
            aria-label="Close menu"
          >
            <X size={18} className="text-neutral-500" />
          </button>
        )}
      </aside>
    </>
  );
}
