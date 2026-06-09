'use client';

import { cn } from '../../lib/utils';
import type { TowerHealth, ActivityStatus, RiskSeverity } from '../../types';

export function HealthDot({ health }: { health: TowerHealth }) {
  return (
    <span className={cn(
      'inline-block w-2 h-2 rounded-full flex-shrink-0',
      health === 'good' && 'bg-success',
      health === 'at_risk' && 'bg-warning',
      health === 'critical' && 'bg-error',
    )} />
  );
}

export function ActivityStatusBadge({ status }: { status: ActivityStatus }) {
  const map: Record<ActivityStatus, { label: string; cls: string }> = {
    complete: { label: 'Complete', cls: 'bg-success-light text-success' },
    in_progress: { label: 'In Progress', cls: 'bg-primary-100 text-primary-600' },
    blocked: { label: 'Blocked', cls: 'bg-error-light text-error' },
    not_started: { label: 'Not Started', cls: 'bg-neutral-100 text-neutral-500' },
  };
  const { label, cls } = map[status];
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium', cls)}>
      {label}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: RiskSeverity }) {
  const map: Record<RiskSeverity, { label: string; cls: string }> = {
    critical: { label: 'Critical', cls: 'bg-error-light text-error' },
    high: { label: 'High', cls: 'bg-warning-light text-warning' },
    medium: { label: 'Medium', cls: 'bg-primary-100 text-primary-600' },
    low: { label: 'Low', cls: 'bg-neutral-100 text-neutral-500' },
  };
  const { label, cls } = map[severity];
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium', cls)}>
      {label}
    </span>
  );
}

export function HealthBadge({ health }: { health: TowerHealth }) {
  const map: Record<TowerHealth, { label: string; cls: string }> = {
    good: { label: 'On Track', cls: 'bg-success-light text-success' },
    at_risk: { label: 'At Risk', cls: 'bg-warning-light text-warning' },
    critical: { label: 'Critical', cls: 'bg-error-light text-error' },
  };
  const { label, cls } = map[health];
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold', cls)}>
      {label}
    </span>
  );
}
