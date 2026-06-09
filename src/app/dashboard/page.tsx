'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { normalizeFilterParam } from '../../lib/cascadingFilters';
import {
  Building,
  Building2,
  Layers,
  AlertTriangle,
  ShieldAlert,
  Clock,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { Card, KPICard } from '../../components/common/Card';
import { mockTowers, mockEscalations } from '../../data/mock';
import type { Tower } from '../../types';
import { BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

function Legend() {
  return (
    <div className="flex items-center gap-4 text-[11px] text-neutral-500">
      <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-success"></div> Completed</div>
      <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-primary"></div> In Progress</div>
      <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-neutral-200"></div> Not Started</div>
    </div>
  );
}

function TowerCard({
  tower,
  onOpen,
}: {
  tower: Tower;
  onOpen: () => void;
}) {
  const router = useRouter();
  const totalFloors = 20;

  // Derive P1 and P2 active floors based on tower state
  const p1ActiveFloor = Math.min(20, tower.active_pour === 1 ? tower.active_floor : tower.active_floor + 1);
  const p2ActiveFloor = Math.max(1, tower.active_pour === 1 ? tower.active_floor - 1 : tower.active_floor);

  const p1Completed = Math.max(0, p1ActiveFloor - 1);
  const p1Current = p1Completed < 20 ? 1 : 0;
  const p1Remaining = 20 - p1Completed - p1Current;

  const p2Completed = Math.max(0, p2ActiveFloor - 1);
  const p2Current = p2Completed < 20 ? 1 : 0;
  const p2Remaining = 20 - p2Completed - p2Current;

  const data = [
    {
      name: 'P1',
      completed: p1Completed,
      current: p1Current,
      remaining: p1Remaining,
      activeFloor: p1ActiveFloor,
    },
    {
      name: 'P2',
      completed: p2Completed,
      current: p2Current,
      remaining: p2Remaining,
      activeFloor: p2ActiveFloor,
    },
  ];

  const overallCompleted = Math.max(0, tower.active_floor - 1);
  const completionPercentage = Math.round((overallCompleted / totalFloors) * 100);

  const activityEscalations = tower.open_risks;
  const preconditionEscalations = Math.floor(tower.open_risks / 2);

  const [hoveredSection, setHoveredSection] = useState<{ bar: string, key: string } | null>(null);

  const handleBarClick = (dataKey: string, payload: any) => {
    if (dataKey === 'current') {
      const query = new URLSearchParams({
        project: normalizeFilterParam(tower.project),
        tower: normalizeFilterParam(tower.name),
      }).toString();
      router.push(`/project-explorer?${query}`);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      if (!hoveredSection || hoveredSection.bar !== label) return null;

      const dataObj = payload[0].payload;
      const key = hoveredSection.key;

      if (key === 'completed') {
        const comp = dataObj.completed;
        return (
          <div className="bg-white p-2 border border-border shadow-md rounded text-xs z-50 relative">
            <p className="font-semibold mb-1">Completed Floors</p>
            {comp > 0 ? <p>F01 – F{comp.toString().padStart(2, '0')}</p> : <p>None</p>}
          </div>
        );
      }
      
      if (key === 'current') {
        return (
          <div className="bg-white p-2 border border-border shadow-md rounded text-xs z-50 relative">
            <p className="font-semibold mb-1">Pour: {label}</p>
            <p>Current Floor: F{dataObj.activeFloor.toString().padStart(2, '0')}</p>
            <p>Current Day: Day {tower.current_day}</p>
            <p>Health Index: {tower.health === 'good' ? '100%' : '82%'}</p>
          </div>
        );
      }

      if (key === 'remaining') {
        const comp = dataObj.completed;
        const cur = dataObj.current;
        const start = comp + cur + 1;
        return (
          <div className="bg-white p-2 border border-border shadow-md rounded text-xs z-50 relative">
            <p className="font-semibold mb-1">Pending Floors</p>
            {start <= 20 ? <p>F{start.toString().padStart(2, '0')} – F20</p> : <p>None</p>}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <Card hover className="p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[#1C1B1B]">
            {tower.name}
          </h3>
          <p className="text-[11px] text-neutral-400">
            {tower.project}
          </p>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          completionPercentage === 100 ? 'bg-success-light text-success' :
          completionPercentage > 50 ? 'bg-success-light text-success' :
          completionPercentage > 25 ? 'bg-warning-light text-warning' :
          'bg-error-light text-error'
        }`}>
          {completionPercentage}%
        </span>
      </div>

      {/* Chart visualization */}
      <div className="flex-1 mb-4 h-[160px] min-h-[160px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={45} margin={{ top: 0, right: 90, bottom: 0, left: 90 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#737373' }} />
            <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} isAnimationActive={false} />
            <Bar 
              dataKey="completed" 
              stackId="a" 
              fill="var(--color-success, #22c55e)" 
              onMouseEnter={(data) => setHoveredSection({ bar: data.payload?.name || data.name, key: 'completed' })}
              onMouseLeave={() => setHoveredSection(null)}
            />
            <Bar 
              dataKey="current" 
              stackId="a" 
              fill="var(--color-primary, #2563eb)" 
              onClick={(data) => handleBarClick('current', data)}
              style={{ cursor: 'pointer' }}
              onMouseEnter={(data) => setHoveredSection({ bar: data.payload?.name || data.name, key: 'current' })}
              onMouseLeave={() => setHoveredSection(null)}
            />
            <Bar 
              dataKey="remaining" 
              stackId="a" 
              fill="#e5e5e5" 
              onMouseEnter={(data) => setHoveredSection({ bar: data.payload?.name || data.name, key: 'remaining' })}
              onMouseLeave={() => setHoveredSection(null)}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info */}
      <div className="text-[11px] font-medium text-[#1C1B1B] mb-2">Completion: {completionPercentage}%</div>
      <div className="text-[11px] text-neutral-500 mb-4">Completed Floors: {overallCompleted} / {totalFloors}</div>

      <div className="grid grid-cols-2 gap-y-2 text-[11px] mb-4">
        <div className="text-neutral-500">P1 Active Floor</div>
        <div className="font-medium text-[#1C1B1B]">F{p1ActiveFloor.toString().padStart(2, '0')}</div>
        
        <div className="text-neutral-500">P2 Active Floor</div>
        <div className="font-medium text-[#1C1B1B]">F{p2ActiveFloor.toString().padStart(2, '0')}</div>
      </div>

      <div className="grid grid-cols-2 gap-y-2 text-[11px] mb-4">
        <div className="text-neutral-500">Activity Escalations</div>
        <div className="font-medium text-error">{activityEscalations}</div>
        
        <div className="text-neutral-500">Precondition Escalations</div>
        <div className="font-medium text-warning">{preconditionEscalations}</div>
      </div>

      <div className="border-t border-border pt-3 mt-auto cursor-pointer group" onClick={onOpen}>
        <p className="text-[11px] text-primary font-medium group-hover:underline">
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

function PendingUpdatesWidget({ router }: { router: any }) {
  const instanceUpdates = [
    { project: 'Reserve Kandivali', tower: 'Reserve T2', floor: 14, pour: 1, type: 'EoD Missing', time: '2h ago', status: 'missing' as const },
    { project: 'Reserve Kandivali', tower: 'Reserve T2', floor: 15, pour: 2, type: 'SoD Pending', time: '3h ago', status: 'pending' as const },
    { project: 'Ascend Thane', tower: 'Ascend T1', floor: 18, pour: 1, type: 'No Update > 4h', time: '4h ago', status: 'overdue' as const },
    { project: 'Pinnacle Borivali', tower: 'Pinnacle T3', floor: 5, pour: 2, type: 'EoD Missing', time: '5h ago', status: 'missing' as const },
    { project: 'Ascend Thane', tower: 'Ascend T2', floor: 12, pour: 1, type: 'SoD Missing', time: '6h ago', status: 'missing' as const },
  ];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#1C1B1B]">Pending Updates <span className="ml-2 text-xs bg-error-light text-error px-2 py-0.5 rounded-full font-medium">{instanceUpdates.length}</span></h3>
        <span className="text-[11px] text-primary cursor-pointer hover:underline">View All</span>
      </div>
      <div className="space-y-3">
        {instanceUpdates.map((u, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-error-light text-error`}>
                <Clock size={14} />
              </div>
              <div>
                <p className="text-xs font-medium text-[#1C1B1B]">{u.tower} {'>'} F{u.floor.toString().padStart(2, '0')} {'>'} P{u.pour.toString().padStart(2, '0')}</p>
                <p className={`text-[11px] font-medium ${u.status === 'pending' ? 'text-warning' : 'text-error'}`}>{u.type}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="text-[10px] text-neutral-400">
                {u.time}
              </div>
              <div 
                className="text-[10px] text-primary font-medium cursor-pointer hover:underline"
                onClick={() => {
                  const query = new URLSearchParams({
                    project: normalizeFilterParam(u.project),
                    tower: normalizeFilterParam(u.tower),
                  }).toString();
                  router.push(`/project-explorer?${query}`);
                }}
              >
                Open →
              </div>
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
            icon={<Building size={14} />}
          />

          <KPICard
            label="Active Towers"
            value={9}
            icon={<Building2 size={14} />}
          />

          <KPICard
            label="Active Instances"
            value={14}
            icon={<Layers size={14} />}
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
            icon={<ShieldAlert size={14} />}
          />

          <KPICard
            label="Pending Updates"
            value={5}
            variant="error"
            icon={<Clock size={14} />}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Projects & Towers */}
        <section className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#1C1B1B]">Towers Overview</h2>
            <Legend />
          </div>
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
        <section className="lg:col-span-1 space-y-4">
          <PendingUpdatesWidget router={router} />
        </section>
      </div>
    </div>
  );
}
