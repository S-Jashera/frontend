'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '../../components/common/Card';
import { CheckCircle2, Circle, CircleDot, ChevronRight, AlertTriangle } from 'lucide-react';

interface ReadinessItem {
  label: string;
  complete: boolean;
}

interface ActivityRow {
  id: string;
  name: string;
  status: 'Complete' | 'In Progress' | 'Delayed' | 'Pending';
  owner: string;
  lastUpdated: string;
  day: number;
}

interface PreconditionRow {
  id: string;
  description: string;
  status: 'Pending' | 'Confirmed' | 'Failed';
}

interface TimelineDay {
  day: number;
  healthIndex: number;
  healthLabel: 'GREEN' | 'AMBER' | 'RED' | 'CRITICAL';
  scheduleVariance: string;
  openEscalations: number;
  pourReadiness: 'Ready' | 'Not Ready';
  activityComplete: number;
  totalActivities: number;
  onTimeRate: string;
  day4LockStatus: 'PENDING' | 'PASSED' | 'FAILED';
  day4LockItems: Array<{ id: string; status: 'complete' | 'failed' | 'pending' }>;
  ticCompliance: string;
  dayReadiness: ReadinessItem[];
  activities: ActivityRow[];
  preconditions: PreconditionRow[];
  carryForwardActivities: ActivityRow[];
  escalationActivityCount: number;
  escalationPreconditionCount: number;
}

const timeline: TimelineDay[] = [
  {
    day: 1,
    healthIndex: 74,
    healthLabel: 'AMBER',
    scheduleVariance: '-1 Days',
    openEscalations: 2,
    pourReadiness: 'Not Ready',
    activityComplete: 24,
    totalActivities: 24,
    onTimeRate: '88%',
    day4LockStatus: 'PENDING',
    day4LockItems: [
      { id: 'A07', status: 'complete' },
      { id: 'A10', status: 'pending' },
      { id: 'A15', status: 'pending' },
    ],
    ticCompliance: '82%',
    dayReadiness: [
      { label: 'Electrical Conduit Material Ready', complete: true },
      { label: 'Rebar Stock Available', complete: true },
      { label: 'Steel Fixer Gang Available', complete: true },
      { label: 'Shuttering Carpenter Gang Available', complete: false },
    ],
    activities: [
      { id: 'A01', name: 'Beam Reinforcement', status: 'Complete', owner: 'Rajesh Kumar', lastUpdated: '08:30 AM', day: 1 },
      { id: 'A02', name: 'Electrical Conduits', status: 'In Progress', owner: 'Priya Singh', lastUpdated: '09:15 AM', day: 1 },
      { id: 'A03', name: 'Slab Reinforcement', status: 'In Progress', owner: 'Arun Patel', lastUpdated: '09:45 AM', day: 1 },
      { id: 'A04', name: 'QC Inspection', status: 'Delayed', owner: 'Vikram Reddy', lastUpdated: '08:00 AM', day: 1 },
    ],
    preconditions: [
      { id: 'PRE_012', description: 'Beam and Slab Panels Ready', status: 'Pending' },
      { id: 'PRE_013', description: 'Rebar Inspection Complete', status: 'Confirmed' },
      { id: 'PRE_014', description: 'Shutter Assembly Complete', status: 'Confirmed' },
    ],
    carryForwardActivities: [
    ],
    escalationActivityCount: 2,
    escalationPreconditionCount: 1,
  },
  {
    day: 2,
    healthIndex: 77,
    healthLabel: 'AMBER',
    scheduleVariance: '0 Days',
    openEscalations: 2,
    pourReadiness: 'Not Ready',
    activityComplete: 10,
    totalActivities: 24,
    onTimeRate: '90%',
    day4LockStatus: 'PENDING',
    day4LockItems: [
      { id: 'A07', status: 'complete' },
      { id: 'A10', status: 'pending' },
      { id: 'A15', status: 'pending' },
    ],
    ticCompliance: '85%',
    dayReadiness: [
      { label: 'Electrical Conduit Material Ready', complete: true },
      { label: 'Rebar Stock Available', complete: true },
      { label: 'Steel Fixer Gang Available', complete: true },
      { label: 'Shuttering Carpenter Gang Available', complete: true },
    ],
    activities: [
      { id: 'A01', name: 'Beam Reinforcement', status: 'Complete', owner: 'Rajesh Kumar', lastUpdated: '08:30 AM', day: 2 },
      { id: 'A02', name: 'Electrical Conduits', status: 'Complete', owner: 'Priya Singh', lastUpdated: '09:15 AM', day: 2 },
      { id: 'A03', name: 'Slab Reinforcement', status: 'In Progress', owner: 'Arun Patel', lastUpdated: '09:45 AM', day: 2 },
      { id: 'A04', name: 'QC Inspection', status: 'Delayed', owner: 'Vikram Reddy', lastUpdated: '08:00 AM', day: 2 },
    ],
    preconditions: [
      { id: 'PRE_012', description: 'Beam and Slab Panels Ready', status: 'Confirmed' },
      { id: 'PRE_013', description: 'Rebar Inspection Complete', status: 'Confirmed' },
      { id: 'PRE_014', description: 'Shutter Assembly Complete', status: 'Confirmed' },
    ],
    carryForwardActivities: [],
    escalationActivityCount: 1,
    escalationPreconditionCount: 0,
  },
  {
    day: 3,
    healthIndex: 82,
    healthLabel: 'AMBER',
    scheduleVariance: '0 Days',
    openEscalations: 2,
    pourReadiness: 'Not Ready',
    activityComplete: 15,
    totalActivities: 24,
    onTimeRate: '92%',
    day4LockStatus: 'FAILED',
    day4LockItems: [
      { id: 'A07', status: 'complete' },
      { id: 'A10', status: 'complete' },
      { id: 'A15', status: 'failed' },
    ],
    ticCompliance: '88%',
    dayReadiness: [
      { label: 'Electrical Conduit Material Ready', complete: true },
      { label: 'Rebar Stock Available', complete: true },
      { label: 'Steel Fixer Gang Available', complete: true },
      { label: 'Shuttering Carpenter Gang Available', complete: true },
    ],
    activities: [
      { id: 'A11', name: 'Beam Reinforcement', status: 'Complete', owner: 'Rajesh Kumar', lastUpdated: '08:30 AM', day: 3 },
      { id: 'A12', name: 'Electrical Conduits', status: 'Complete', owner: 'Priya Singh', lastUpdated: '09:15 AM', day: 3 },
      { id: 'A13', name: 'Slab Reinforcement', status: 'In Progress', owner: 'Arun Patel', lastUpdated: '09:45 AM', day: 3 },
      { id: 'A14', name: 'QC Inspection', status: 'Delayed', owner: 'Vikram Reddy', lastUpdated: '08:00 AM', day: 3 },
    ],
    preconditions: [
      { id: 'PRE_012', description: 'Beam and Slab Panels Ready', status: 'Confirmed' },
      { id: 'PRE_013', description: 'Rebar Inspection Complete', status: 'Confirmed' },
      { id: 'PRE_014', description: 'Shutter Assembly Complete', status: 'Pending' },
    ],
    carryForwardActivities: [
      { id: 'A00', name: 'Final Safety Check', status: 'Delayed', owner: 'Safety Team', lastUpdated: 'Day 1', day: 1 },
    ],
    escalationActivityCount: 3,
    escalationPreconditionCount: 1,
  },
  {
    day: 4,
    healthIndex: 84,
    healthLabel: 'AMBER',
    scheduleVariance: '+0 Days',
    openEscalations: 1,
    pourReadiness: 'Not Ready',
    activityComplete: 18,
    totalActivities: 24,
    onTimeRate: '93%',
    day4LockStatus: 'FAILED',
    day4LockItems: [
      { id: 'A07', status: 'complete' },
      { id: 'A10', status: 'complete' },
      { id: 'A15', status: 'failed' },
    ],
    ticCompliance: '91%',
    dayReadiness: [
      { label: 'Electrical Conduit Material Ready', complete: true },
      { label: 'Rebar Stock Available', complete: true },
      { label: 'Steel Fixer Gang Available', complete: true },
      { label: 'Shuttering Carpenter Gang Available', complete: true },
    ],
    activities: [
      { id: 'A11', name: 'Beam Reinforcement', status: 'Complete', owner: 'Rajesh Kumar', lastUpdated: '08:30 AM', day: 4 },
      { id: 'A12', name: 'Electrical Conduits', status: 'Complete', owner: 'Priya Singh', lastUpdated: '09:15 AM', day: 4 },
      { id: 'A13', name: 'Slab Reinforcement', status: 'Complete', owner: 'Arun Patel', lastUpdated: '09:45 AM', day: 4 },
      { id: 'A14', name: 'QC Inspection', status: 'In Progress', owner: 'Vikram Reddy', lastUpdated: '10:00 AM', day: 4 },
    ],
    preconditions: [
      { id: 'PRE_012', description: 'Beam and Slab Panels Ready', status: 'Confirmed' },
      { id: 'PRE_013', description: 'Rebar Inspection Complete', status: 'Confirmed' },
      { id: 'PRE_014', description: 'Shutter Assembly Complete', status: 'Confirmed' },
    ],
    carryForwardActivities: [],
    escalationActivityCount: 1,
    escalationPreconditionCount: 0,
  },
  {
    day: 5,
    healthIndex: 88,
    healthLabel: 'AMBER',
    scheduleVariance: '+1 Days',
    openEscalations: 1,
    pourReadiness: 'Ready',
    activityComplete: 20,
    totalActivities: 24,
    onTimeRate: '95%',
    day4LockStatus: 'PASSED',
    day4LockItems: [
      { id: 'A07', status: 'complete' },
      { id: 'A10', status: 'complete' },
      { id: 'A15', status: 'complete' },
    ],
    ticCompliance: '93%',
    dayReadiness: [
      { label: 'Pump Ready', complete: true },
      { label: 'Labour Available', complete: true },
      { label: 'RMC Confirmed', complete: true },
      { label: 'QC Pre-Pour Card Signed', complete: true },
    ],
    activities: [
      { id: 'A11', name: 'Beam Reinforcement', status: 'Complete', owner: 'Rajesh Kumar', lastUpdated: '08:30 AM', day: 5 },
      { id: 'A12', name: 'Electrical Conduits', status: 'Complete', owner: 'Priya Singh', lastUpdated: '09:15 AM', day: 5 },
      { id: 'A13', name: 'Slab Reinforcement', status: 'Complete', owner: 'Arun Patel', lastUpdated: '09:45 AM', day: 5 },
      { id: 'A14', name: 'QC Inspection', status: 'Complete', owner: 'Vikram Reddy', lastUpdated: '10:00 AM', day: 5 },
    ],
    preconditions: [
      { id: 'PRE_012', description: 'Beam and Slab Panels Ready', status: 'Confirmed' },
      { id: 'PRE_013', description: 'Rebar Inspection Complete', status: 'Confirmed' },
      { id: 'PRE_014', description: 'Shutter Assembly Complete', status: 'Confirmed' },
    ],
    carryForwardActivities: [],
    escalationActivityCount: 0,
    escalationPreconditionCount: 0,
  },
  {
    day: 6,
    healthIndex: 91,
    healthLabel: 'AMBER',
    scheduleVariance: '+1 Days',
    openEscalations: 1,
    pourReadiness: 'Ready',
    activityComplete: 22,
    totalActivities: 24,
    onTimeRate: '96%',
    day4LockStatus: 'PASSED',
    day4LockItems: [
      { id: 'A07', status: 'complete' },
      { id: 'A10', status: 'complete' },
      { id: 'A15', status: 'complete' },
    ],
    ticCompliance: '95%',
    dayReadiness: [
      { label: 'Pump Ready', complete: true },
      { label: 'Labour Available', complete: true },
      { label: 'RMC Confirmed', complete: true },
      { label: 'QC Pre-Pour Card Signed', complete: true },
    ],
    activities: [
      { id: 'A11', name: 'Beam Reinforcement', status: 'Complete', owner: 'Rajesh Kumar', lastUpdated: '08:30 AM', day: 6 },
      { id: 'A12', name: 'Electrical Conduits', status: 'Complete', owner: 'Priya Singh', lastUpdated: '09:15 AM', day: 6 },
      { id: 'A13', name: 'Slab Reinforcement', status: 'Complete', owner: 'Arun Patel', lastUpdated: '09:45 AM', day: 6 },
      { id: 'A14', name: 'QC Inspection', status: 'Complete', owner: 'Vikram Reddy', lastUpdated: '10:00 AM', day: 6 },
    ],
    preconditions: [
      { id: 'PRE_012', description: 'Beam and Slab Panels Ready', status: 'Confirmed' },
      { id: 'PRE_013', description: 'Rebar Inspection Complete', status: 'Confirmed' },
      { id: 'PRE_014', description: 'Shutter Assembly Complete', status: 'Confirmed' },
    ],
    carryForwardActivities: [],
    escalationActivityCount: 0,
    escalationPreconditionCount: 0,
  },
  {
    day: 7,
    healthIndex: 94,
    healthLabel: 'GREEN',
    scheduleVariance: '+1 Days',
    openEscalations: 0,
    pourReadiness: 'Ready',
    activityComplete: 24,
    totalActivities: 24,
    onTimeRate: '98%',
    day4LockStatus: 'PASSED',
    day4LockItems: [
      { id: 'A07', status: 'complete' },
      { id: 'A10', status: 'complete' },
      { id: 'A15', status: 'complete' },
    ],
    ticCompliance: '97%',
    dayReadiness: [
      { label: 'Pump Ready', complete: true },
      { label: 'Labour Available', complete: true },
      { label: 'RMC Confirmed', complete: true },
      { label: 'QC Pre-Pour Card Signed', complete: true },
    ],
    activities: [
      { id: 'A11', name: 'Beam Reinforcement', status: 'Complete', owner: 'Rajesh Kumar', lastUpdated: '08:30 AM', day: 7 },
      { id: 'A12', name: 'Electrical Conduits', status: 'Complete', owner: 'Priya Singh', lastUpdated: '09:15 AM', day: 7 },
      { id: 'A13', name: 'Slab Reinforcement', status: 'Complete', owner: 'Arun Patel', lastUpdated: '09:45 AM', day: 7 },
      { id: 'A14', name: 'QC Inspection', status: 'Complete', owner: 'Vikram Reddy', lastUpdated: '10:00 AM', day: 7 },
    ],
    preconditions: [
      { id: 'PRE_012', description: 'Beam and Slab Panels Ready', status: 'Confirmed' },
      { id: 'PRE_013', description: 'Rebar Inspection Complete', status: 'Confirmed' },
      { id: 'PRE_014', description: 'Shutter Assembly Complete', status: 'Confirmed' },
    ],
    carryForwardActivities: [],
    escalationActivityCount: 0,
    escalationPreconditionCount: 0,
  },
];

export default function InstanceWorkspacePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDay, setSelectedDay] = useState(3);
  const [activityView, setActivityView] = useState<'current' | 'all'>('current');

  const ACTUAL_CURRENT_DAY = 3; // Fixed current day for this instance

  useEffect(() => {
    const dayParam = Number(searchParams.get('day'));
    if (dayParam >= 1 && dayParam <= timeline.length) {
      setSelectedDay(dayParam);
    }
  }, [searchParams]);

  // Calculate timeline status based on execution status, not selection
  const getTimelineStatus = (day: number) => {
    if (day === ACTUAL_CURRENT_DAY) return 'blue'; // Current execution day
    if (day < ACTUAL_CURRENT_DAY) {
      const dayData = timeline[day - 1];
      if (dayData && dayData.carryForwardActivities.length === 0 && dayData.activityComplete === dayData.totalActivities) {
        return 'green'; // All complete, no carry forward
      }
      return 'amber'; // Completed but has carry forward or incomplete
    }
    return 'grey'; // Future day
  };

  // Calculate carry forward activities for a specific day
  const calculateCarryForwardForDay = (day: number) => {
    const carryForward: ActivityRow[] = [];
    for (let d = 1; d < day; d++) {
      const dayData = timeline[d - 1];
      if (dayData) {
        dayData.activities.forEach((activity) => {
          if (activity.status !== 'Complete') {
            carryForward.push(activity);
          }
        });
      }
    }
    return carryForward;
  };

  const projectLabel = useMemo(() => {
    const param = searchParams.get('project');
    return param ? param.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : 'Reserve Kandivali';
  }, [searchParams]);

  const towerLabel = useMemo(() => {
    const param = searchParams.get('tower');
    return param ? param.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : 'Tower T2';
  }, [searchParams]);

  const floorLabel = useMemo(() => {
    const param = searchParams.get('floor');
    return param ? `Floor ${param}` : 'Floor 24';
  }, [searchParams]);

  const pourLabel = useMemo(() => {
    const param = searchParams.get('pour');
    if (!param) return 'P01-Core';
    return param
      .split('-')
      .map((part) => (part.toUpperCase().startsWith('P') ? part.toUpperCase() : part.charAt(0).toUpperCase() + part.slice(1)))
      .join('-');
  }, [searchParams]);

  const activeData = useMemo(
    () => timeline.find((item) => item.day === selectedDay) ?? timeline[2],
    [selectedDay]
  );

  const healthColor = (index: number) => {
    if (index >= 85) return 'text-success';
    if (index >= 70) return 'text-warning';
    if (index >= 50) return 'text-error';
    return 'text-error';
  };

  const healthBgColor = (index: number) => {
    if (index >= 85) return 'bg-success/10';
    if (index >= 70) return 'bg-warning/10';
    if (index >= 50) return 'bg-error/10';
    return 'bg-error/10';
  };

  const currentDayActivities = activeData.activities.filter((a) => a.day === selectedDay);
  const displayedActivities = activityView === 'current' ? currentDayActivities : activeData.activities;

  const getDisplayedStatus = (activity: ActivityRow) => {
    if (activity.day > ACTUAL_CURRENT_DAY) return 'Not Started';
    return activity.status;
  };

  const statusColor = (activity: ActivityRow) => {
    const status = getDisplayedStatus(activity);
    switch (status) {
      case 'Complete':
        return 'text-success';
      case 'In Progress':
        return 'text-primary';
      case 'Delayed':
        return 'text-error';
      case 'Pending':
        return 'text-warning';
      case 'Not Started':
        return 'text-neutral-400';
      default:
        return 'text-neutral-600';
    }
  };

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-[1600px] space-y-5">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-[#1C1B1B]">
            {projectLabel} {'>'}  {towerLabel} {'>'}  {floorLabel} {'>'}  {pourLabel}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-neutral-600">
              Current Day: <span className="font-medium text-[#1C1B1B]">Day {ACTUAL_CURRENT_DAY} of {timeline.length}</span>
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${healthBgColor(activeData.healthIndex)}`}>
              <span className="h-1.5 w-1.5 rounded-full" style={{
                backgroundColor: activeData.healthIndex >= 85 ? '#10b981' : activeData.healthIndex >= 70 ? '#f59e0b' : '#ef4444'
              }}></span>
              <span className={healthColor(activeData.healthIndex)}>
                Health: {activeData.healthIndex}%
              </span>
            </span>
          </div>
        </div>

          {/* Compact Timeline */}
        <Card className="p-3">
          <div className="flex items-center justify-start gap-0 overflow-x-auto pb-1">
            {timeline.map((step, idx) => {
              const status = getTimelineStatus(step.day);
              const isSelected = step.day === selectedDay;

              let statusClasses = '';
              let statusIcon = '';

              if (status === 'green') {
                statusClasses = 'border-success text-success';
                statusIcon = '✓';
              } else if (status === 'amber') {
                statusClasses = 'border-warning text-warning';
                statusIcon = '◆';
              } else if (status === 'blue') {
                statusClasses = 'border-primary text-primary';
                statusIcon = '●';
              } else {
                statusClasses = 'border-neutral-300 text-neutral-400';
                statusIcon = '○';
              }

              return (
                <div key={step.day} className="flex items-center gap-0 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedDay(step.day)}
                    className="flex flex-col items-center gap-1.5 px-2 py-1 rounded transition hover:bg-neutral-50"
                    title={`Day ${step.day}`}
                  >
                    <span className="text-[10px] font-semibold text-neutral-600">D{step.day}</span>
                    <div className={`flex items-center justify-center w-5 h-5 rounded-full border text-[9px] font-bold transition ${
                      isSelected
                        ? `${statusClasses} ring-1 ring-offset-1`
                        : statusClasses
                    }`}>
                      {statusIcon}
                    </div>
                  </button>
                  {idx < timeline.length - 1 && (
                    <div className="flex items-center gap-0 px-1 flex-shrink-0">
                      <div className="w-6 h-px bg-neutral-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Layout Grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          {/* Left Column */}
          <div className="space-y-5">
            {/* Section 1: Day Readiness */}
            <Card className="p-4">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h2 className="text-sm font-semibold text-[#1C1B1B]">Day {selectedDay} Readiness</h2>
                <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${activeData.dayReadiness.every((item) => item.complete) ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                  {activeData.dayReadiness.every((item) => item.complete) ? 'READY' : 'NOT READY'}
                </span>
              </div>
              <div className="space-y-2">
                {activeData.dayReadiness.map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm text-neutral-600">
                    <span className={item.complete ? 'text-success' : 'text-error'}>
                      {item.complete ? '✓' : '✕'}
                    </span>
                    <span className={item.complete ? 'text-neutral-600' : 'text-error'}>{item.label}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Section 2: Preconditions to Confirm */}
            <Card className="overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h2 className="text-sm font-semibold text-[#1C1B1B]">Preconditions to Confirm Today</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-border">
                      {['Pre ID', 'Check Name', 'Status'].map((heading) => (
                        <th
                          key={heading}
                          className="px-4 py-2 text-left text-[10px] font-semibold text-neutral-500 uppercase tracking-wide whitespace-nowrap"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {activeData.preconditions.map((item) => (
                      <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-4 py-2.5 text-neutral-600 font-mono text-[10px]">{item.id}</td>
                        <td className="px-4 py-2.5 text-neutral-600 text-xs">{item.description}</td>
                        <td className={`px-4 py-2.5 font-medium text-xs ${item.status === 'Confirmed' ? 'text-success' : item.status === 'Failed' ? 'text-error' : 'text-warning'}`}>
                          {item.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Section 3: Day N Activities */}
            <Card className="overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h2 className="text-sm font-semibold text-[#1C1B1B]">Day {selectedDay} Activities</h2>
                  {selectedDay > ACTUAL_CURRENT_DAY && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-500">
                      FUTURE DAY
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-neutral-500">{currentDayActivities.length} activities</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-border">
                      {['Activity ID', 'Activity Name', 'Status', 'Owner', 'Last Updated'].map((heading) => (
                        <th
                          key={heading}
                          className="px-4 py-2 text-left text-[10px] font-semibold text-neutral-500 uppercase tracking-wide whitespace-nowrap"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {currentDayActivities.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-3 text-center text-neutral-400 text-xs">
                          No activities for this day
                        </td>
                      </tr>
                    ) : (
                      currentDayActivities.map((activity) => (
                        <tr 
                          key={activity.id} 
                          className={`${selectedDay > ACTUAL_CURRENT_DAY ? 'bg-neutral-50' : 'hover:bg-neutral-50'} transition-colors`}
                        >
                          <td className={`px-4 py-2.5 font-mono text-[10px] ${selectedDay > ACTUAL_CURRENT_DAY ? 'text-neutral-400' : 'text-neutral-600'}`}>
                            {activity.id}
                          </td>
                          <td className={`px-4 py-2.5 text-xs ${selectedDay > ACTUAL_CURRENT_DAY ? 'text-neutral-400' : 'text-neutral-600'}`}>
                            {activity.name}
                          </td>
                          <td className={`px-4 py-2.5 font-medium text-xs ${selectedDay > ACTUAL_CURRENT_DAY ? 'text-neutral-400' : statusColor(activity)}`}>
                            {getDisplayedStatus(activity)}
                          </td>
                          <td className={`px-4 py-2.5 text-xs ${selectedDay > ACTUAL_CURRENT_DAY ? 'text-neutral-400' : 'text-neutral-600'}`}>
                            {activity.owner}
                          </td>
                          <td className={`px-4 py-2.5 text-xs ${selectedDay > ACTUAL_CURRENT_DAY ? 'text-neutral-400' : 'text-neutral-500'}`}>
                            {activity.lastUpdated}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Section 4: Activity View Toggle */}
            {timeline.some(day => day.activities.length > 0) && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActivityView('current')}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition ${
                    activityView === 'current'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-white text-neutral-600 hover:border-primary/50'
                  }`}
                >
                  Current Day Activities
                </button>
                <button
                  type="button"
                  onClick={() => setActivityView('all')}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition ${
                    activityView === 'all'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-white text-neutral-600 hover:border-primary/50'
                  }`}
                >
                  All Activities
                </button>
              </div>
            )}

            {/* Section 4b: All Activities (if toggled) */}
            {activityView === 'all' && (
              <div className="space-y-4">
                {timeline.map((dayData) => (
                  dayData.activities.length > 0 && (
                    <Card key={`activities-day-${dayData.day}`} className="overflow-hidden">
                      <div className="px-4 py-3 border-b border-border bg-neutral-50">
                        <h3 className="text-xs font-semibold text-[#1C1B1B] uppercase tracking-wide">Day {dayData.day}</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-neutral-50 border-b border-border">
                              {['Activity ID', 'Activity Name', 'Status', 'Owner', 'Last Updated'].map((heading) => (
                                <th
                                  key={heading}
                                  className="px-4 py-2 text-left text-[10px] font-semibold text-neutral-500 uppercase tracking-wide whitespace-nowrap"
                                >
                                  {heading}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {dayData.activities.map((activity) => (
                              <tr key={activity.id} className="hover:bg-neutral-50 transition-colors">
                                <td className="px-4 py-2.5 text-neutral-600 font-mono text-[10px]">{activity.id}</td>
                                <td className="px-4 py-2.5 text-neutral-600 text-xs">{activity.name}</td>
                                <td className={`px-4 py-2.5 font-medium text-xs ${statusColor(activity)}`}>
                                  {getDisplayedStatus(activity)}
                                </td>
                                <td className="px-4 py-2.5 text-neutral-600 text-xs">{activity.owner}</td>
                                <td className="px-4 py-2.5 text-neutral-500 text-xs">{activity.lastUpdated}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  )
                ))}
              </div>
            )}

            {/* Section 5: Carry Forward Activities */}
            {activeData.carryForwardActivities.length > 0 && selectedDay <= ACTUAL_CURRENT_DAY && (
              <Card className="overflow-hidden">
                <div className="px-4 py-3 border-b border-border bg-error/5">
                  <h2 className="text-sm font-semibold text-error flex items-center gap-2">
                    <AlertTriangle size={14} /> Carry Forward Activities
                  </h2>
                  <p className="text-[11px] text-neutral-500">{activeData.carryForwardActivities.length} from previous days</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-border">
                        {['Activity ID', 'Activity Name', 'Original Day', 'Status'].map((heading) => (
                          <th
                            key={heading}
                            className="px-4 py-2 text-left text-[10px] font-semibold text-neutral-500 uppercase tracking-wide whitespace-nowrap"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {activeData.carryForwardActivities.map((activity) => (
                        <tr key={activity.id} className="hover:bg-neutral-50 transition-colors bg-error/5">
                          <td className="px-4 py-2.5 text-neutral-600 font-mono text-[10px]">{activity.id}</td>
                          <td className="px-4 py-2.5 text-neutral-600 text-xs">{activity.name}</td>
                          <td className="px-4 py-2.5 text-neutral-600 text-xs font-medium">Day {activity.day}</td>
                          <td className="px-4 py-2.5 font-medium text-xs text-error">{activity.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Section 6: Escalation Summary */}
            <Card className="p-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <p className="text-[11px] uppercase tracking-wide text-neutral-500 font-semibold">Escalation Summary</p>
                  <div className="text-xs space-y-1 text-neutral-600">
                    <p>Activity Escalations: <span className="font-semibold text-[#1C1B1B]">{activeData.escalationActivityCount}</span></p>
                    <p>Precondition Escalations: <span className="font-semibold text-[#1C1B1B]">{activeData.escalationPreconditionCount}</span></p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const query = new URLSearchParams({
                      project: projectLabel,
                      tower: towerLabel,
                      floor: floorLabel.replace(/^Floor\s*/i, ''),
                      pour: pourLabel,
                    }).toString();
                    router.push(`/escalation-center?${query}`);
                  }}
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:underline whitespace-nowrap"
                >
                  View Escalation Center <ChevronRight size={12} />
                </button>
              </div>
            </Card>
          </div>

          {/* Right Column - Sticky Insight Rail */}
          <aside className="space-y-4 lg:sticky lg:top-6 lg:max-h-[calc(100vh-32px)] lg:overflow-y-auto">
            {/* Health Index */}
            <Card className="p-4">
              <div className="flex flex-col items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className={`text-4xl font-bold ${healthColor(activeData.healthIndex)}`}>
                    {activeData.healthIndex}%
                  </div>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${healthBgColor(activeData.healthIndex)}`}>
                   
                  </span>
                </div>
                <div className="w-full h-px bg-border"></div>
                <div className="w-full space-y-2 text-xs">
                  <div className="flex items-center justify-between text-neutral-600">
                    <span>Activity Completion</span>
                    <span className="font-semibold text-[#1C1B1B]">{activeData.activityComplete}/{activeData.totalActivities}</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-600">
                    <span>On-Time Rate</span>
                    <span className="font-semibold text-[#1C1B1B]">{activeData.onTimeRate}</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-600">
                    <span>Day-4 Lock</span>
                    <span className={`font-semibold ${activeData.day4LockStatus === 'PASSED' ? 'text-success' : activeData.day4LockStatus === 'FAILED' ? 'text-warning' : 'text-warning'}`}>
                      {activeData.day4LockStatus === 'FAILED' ? 'INCOMPLETE' : activeData.day4LockStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-600">
                    <span>TIC Compliance</span>
                    <span className="font-semibold text-[#1C1B1B]">{activeData.ticCompliance}</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-600">
                    <span>Schedule Variance</span>
                    <span className="font-semibold text-[#1C1B1B]">{activeData.scheduleVariance}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Day-4 Lock - visible only if not passed */}
            {activeData.day4LockStatus !== 'PASSED' && selectedDay <= ACTUAL_CURRENT_DAY && (
              <Card className="p-4">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[#1C1B1B]">Day-4 Lock</h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${activeData.day4LockStatus === 'FAILED' ? 'bg-warning/10 text-warning' : 'bg-warning/10 text-warning'}`}>
                    {activeData.day4LockStatus === 'FAILED' ? 'INCOMPLETE' : activeData.day4LockStatus}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-neutral-600">
                  {activeData.day4LockItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <span className="font-mono">{item.id}</span>
                      <span className={item.status === 'complete' ? 'text-success font-semibold' : item.status === 'failed' ? 'text-error font-semibold' : 'text-warning'}>
                        {item.status === 'complete' ? '✓' : item.status === 'failed' ? '✕' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Pour Readiness - visible only if not ready and not future day */}
            {activeData.pourReadiness === 'Not Ready' && selectedDay <= ACTUAL_CURRENT_DAY && (
              <Card className="p-4">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[#1C1B1B]">Pour Readiness</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-warning/10 text-warning">
                    NOT READY
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-neutral-600">
                  {activeData.dayReadiness.map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span>{item.label}</span>
                      <span className={item.complete ? 'text-success font-semibold' : 'text-error font-semibold'}>
                        {item.complete ? '✓' : '✕'}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
