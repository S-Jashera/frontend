'use client';

import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className, onClick, hover }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-border shadow-card',
        hover && 'cursor-pointer hover:shadow-elevated transition-shadow duration-200',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface KPICardProps {
  label: string;
  value: string | number;
  sub?: string;
  variant?: 'default' | 'error' | 'warning' | 'success';
  icon?: React.ReactNode;
}

export function KPICard({ label, value, sub, variant = 'default', icon }: KPICardProps) {
  const valueColor = {
    default: 'text-[#1C1B1B]',
    error: 'text-error',
    warning: 'text-warning',
    success: 'text-success',
  }[variant];

  return (
    <div className="bg-white rounded-xl border border-border shadow-card p-4 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wide">{label}</p>
        {icon && <span className="text-neutral-400">{icon}</span>}
      </div>
      <p className={cn('text-2xl font-bold leading-none', valueColor)}>{value}</p>
      {sub && <p className="text-xs text-neutral-400">{sub}</p>}
    </div>
  );
}
