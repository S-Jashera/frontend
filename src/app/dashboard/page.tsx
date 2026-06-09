'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { normalizeFilterParam } from '../../lib/cascadingFilters';
import {
  Building2,
  AlertTriangle,
  Clock,
  TrendingDown,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Droplets,
} from 'lucide-react';
import { Card, KPICard } from '../../components/common/Card';
import { HealthBadge, HealthDot } from '../../components/common/StatusBadge';
import { mockTowers, mockEscalations, mockTicUpdates } from '../../data/mock';
import type { Tower } from '../../types';

function TowerCard({
  tower,
  onOpen,
}: {
  tower: Tower;
  onOpen: () => void;
}) {
  // Mock values for UI only
  const activeFloors = 3;
  const activePours = 6;
  const currentFocus =
    tower.current_day >= 6
      ? 'Pour Readiness'
      : tower.current_day >= 4
      ? 'Day-4 Lock'
      : 'Execution';

  const latestUpdate =
    tower.open_risks > 0
      ? 'Action Required'
      : 'Execution On Track';

  return (
    <Card hover onClick={onOpen} className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-[#1C1B1B]">
            {tower.name}
          </h3>

          <p className="text-[11px] text-neutral-400">
            {tower.project}
          </p>
        </div>

        <ChevronRight
          size={14}
          className="text-neutral-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-[10px] text-neutral-400 uppercase tracking-wide">
            Active Floors
          </p>

          <p className="text-base font-bold text-[#1C1B1B]">
            {activeFloors}
          </p>
        </div>

        <div>
          <p className="text-[10px] text-neutral-400 uppercase tracking-wide">
            Active Pours
          </p>

          <p className="text-base font-bold text-[#1C1B1B]">
            {activePours}
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div>
          <p className="text-[10px] text-neutral-400 uppercase tracking-wide">
            Current Focus
          </p>

          <p className="text-xs font-medium text-[#1C1B1B]">
            {currentFocus}
          </p>
        </div>

        <div>
          <p className="text-[10px] text-neutral-400 uppercase tracking-wide">
            Latest Update
          </p>

          <p className="text-xs text-[#1C1B1B]">
            {latestUpdate}
          </p>
        </div>
      </div>

      <div className="border-t border-border pt-3">
        <p className="text-[11px] text-primary font-medium">
          Open Tower →
        </p>
      </div>
    </Card>
  );
}
function ProjectSection({
  projectName,
  towers,
  onTowerClick,
}: {
  projectName: string;
  towers: Tower[];
  onTowerClick: (towerId: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);

  const activeCount = towers.filter(
    (t) => t.status === 'active'
  ).length;

  // Mock values for now
  const activeInstances = activeCount * 2;
  const activityEscalations = towers.reduce(
    (sum, tower) => sum + tower.open_risks,
    0
  );

  const preconditionEscalations = Math.floor(
    activityEscalations / 2
  );

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-border rounded-xl mb-3 hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex-shrink-0 transition-transform ${
              expanded ? 'rotate-0' : '-rotate-90'
            }`}
          >
            <ChevronDown
              size={16}
              className="text-primary"
            />
          </div>

          <div className="text-left">
            <h3 className="text-sm font-semibold text-[#1C1B1B]">
              {projectName}
            </h3>

            <p className="text-[11px] text-neutral-400">
              {activeCount} active towers · {activeInstances}{' '}
              active instances
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activityEscalations > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-error px-2 py-1 bg-error-light rounded-lg">
              {activityEscalations} Activity Esc.
            </span>
          )}

          {preconditionEscalations > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-warning px-2 py-1 bg-warning-light rounded-lg">
              {preconditionEscalations} Precondition Esc.
            </span>
          )}
        </div>
      </button>

      {expanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {towers.map((tower) => (
            <TowerCard
              key={tower.id}
              tower={tower}
              onOpen={() => onTowerClick(tower.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PendingUpdatesWidget() {
  const towerUpdates = [
    { tower: 'Reserve T2', type: 'EoD Missing', time: '21:00', status: 'missing' as const },
    { tower: 'Ascend T3', type: 'No Update > 4hrs', time: '4h ago', status: 'overdue' as const },
    { tower: 'Pinnacle T3', type: 'SoD Missing', time: '07:00', status: 'missing' as const },
  ];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#1C1B1B]">Pending Updates</h3>
        <span className="text-xs bg-error-light text-error px-2 py-0.5 rounded-full font-medium">{towerUpdates.length}</span>
      </div>
      <div className="space-y-2">
        {towerUpdates.map((u, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${u.status === 'overdue' ? 'bg-warning' : 'bg-error'}`} />
              <div>
                <p className="text-xs font-medium text-[#1C1B1B]">{u.tower}</p>
                <p className="text-[11px] text-neutral-500">{u.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-neutral-400">
              <Clock size={11} />
              {u.time}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const projects = Array.from(new Set(mockTowers.map((t) => t.project)));
  const criticalTowers = mockTowers.filter((t) => t.health === 'critical').length;
  const atRiskTowers = mockTowers.filter((t) => t.health === 'at_risk').length;
  const totalRisks = mockTowers.reduce((a, t) => a + t.open_risks, 0);
  const openEscalations = mockEscalations.filter((e) => e.status !== 'closed').length;
  const upcomingPours = mockTowers.filter((t) => t.current_day >= 6);

  function handleTowerClick(towerId: string) {
    const tower = mockTowers.find((t) => t.id === towerId);
    if (!tower) {
      router.push('/project-explorer');
      return;
    }

    const query = new URLSearchParams({
      project: normalizeFilterParam(tower.project),
      tower: normalizeFilterParam(tower.name),
    }).toString();

    router.push(`/project-explorer?${query}`);
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Project Summary KPIs */}
      <section>
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Summary</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
  <KPICard
    label="Projects"
    value={3}
  />

  <KPICard
    label="Active Towers"
    value={9}
    icon={<Building2 size={14} />}
  />

  <KPICard
    label="Active Instances"
    value={14}
  />

  <KPICard
    label="Activity Escalations"
    value={5}
    variant="error"
    icon={<AlertTriangle size={14} />}
  />

  <KPICard
    label="Precondition Escalations"
    value={3}
    variant="warning"
  />

  <KPICard
    label="Pending Updates"
    value={1}
    variant="warning"
  />
</div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects & Towers */}
        <section className="lg:col-span-2">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Active Projects</h2>
          {projects.map((project) => {
            const projectTowers = mockTowers.filter((t) => t.project === project);
            return (
              <ProjectSection
                key={project}
                projectName={project}
                towers={projectTowers}
                onTowerClick={handleTowerClick}
              />
            );
          })}
        </section>

        {/* Right column */}
        <section className="space-y-4">
          <PendingUpdatesWidget />

          {/* Upcoming Pours */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#1C1B1B]">Upcoming Pours</h3>
              <Droplets size={14} className="text-primary" />
            </div>
            {upcomingPours.length === 0 ? (
              <p className="text-xs text-neutral-400">No pours in next 48 hours</p>
            ) : (
              <div className="space-y-2">
                {upcomingPours.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0 cursor-pointer group"
                    onClick={() => router.push('/pour-readiness')}
                  >
                    <div>
                      <p className="text-xs font-medium text-[#1C1B1B] group-hover:text-primary transition-colors">{t.name}</p>
                      <p className="text-[11px] text-neutral-500">Fl. {t.active_floor} · P{t.active_pour}</p>
                    </div>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${t.current_day === 7 ? 'bg-success-light text-success' : 'bg-warning-light text-warning'}`}>
                      {t.current_day === 7 ? 'Today' : 'Tomorrow'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Critical Escalations */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#1C1B1B]">Critical Escalations</h3>
              <span className="text-xs bg-error-light text-error px-2 py-0.5 rounded-full font-medium">{openEscalations}</span>
            </div>
            <div className="space-y-2">
              {mockEscalations.slice(0, 3).map((esc) => (
                <div
                  key={esc.id}
                  className="flex items-start gap-2 py-2 border-b border-border last:border-0 cursor-pointer group"
                  onClick={() => router.push('/escalation-center')}
                >
                  <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${esc.severity === 'critical' ? 'bg-error' : 'bg-warning'}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#1C1B1B] group-hover:text-primary transition-colors truncate">{esc.title}</p>
                    <p className="text-[11px] text-neutral-500">{esc.tower_name} · SLA: {esc.sla_remaining}h left</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => router.push('/escalation-center')}
              className="mt-3 text-xs text-primary font-medium hover:underline flex items-center gap-1"
            >
              View all escalations <ChevronRight size={12} />
            </button>
          </Card>
        </section>
      </div>

      {/* Recent TIC Updates */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Recent TIC Updates</h2>
          <button onClick={() => router.push('/communication-center')} className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
            View all <ChevronRight size={12} />
          </button>
        </div>
        <Card className="divide-y divide-border">
          {mockTicUpdates.slice(0, 5).map((u) => {
            const typeColors: Record<string, string> = {
              sod: 'bg-success-light text-success',
              eod: 'bg-primary-100 text-primary-600',
              risk: 'bg-warning-light text-warning',
              escalation: 'bg-error-light text-error',
              activity: 'bg-neutral-100 text-neutral-600',
              fallback: 'bg-alert-light text-alert',
            };
            const typeLabels: Record<string, string> = {
              sod: 'SoD', eod: 'EoD', risk: 'Risk', escalation: 'Escalation', activity: 'Activity', fallback: 'Fallback',
            };
            return (
              <div key={u.id} className="flex items-start gap-4 p-3 hover:bg-neutral-50 transition-colors">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded flex-shrink-0 mt-0.5 ${typeColors[u.update_type]}`}>
                  {typeLabels[u.update_type]}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-medium text-[#1C1B1B]">{u.tower_name}</span>
                    <span className="text-[11px] text-neutral-400">Fl. {u.floor}</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 truncate">{u.message}</p>
                </div>
                <div className="flex-shrink-0 text-[11px] text-neutral-400">
                  {new Date(u.submitted_at).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })}
        </Card>
      </section>
    </div>
  );
}
