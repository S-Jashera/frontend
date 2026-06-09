'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Building2,
  Layers,
  AlertTriangle,
  Clock,
  RefreshCw,
  Bell,
  ChevronDown,
  Calendar,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';
import { Card, KPICard } from '../../../components/common/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend as RechartsLegend,
} from 'recharts';
import { cn } from '../../../lib/utils';

// --- MOCK DATA ---
const mockTowers = [
  { name: 'T1', total: 40, completed: 24, active: 2, remaining: 14, activeInstances: 2, openEscalations: 0, currentActiveFloors: 'F30' },
  { name: 'T2', total: 40, completed: 24, active: 4, remaining: 12, activeInstances: 4, openEscalations: 3, currentActiveFloors: 'F25, F26' },
  { name: 'T3', total: 40, completed: 18, active: 2, remaining: 20, activeInstances: 2, openEscalations: 1, currentActiveFloors: 'F18' },
  { name: 'T4', total: 40, completed: 12, active: 1, remaining: 27, activeInstances: 1, openEscalations: 1, currentActiveFloors: 'F12' },
  { name: 'T5', total: 40, completed: 8, active: 1, remaining: 31, activeInstances: 1, openEscalations: 0, currentActiveFloors: 'F08' },
];

const mockEscalationSummary = {
  activity: 14,
  precondition: 6,
  slaBreaches: 2,
  critical: 2,
};

const mockActiveInstances = [
  { tower: 'T1', floor: 'F30', pour: 'P1', currentDay: 'Day 4', health: 82 },
  { tower: 'T2', floor: 'F25', pour: 'P1', currentDay: 'Day 5', health: 76 },
  { tower: 'T2', floor: 'F25', pour: 'P2', currentDay: 'Day 3', health: 70 },
  { tower: 'T2', floor: 'F26', pour: 'P1', currentDay: 'Day 2', health: 68 },
  { tower: 'T3', floor: 'F18', pour: 'P1', currentDay: 'Day 3', health: 62 },
  { tower: 'T4', floor: 'F12', pour: 'P1', currentDay: 'Day 2', health: 58 },
];

export default function PMDashboardPage() {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState('Reserve Kandivali');

  // Navigators
  const navigateToProjectExplorer = (towerName?: string) => {
    const params = new URLSearchParams({ project: selectedProject });
    if (towerName) params.append('tower', towerName);
    router.push(`/project-explorer?${params.toString()}`);
  };

  const navigateToEscalationCenter = (filterType: string, filterValue: string) => {
    const params = new URLSearchParams();
    params.append(filterType, filterValue);
    router.push(`/escalation-center?${params.toString()}`);
  };

  const navigateToInstanceWorkspace = (tower: string, floor: string, pour: string) => {
    const params = new URLSearchParams({
      project: selectedProject,
      tower,
      floor,
      pour,
    });
    router.push(`/instance-workspace?${params.toString()}`);
  };

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-border shadow-elevated rounded-lg text-xs z-50 min-w-[150px]">
          <p className="font-bold text-[#1C1B1B] mb-2 border-b border-border pb-1">Tower {label}</p>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-neutral-500">Total Floors:</span>
              <span className="font-medium text-[#1C1B1B]">{data.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Completed Floors:</span>
              <span className="font-medium text-success">{data.completed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Active Floors:</span>
              <span className="font-medium text-primary">{data.active}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Remaining Floors:</span>
              <span className="font-medium text-neutral-400">{data.remaining}</span>
            </div>
            <div className="mt-2 pt-1 border-t border-border flex justify-between">
              <span className="text-neutral-500">Active Instances:</span>
              <span className="font-medium text-[#1C1B1B]">{data.activeInstances}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Open Escalations:</span>
              <span className={cn("font-medium", data.openEscalations > 0 ? "text-error" : "text-success")}>
                {data.openEscalations}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Custom Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-lg font-semibold text-[#1C1B1B]">PM Dashboard</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Project Monitoring Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2 cursor-pointer hover:bg-neutral-50">
            <span className="text-xs text-neutral-500">Project</span>
            <span className="text-sm font-medium text-[#1C1B1B]">{selectedProject}</span>
            <ChevronDown size={16} className="text-neutral-400 ml-2" />
          </div>
          <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2 cursor-pointer hover:bg-neutral-50">
            <span className="text-sm font-medium text-[#1C1B1B]">22 May 2025</span>
            <Calendar size={16} className="text-neutral-400 ml-2" />
          </div>
          <button className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2 hover:bg-neutral-50 transition-colors">
            <RefreshCw size={16} className="text-neutral-600" />
            <span className="text-sm font-medium text-[#1C1B1B]">Refresh</span>
          </button>
          <button className="relative bg-white border border-border rounded-lg p-2 hover:bg-neutral-50 transition-colors">
            <Bell size={20} className="text-neutral-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full ring-2 ring-white"></span>
          </button>
          
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Active Towers"
          value={5}
          sub="Across Projects"
          icon={<Building2 size={16} />}
        />
        <KPICard
          label="Active Instances"
          value={12}
          sub="Across 5 Towers"
          variant="warning"
          icon={<Layers size={16} />}
        />
        <KPICard
          label="Open Escalations"
          value={14}
          sub="Needs Attention"
          variant="error"
          icon={<ShieldAlert size={16} />}
        />
        <KPICard
          label="SLA Breaches"
          value={2}
          sub="Require Action"
          variant="error"
          icon={<Clock size={16} />}
        />
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Section 1: Tower Progress (70%) */}
        <Card className="p-4 lg:col-span-7 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#1C1B1B] flex items-center gap-2">
              Tower Progress
              <AlertCircle size={14} className="text-neutral-400" />
            </h2>
            <div className="flex items-center gap-4 text-[11px] font-medium text-neutral-600">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-success"></div> Completed Floors</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-primary"></div> In Progress</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-neutral-200"></div> Remaining Floors</div>
            </div>
          </div>
          <div className="w-full mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={mockTowers}
                margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
                barSize={50}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={(props: any) => {
                    const { x, y, payload } = props;
                    const tower = mockTowers.find(t => t.name === payload.value);
                    const percentage = tower ? Math.round((tower.completed / tower.total) * 100) : 0;
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text x={0} y={15} dy={0} textAnchor="middle" fill="#1C1B1B" fontSize={12} fontWeight={600}>
                          {payload.value}
                        </text>
                        <text x={0} y={35} dy={0} textAnchor="middle" fill="#737373" fontSize={12} fontWeight={500}>
                          {percentage}%
                        </text>
                      </g>
                    );
                  }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#737373' }}
                  label={{ value: 'Floors', angle: 0, position: 'top', offset: 10, style: { fontSize: 11, fill: '#737373' } }}
                />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                
                <Bar 
                  dataKey="completed" 
                  stackId="a" 
                  fill="var(--color-success, #22c55e)" 
                  onClick={(data) => navigateToProjectExplorer(data.name)}
                  style={{ cursor: 'pointer' }}
                />
                <Bar 
                  dataKey="active" 
                  stackId="a" 
                  fill="var(--color-primary, #2563eb)" 
                  onClick={(data) => navigateToProjectExplorer(data.name)}
                  style={{ cursor: 'pointer' }}
                />
                <Bar 
                  dataKey="remaining" 
                  stackId="a" 
                  fill="#e5e5e5" 
                  radius={[4, 4, 0, 0]}
                  onClick={(data) => navigateToProjectExplorer(data.name)}
                  style={{ cursor: 'pointer' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <button 
              onClick={() => navigateToProjectExplorer()}
              className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
            >
              View All Towers →
            </button>
          </div>
        </Card>

        {/* Section 2: Daily Tower Summary (30%) */}
        <Card className="p-4 lg:col-span-3 flex flex-col">
          <h2 className="text-sm font-semibold text-[#1C1B1B] mb-4">Daily Tower Summary</h2>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-[11px] text-neutral-500 font-medium uppercase tracking-wide">
                  <th className="pb-3 font-medium">Tower</th>
                  <th className="pb-3 font-medium text-center">Active Instances</th>
                  <th className="pb-3 font-medium text-center">Current Active Floors</th>
                  <th className="pb-3 font-medium text-center">Open Escalations</th>
                </tr>
              </thead>
              <tbody>
                {mockTowers.map((tower, idx) => (
                  <tr 
                    key={idx} 
                    className="border-b border-border/50 hover:bg-neutral-50 cursor-pointer transition-colors text-xs"
                    onClick={() => navigateToProjectExplorer(tower.name)}
                  >
                    <td className="py-2.5 font-medium text-[#1C1B1B]">{tower.name}</td>
                    <td className="py-2.5 text-center text-neutral-600">{tower.activeInstances}</td>
                    <td className="py-2.5 text-center text-neutral-600">{tower.currentActiveFloors}</td>
                    <td className="py-2.5 text-center">
                      <span className={cn(tower.openEscalations > 0 ? "text-error font-medium" : "text-success font-medium")}>
                        {tower.openEscalations}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 pt-3 border-t border-border">
            <button 
              onClick={() => navigateToProjectExplorer()}
              className="text-[11px] text-primary font-medium hover:underline flex items-center gap-1"
            >
              View All Towers →
            </button>
          </div>
        </Card>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 3: Escalation Summary */}
        <Card className="p-4 flex flex-col">
          <h2 className="text-sm font-semibold text-[#1C1B1B] mb-4 flex items-center gap-2">
            Escalation Summary
            <AlertCircle size={14} className="text-neutral-400" />
          </h2>
          <div className="flex-1 flex flex-col justify-center gap-3">
            <div 
              className="flex items-center justify-between p-2.5 rounded-xl border border-border hover:shadow-md cursor-pointer transition-all hover:border-primary/30"
              onClick={() => navigateToEscalationCenter('type', 'Activity')}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <AlertCircle size={16} />
                </div>
                <span className="text-xs font-medium text-[#1C1B1B]">Activity Escalations</span>
              </div>
              <span className="text-base font-bold text-[#1C1B1B]">{mockEscalationSummary.activity}</span>
            </div>
            
            <div 
              className="flex items-center justify-between p-2.5 rounded-xl border border-border hover:shadow-md cursor-pointer transition-all hover:border-warning/30"
              onClick={() => navigateToEscalationCenter('type', 'Precondition')}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-warning/10 text-warning flex items-center justify-center">
                  <ShieldAlert size={16} />
                </div>
                <span className="text-xs font-medium text-[#1C1B1B]">Precondition Escalations</span>
              </div>
              <span className="text-base font-bold text-[#1C1B1B]">{mockEscalationSummary.precondition}</span>
            </div>

            <div 
              className="flex items-center justify-between p-2.5 rounded-xl border border-border hover:shadow-md cursor-pointer transition-all hover:border-error/30"
              onClick={() => navigateToEscalationCenter('status', 'Breached')}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-error/10 text-error flex items-center justify-center">
                  <Clock size={16} />
                </div>
                <span className="text-xs font-medium text-[#1C1B1B]">SLA Breaches</span>
              </div>
              <span className="text-base font-bold text-[#1C1B1B]">{mockEscalationSummary.slaBreaches}</span>
            </div>

            <div 
              className="flex items-center justify-between p-2.5 rounded-xl border border-border hover:shadow-md cursor-pointer transition-all hover:border-error/30"
              onClick={() => navigateToEscalationCenter('severity', 'Critical')}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-error text-white flex items-center justify-center">
                  <AlertTriangle size={16} />
                </div>
                <span className="text-xs font-medium text-[#1C1B1B]">Critical Escalations</span>
              </div>
              <span className="text-base font-bold text-[#1C1B1B]">{mockEscalationSummary.critical}</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border">
            <button 
              onClick={() => router.push('/escalation-center')}
              className="text-[11px] text-primary font-medium hover:underline flex items-center gap-1"
            >
              Go to Escalation Center →
            </button>
          </div>
        </Card>

        {/* Section 4: Active Instances */}
        <Card className="p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#1C1B1B] flex items-center gap-2">
              Active Instances
              <AlertCircle size={14} className="text-neutral-400" />
            </h2>
            <span className="text-[10px] font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full">
              Total: {mockActiveInstances.length}
            </span>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-[11px] text-neutral-500 font-medium uppercase tracking-wide">
                  <th className="pb-3 font-medium">Tower</th>
                  <th className="pb-3 font-medium">Floor</th>
                  <th className="pb-3 font-medium">Pour</th>
                  <th className="pb-3 font-medium">Current Day</th>
                  <th className="pb-3 font-medium text-right">Health Index</th>
                </tr>
              </thead>
              <tbody>
                {mockActiveInstances.map((instance, idx) => (
                  <tr 
                    key={idx} 
                    className="border-b border-border/50 hover:bg-neutral-50 cursor-pointer transition-colors text-xs"
                    onClick={() => navigateToInstanceWorkspace(instance.tower, instance.floor, instance.pour)}
                  >
                    <td className="py-2.5 font-medium text-[#1C1B1B]">{instance.tower}</td>
                    <td className="py-2.5 text-neutral-600">{instance.floor}</td>
                    <td className="py-2.5 text-neutral-600">{instance.pour}</td>
                    <td className="py-2.5 text-neutral-600">{instance.currentDay}</td>
                    <td className="py-2.5 text-right">
                      <span className={cn(
                        "font-medium",
                        instance.health >= 80 ? "text-success" : 
                        instance.health >= 65 ? "text-warning" : "text-error"
                      )}>
                        {instance.health}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 pt-3 border-t border-border">
            <button 
              onClick={() => router.push('/project-explorer')}
              className="text-[11px] text-primary font-medium hover:underline flex items-center gap-1"
            >
              View All Instances →
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
