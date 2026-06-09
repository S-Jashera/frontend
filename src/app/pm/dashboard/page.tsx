'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  Clock,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Droplets,
  AlertCircle,
} from 'lucide-react';
import { Card, KPICard } from '../../../components/common/Card';
import { HealthBadge, HealthDot } from '../../../components/common/StatusBadge';

// Data Constants
const towers = [
  {
    id: 't1',
    name: 'Reserve Kandivali T3',
    floor: 13,
    pour: 1,
    day: 4,
    health: 'critical' as const,
    trend: 'Declining',
    variance: -1,
    risks: 2,
  },
  {
    id: 't2',
    name: 'Ascend Thane T1',
    floor: 32,
    pour: 2,
    day: 6,
    health: 'good' as const,
    trend: 'Improving',
    variance: 0,
    risks: 0,
  },
  {
    id: 't3',
    name: 'Ascend Thane T3',
    floor: 21,
    pour: 1,
    day: 3,
    health: 'at_risk' as const,
    trend: 'Stable',
    variance: 0,
    risks: 1,
  },
];

const attentionItems = [
  {
    id: 'a1',
    tower: 'Reserve T3',
    location: 'F13-P1',
    health: 'critical' as const,
    issue: 'Day-4 Lock at Risk',
    detail: 'A15 Blocked – Aluform Pins',
    sla: 2,
  },
  {
    id: 'a2',
    tower: 'Ascend T3',
    location: 'F21-P1',
    health: 'at_risk' as const,
    issue: 'EoD Missing > 4 Hours',
    detail: 'TIC not updated since 14:00',
    sla: null,
  },
];

const escalations = [
  { id: 'e1', title: 'Crane Breakdown', severity: 'critical' as const },
  { id: 'e2', title: 'Material Delay', severity: 'high' as const },
];

const pourMilestones = [
  { id: 'p1', tower: 'Ascend T1', date: 'Today', status: 'QC Cleared', type: 'ready' as const },
  { id: 'p2', tower: 'Reserve T3', date: 'Tomorrow', status: '1 Blocker Outstanding', type: 'blocked' as const },
];

function TowerHealthCard({ tower }: { tower: (typeof towers)[0] }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <HealthDot health={tower.health} />
          <h3 className="text-sm font-semibold text-[#1C1B1B]">{tower.name}</h3>
        </div>
        <HealthBadge health={tower.health} />
      </div>

      <div className="grid grid-cols-4 gap-2 mb-3">
        <div>
          <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Floor</p>
          <p className="text-base font-bold text-[#1C1B1B]">{tower.floor}</p>
        </div>
        <div>
          <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Pour</p>
          <p className="text-base font-bold text-[#1C1B1B]">P{tower.pour}</p>
        </div>
        <div>
          <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Day</p>
          <p className="text-base font-bold text-[#1C1B1B]">{tower.day}</p>
        </div>
        <div>
          <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Health</p>
          <p className="text-base font-bold text-[#1C1B1B]">{tower.health === 'good' ? '91%' : tower.health === 'at_risk' ? '74%' : '62%'}</p>
        </div>
      </div>

      <div className="space-y-2 pt-3 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-neutral-500">Trend</span>
          <div className="flex items-center gap-1">
            {tower.trend === 'Declining' && <TrendingDown size={12} className="text-error" />}
            {tower.trend === 'Improving' && <TrendingUp size={12} className="text-success" />}
            {tower.trend === 'Stable' && <span className="w-2 h-2 rounded-full bg-primary" />}
            <span className="text-[11px] font-medium text-[#1C1B1B]">{tower.trend}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-neutral-500">Schedule Variance</span>
          <span className={`text-[11px] font-medium ${tower.variance === 0 ? 'text-success' : 'text-error'}`}>
            {tower.variance === 0 ? '0 days' : tower.variance > 0 ? `+${tower.variance}d` : `${tower.variance}d`}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-neutral-500">Open Risks</span>
          <span className={`text-[11px] font-medium ${tower.risks > 0 ? 'text-warning' : 'text-success'}`}>
            {tower.risks} {tower.risks === 1 ? 'risk' : 'risks'}
          </span>
        </div>
      </div>
    </Card>
  );
}

function NeedsAttentionItem({ item }: { item: (typeof attentionItems)[0] }) {
  return (
    <div className="border-b border-border last:border-0 py-3 last:py-0">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <HealthDot health={item.health} />
            <h4 className="text-sm font-semibold text-[#1C1B1B]">{item.tower}</h4>
          </div>
          <p className="text-[11px] text-neutral-500">{item.location}</p>
        </div>
        <HealthBadge health={item.health} />
      </div>

      <div className="mb-2">
        <p className="text-xs font-medium text-[#1C1B1B] mb-0.5">{item.issue}</p>
        <p className="text-[11px] text-neutral-500">{item.detail}</p>
      </div>

      {item.sla !== null && (
        <div className="flex items-center gap-1 mb-2 text-[11px] text-warning">
          <Clock size={11} />
          SLA Remaining: {item.sla} hours
        </div>
      )}

      <div className="flex gap-2">
        <button className="flex-1 h-8 text-xs font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
          {item.sla !== null ? 'View Recovery' : 'Prompt TIC'}
        </button>
        {item.sla === null && (
          <button className="flex-1 h-8 text-xs font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
            CM Fallback
          </button>
        )}
      </div>
    </div>
  );
}

export default function PMDashboardPage() {
  const router = useRouter();
  const activeTowers = towers.length;
  const avgHealth = 79;
  const scheduleVariance = -1;
  const criticalEscalations = escalations.filter((e) => e.severity === 'critical').length;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <section>
        <h1 className="text-3xl font-bold text-secondary mb-1">Portfolio Dashboard</h1>
        <p className="text-sm text-neutral-500">Good morning, Amit. {activeTowers} towers active. {attentionItems.length} needs your attention.</p>
      </section>

      {/* KPI Cards */}
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KPICard label="Active Towers" value={activeTowers} />
          <KPICard label="Avg Health" value={`${avgHealth}%`} variant={avgHealth < 80 ? 'warning' : 'success'} />
          <KPICard label="Schedule Variance" value={`${scheduleVariance}d`} variant={scheduleVariance < 0 ? 'warning' : 'success'} />
          <KPICard label="Critical Escalations" value={criticalEscalations} variant={criticalEscalations > 0 ? 'error' : 'default'} />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Needs Attention */}
        <section className="lg:col-span-1">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Needs Attention</h2>
          <Card className="p-4">
            <div className="space-y-3">
              {attentionItems.map((item) => (
                <NeedsAttentionItem key={item.id} item={item} />
              ))}
            </div>
          </Card>
        </section>

        {/* Tower Health Overview */}
        <section className="lg:col-span-2">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Tower Health Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {towers.map((tower) => (
              <TowerHealthCard key={tower.id} tower={tower} />
            ))}
          </div>
        </section>
      </div>

      {/* Schedule Variance Summary */}
      <section>
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Schedule Variance Summary</h2>
        <Card>
          <div className="divide-y divide-border">
            {towers.map((tower, idx) => (
              <div key={tower.id} className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-[#1C1B1B]">{tower.name}</p>
                  <p className="text-[11px] text-neutral-500">
                    F{tower.floor}-P{tower.pour}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-neutral-500 mb-0.5">Actual vs Plan</p>
                  <p className={`text-base font-bold ${tower.variance === 0 ? 'text-success' : 'text-error'}`}>
                    {tower.variance === 0 ? '0d' : tower.variance > 0 ? `+${tower.variance}d` : `${tower.variance}d`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Pour Milestones */}
      <section>
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Pour Milestones This Week</h2>
        <Card>
          <div className="divide-y divide-border">
            {pourMilestones.map((milestone) => (
              <div key={milestone.id} className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-[#1C1B1B]">{milestone.tower}</p>
                  <p className="text-[11px] text-neutral-500">{milestone.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-lg ${
                      milestone.type === 'ready'
                        ? 'bg-success-light text-success flex items-center gap-1'
                        : 'bg-warning-light text-warning flex items-center gap-1'
                    }`}
                  >
                    {milestone.type === 'ready' && <CheckCircle2 size={12} />}
                    {milestone.type === 'blocked' && <AlertCircle size={12} />}
                    {milestone.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Open Escalations */}
      <section>
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Open Escalations</h2>
        <Card className="p-4">
          <div className="space-y-2">
            {escalations.map((esc, idx) => (
              <div key={esc.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div
                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    esc.severity === 'critical' ? 'bg-error' : 'bg-warning'
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#1C1B1B]">{esc.title}</p>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    esc.severity === 'critical'
                      ? 'bg-error-light text-error'
                      : 'bg-warning-light text-warning'
                  }`}
                >
                  {esc.severity === 'critical' ? 'Critical' : 'High'}
                </span>
              </div>
            ))}
          </div>
          <button className="mt-3 text-xs text-primary font-medium hover:underline flex items-center gap-1">
            View all escalations <ChevronRight size={12} />
          </button>
        </Card>
      </section>
    </div>
  );
}
