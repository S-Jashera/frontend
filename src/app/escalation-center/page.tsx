'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, ChevronRight, Clock, AlertTriangle, X } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { SeverityBadge } from '../../components/common/StatusBadge';
import { mockEscalations, mockTowers, mockTicUpdates } from '../../data/mock';
import type { Escalation } from '../../types';
import {
  getFloorLabelFromParam,
  getPourLabelFromParam,
  getProjectLabelFromParam,
  getTowerIdFromParam,
} from '../../lib/cascadingFilters';

type EscalationFilterType = 'all' | 'activity' | 'precondition';

interface EscalationRow extends Escalation {
  project: string;
  floor: string;
  pour: string;
  escalationType: 'Activity Escalation' | 'Precondition Escalation';
  activityId?: string;
  activityName?: string;
  plannedDay?: string;
  currentDay?: string;
  preconditionId?: string;
  checkName?: string;
  executionDay?: string;
  impact?: string;
  rootCause?: string;
}

const escalationMetadata: Record<string, Partial<EscalationRow>> = {
  e1: {
    escalationType: 'Activity Escalation',
    floor: '11',
    pour: 'P01-Core',
    activityId: 'A03',
    activityName: 'Crane breakdown blocked slab cycle',
    plannedDay: 'Day 2',
    currentDay: 'Day 2',
    rootCause: 'Crane gearbox failure halted vertical material movement.',
  },
  e2: {
    escalationType: 'Activity Escalation',
    floor: '24',
    pour: 'P01-Core',
    activityId: 'A15',
    activityName: 'Day-4 lock missed',
    plannedDay: 'Day 4',
    currentDay: 'Day 4',
    rootCause: 'Edge shutter materials did not arrive on time, blocking critical path.',
  },
  e3: {
    escalationType: 'Precondition Escalation',
    floor: '09',
    pour: 'P01-Cols',
    preconditionId: 'PRE_018',
    checkName: 'QC Pre-Pour Card Signed',
    executionDay: 'Day 4',
    impact: 'No-Go if not signed',
    rootCause: 'TIC missed the required QC pre-pour card sign-off.',
  },
};

function normalizeTitle(value: string) {
  return value.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function EscalationDrawer({ esc, onClose }: { esc: EscalationRow; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="text-sm font-semibold text-[#1C1B1B]">Escalation Details</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors">
            <X size={16} className="text-neutral-500" />
          </button>
        </div>

        <div className="p-5 space-y-5 flex-1">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-neutral-500">Escalation ID</p>
                <p className="text-sm font-semibold text-[#1C1B1B]">{esc.id}</p>
              </div>
              <SeverityBadge severity={esc.severity} />
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-neutral-500">
              <div>
                <p className="uppercase tracking-wide">Type</p>
                <p className="mt-1 text-sm text-[#1C1B1B]">{esc.escalationType}</p>
              </div>
              <div>
                <p className="uppercase tracking-wide">Project</p>
                <p className="mt-1 text-sm text-[#1C1B1B]">{esc.project}</p>
              </div>
              <div>
                <p className="uppercase tracking-wide">Tower</p>
                <p className="mt-1 text-sm text-[#1C1B1B]">{esc.tower_name}</p>
              </div>
              <div>
                <p className="uppercase tracking-wide">Floor</p>
                <p className="mt-1 text-sm text-[#1C1B1B]">Floor {esc.floor}</p>
              </div>
              <div>
                <p className="uppercase tracking-wide">Pour</p>
                <p className="mt-1 text-sm text-[#1C1B1B]">{esc.pour}</p>
              </div>
              <div>
                <p className="uppercase tracking-wide">Owner</p>
                <p className="mt-1 text-sm text-[#1C1B1B]">{esc.owner}</p>
              </div>
              <div>
                <p className="uppercase tracking-wide">Created Time</p>
                <p className="mt-1 text-sm text-[#1C1B1B]">{new Date(esc.created_at).toLocaleString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div>
                <p className="uppercase tracking-wide">Current Status</p>
                <p className="mt-1 text-sm capitalize text-[#1C1B1B]">{esc.status.replace('_', ' ')}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border p-4 bg-neutral-50">
            <p className="text-[10px] uppercase tracking-wide text-neutral-400 mb-2">SLA Status</p>
            <p className={`text-sm font-semibold ${esc.sla_remaining <= 0 ? 'text-error' : 'text-warning'}`}>
              {esc.sla_remaining <= 0 ? 'Breached' : `${esc.sla_remaining}h Remaining`}
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-[10px] text-neutral-400 uppercase mb-1.5">Description</p>
              <p className="text-sm text-neutral-600 leading-relaxed">{esc.description}</p>
            </div>

            <div>
              <p className="text-[10px] text-neutral-400 uppercase mb-1.5">Root Cause</p>
              <p className="text-sm text-neutral-600 leading-relaxed">{esc.rootCause ?? 'Root cause details are being verified.'}</p>
            </div>

            {esc.escalationType === 'Activity Escalation' ? (
              <div className="grid gap-3 text-xs text-neutral-500 sm:grid-cols-2">
                <div>
                  <p className="uppercase tracking-wide">Activity ID</p>
                  <p className="mt-1 text-sm text-[#1C1B1B]">{esc.activityId}</p>
                </div>
                <div>
                  <p className="uppercase tracking-wide">Activity Name</p>
                  <p className="mt-1 text-sm text-[#1C1B1B]">{esc.activityName}</p>
                </div>
                <div>
                  <p className="uppercase tracking-wide">Planned Day</p>
                  <p className="mt-1 text-sm text-[#1C1B1B]">{esc.plannedDay}</p>
                </div>
                <div>
                  <p className="uppercase tracking-wide">Current Day</p>
                  <p className="mt-1 text-sm text-[#1C1B1B]">{esc.currentDay}</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-3 text-xs text-neutral-500 sm:grid-cols-2">
                <div>
                  <p className="uppercase tracking-wide">Precondition ID</p>
                  <p className="mt-1 text-sm text-[#1C1B1B]">{esc.preconditionId}</p>
                </div>
                <div>
                  <p className="uppercase tracking-wide">Check Name</p>
                  <p className="mt-1 text-sm text-[#1C1B1B]">{esc.checkName}</p>
                </div>
                <div>
                  <p className="uppercase tracking-wide">Execution Day</p>
                  <p className="mt-1 text-sm text-[#1C1B1B]">{esc.executionDay}</p>
                </div>
                <div>
                  <p className="uppercase tracking-wide">Go / No-Go Impact</p>
                  <p className="mt-1 text-sm text-[#1C1B1B]">{esc.impact}</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <p className="text-[10px] text-neutral-400 uppercase mb-3">Timeline</p>
            <div className="space-y-3">
              <div className="space-y-2">
                <p className="text-[11px] text-neutral-500 uppercase tracking-wide">Created</p>
                <p className="text-sm text-[#1C1B1B]">{new Date(esc.created_at).toLocaleString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              {esc.actions.map((action) => (
                <div key={action.id} className="space-y-2">
                  <p className="text-[11px] text-neutral-500 uppercase tracking-wide">{action.note}</p>
                  <p className="text-sm text-[#1C1B1B]">{action.by} · {new Date(action.at).toLocaleString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              ))}
              <div className="space-y-2">
                <p className="text-[11px] text-neutral-500 uppercase tracking-wide">Resolved</p>
                <p className="text-sm text-[#1C1B1B]">{esc.status === 'resolved' || esc.status === 'closed' ? 'Resolved' : 'Pending Resolution'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-border">
          <button className="w-full h-10 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors">
            Add Action
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EscalationCenterPage() {
  const searchParams = useSearchParams();
  const [project, setProject] = useState('all');
  const [tower, setTower] = useState('all');
  const [floor, setFloor] = useState('all');
  const [pour, setPour] = useState('all');
  const [filterType, setFilterType] = useState<EscalationFilterType>('all');
  const [severity, setSeverity] = useState('all');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<EscalationRow | null>(null);

  const projectOptions = useMemo(
    () => Array.from(new Set(mockTowers.map((tower) => tower.project))),
    []
  );

  useEffect(() => {
    const projectParam = searchParams.get('project');
    const towerParam = searchParams.get('tower');
    const floorParam = searchParams.get('floor');
    const pourParam = searchParams.get('pour');

    const projectLabel = projectParam
      ? getProjectLabelFromParam(projectParam, projectOptions)
      : undefined;
    const towerId = towerParam ? getTowerIdFromParam(towerParam, mockTowers) : undefined;
    const selectedProject =
      projectLabel ??
      (towerId ? mockTowers.find((t) => t.id === towerId)?.project : undefined) ??
      'all';
    const floorValue = floorParam ? getFloorLabelFromParam(floorParam) ?? 'all' : 'all';

    const poursForTower = Array.from(
      new Set(
        mockEscalations
          .filter((esc) => {
            const towerRecord = mockTowers.find((t) => t.id === esc.tower_id);
            if (selectedProject !== 'all' && towerRecord?.project !== selectedProject) return false;
            if (towerId && esc.tower_id !== towerId) return false;
            const escFloor = escalationMetadata[esc.id]?.floor;
            if (floorValue !== 'all' && escFloor !== floorValue) return false;
            return true;
          })
          .map((esc) => escalationMetadata[esc.id]?.pour ?? '')
          .filter(Boolean)
      )
    );

    setProject(selectedProject);
    setTower(towerId ?? 'all');
    setFloor(floorValue);
    setPour(pourParam ? getPourLabelFromParam(pourParam, poursForTower) ?? 'all' : 'all');
  }, [searchParams, projectOptions]);

  const projectTowers = useMemo(
    () => Array.from(new Set(mockTowers.map((tower) => tower.project))),
    []
  );

  const enrichedEscalations: EscalationRow[] = useMemo(() => {
    return mockEscalations.map((esc) => {
      const towerRecord = mockTowers.find((t) => t.id === esc.tower_id);
      const metadata = escalationMetadata[esc.id] ?? {};
      const update = mockTicUpdates.find((u) => u.tower_id === esc.tower_id);
      return {
        ...esc,
        project: towerRecord?.project ?? 'Unknown Project',
        floor: metadata.floor ?? (update ? String(update.floor) : String(towerRecord?.active_floor ?? 1)),
        pour: metadata.pour ?? (update ? `P0${update.pour}` : `P0${towerRecord?.active_pour ?? 1}`),
        escalationType: metadata.escalationType ?? 'Activity Escalation',
        activityId: metadata.activityId,
        activityName: metadata.activityName,
        plannedDay: metadata.plannedDay,
        currentDay: metadata.currentDay,
        preconditionId: metadata.preconditionId,
        checkName: metadata.checkName,
        executionDay: metadata.executionDay,
        impact: metadata.impact,
        rootCause: metadata.rootCause,
      };
    });
  }, []);

  const towers = useMemo(() => {
    if (project === 'all') return mockTowers;
    return mockTowers.filter((towerRecord) => towerRecord.project === project);
  }, [project]);

  const floors = useMemo(() => {
    const values = new Set(
      enrichedEscalations
        .filter((esc) => {
          if (project !== 'all' && esc.project !== project) return false;
          if (tower !== 'all' && esc.tower_id !== tower) return false;
          return true;
        })
        .map((esc) => esc.floor)
    );
    return Array.from(values);
  }, [enrichedEscalations, project, tower]);

  const pours = useMemo(() => {
    const values = new Set(
      enrichedEscalations
        .filter((esc) => {
          if (project !== 'all' && esc.project !== project) return false;
          if (tower !== 'all' && esc.tower_id !== tower) return false;
          if (floor !== 'all' && esc.floor !== floor) return false;
          return true;
        })
        .map((esc) => esc.pour)
    );
    return Array.from(values);
  }, [enrichedEscalations, project, tower, floor]);

  const filteredEscalations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return enrichedEscalations.filter((esc) => {
      if (project !== 'all' && esc.project !== project) return false;
      if (tower !== 'all' && esc.tower_id !== tower) return false;
      if (floor !== 'all' && esc.floor !== floor) return false;
      if (pour !== 'all' && esc.pour !== pour) return false;
      if (filterType !== 'all') {
        if (filterType === 'activity' && esc.escalationType !== 'Activity Escalation') return false;
        if (filterType === 'precondition' && esc.escalationType !== 'Precondition Escalation') return false;
      }
      if (severity !== 'all' && esc.severity !== severity) return false;
      if (status !== 'all' && esc.status !== status) return false;

      if (!query) return true;
      return (
        esc.id.toLowerCase().includes(query) ||
        esc.title.toLowerCase().includes(query) ||
        (esc.activityId?.toLowerCase().includes(query) ?? false) ||
        (esc.preconditionId?.toLowerCase().includes(query) ?? false) ||
        esc.tower_name.toLowerCase().includes(query) ||
        esc.project.toLowerCase().includes(query) ||
        esc.floor.toLowerCase().includes(query) ||
        esc.pour.toLowerCase().includes(query) ||
        esc.owner.toLowerCase().includes(query)
      );
    });
  }, [enrichedEscalations, project, tower, floor, pour, filterType, severity, status, search]);

  const selectedTower = useMemo(
    () => (tower !== 'all' ? mockTowers.find((towerRecord) => towerRecord.id === tower) : undefined),
    [tower]
  );

  const contextParts = [];
  if (project !== 'all') contextParts.push(project);
  if (selectedTower) contextParts.push(selectedTower.name);
  if (floor !== 'all') contextParts.push(`Floor ${floor}`);
  if (pour !== 'all') contextParts.push(pour);

  const openEscalations = filteredEscalations.filter((esc) => esc.status !== 'closed').length;
  const activityEscalations = filteredEscalations.filter((esc) => esc.escalationType === 'Activity Escalation').length;
  const preconditionEscalations = filteredEscalations.filter((esc) => esc.escalationType === 'Precondition Escalation').length;
  const criticalEscalations = filteredEscalations.filter((esc) => esc.severity === 'critical').length;
  const slaBreachedEscalations = filteredEscalations.filter((esc) => esc.sla_remaining <= 0).length;

  const summaryItems = useMemo(() => {
    if (filterType === 'activity') {
      return [
        { label: 'Open Activity Escalations', value: activityEscalations },
        { label: 'Critical', value: criticalEscalations },
        { label: 'SLA Breached', value: slaBreachedEscalations },
      ];
    }

    if (filterType === 'precondition') {
      return [
        { label: 'Open Precondition Escalations', value: preconditionEscalations },
        { label: 'Critical', value: criticalEscalations },
        { label: 'SLA Breached', value: slaBreachedEscalations },
      ];
    }

    return [
      { label: 'Open Escalations', value: openEscalations },
      { label: 'Activity Escalations', value: activityEscalations },
      { label: 'Precondition Escalations', value: preconditionEscalations },
      { label: 'Critical', value: criticalEscalations },
      { label: 'SLA Breached', value: slaBreachedEscalations },
    ];
  }, [filterType, openEscalations, activityEscalations, preconditionEscalations, criticalEscalations, slaBreachedEscalations]);

  const statusConfig: Record<string, string> = {
    open: 'bg-error-light text-error',
    in_progress: 'bg-warning-light text-warning',
    resolved: 'bg-success-light text-success',
    closed: 'bg-neutral-100 text-neutral-500',
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-[#1C1B1B]">Escalation Center</h1>
        <p className="text-sm text-neutral-500">
          Monitor and manage execution escalations across projects, towers, floors, and pours.
        </p>
        {contextParts.length > 0 && (
          <p className="text-xs text-neutral-400">{contextParts.join(' > ')}</p>
        )}
      </div>

      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={project}
            onChange={(event) => {
              setProject(event.target.value);
              setTower('all');
              setFloor('all');
              setPour('all');
            }}
            className="text-xs border border-border rounded-lg px-2 py-1.5 bg-white text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Projects</option>
            {projectOptions.map((projectName) => (
              <option key={projectName} value={projectName}>
                {projectName}
              </option>
            ))}
          </select>

          <select
            value={tower}
            onChange={(event) => {
              setTower(event.target.value);
              setFloor('all');
              setPour('all');
            }}
            className="text-xs border border-border rounded-lg px-2 py-1.5 bg-white text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Towers</option>
            {towers.map((towerItem) => (
              <option key={towerItem.id} value={towerItem.id}>
                {towerItem.name}
              </option>
            ))}
          </select>

          <select
            value={floor}
            onChange={(event) => {
              setFloor(event.target.value);
              setPour('all');
            }}
            className="text-xs border border-border rounded-lg px-2 py-1.5 bg-white text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Floors</option>
            {floors.map((floorLabel) => (
              <option key={floorLabel} value={floorLabel}>
                {floorLabel}
              </option>
            ))}
          </select>

          <select
            value={pour}
            onChange={(event) => setPour(event.target.value)}
            className="text-xs border border-border rounded-lg px-2 py-1.5 bg-white text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Pours</option>
            {pours.map((pourLabel) => (
              <option key={pourLabel} value={pourLabel}>
                {pourLabel}
              </option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(event) => setFilterType(event.target.value as EscalationFilterType)}
            className="text-xs border border-border rounded-lg px-2 py-1.5 bg-white text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Escalations</option>
            <option value="activity">Activity Escalations</option>
            <option value="precondition">Precondition Escalations</option>
          </select>

          <select
            value={severity}
            onChange={(event) => setSeverity(event.target.value)}
            className="text-xs border border-border rounded-lg px-2 py-1.5 bg-white text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="text-xs border border-border rounded-lg px-2 py-1.5 bg-white text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search size={15} className="text-neutral-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search escalation id, title, activity / precondition id, tower, floor, pour, owner"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="flex-1 text-sm bg-transparent outline-none text-[#1C1B1B] placeholder-neutral-400"
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-3 xl:grid-cols-5">
        {summaryItems.map((item) => (
          <Card key={item.label} className="p-3">
            <p className="text-[10px] uppercase tracking-wide text-neutral-500 font-semibold mb-2">{item.label}</p>
            <p className="text-xl font-semibold text-[#1C1B1B]">{item.value}</p>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-neutral-50 border-b border-border">
                {[
                  'Escalation Type',
                  'Project',
                  'Tower',
                  'Floor',
                  'Pour',
                  'Escalation',
                  'Severity',
                  'Owner',
                  'Created',
                  'SLA',
                  'Status',
                  'Action',
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wide whitespace-nowrap"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEscalations.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-8 text-neutral-400">
                    No escalations match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredEscalations.map((esc) => (
                  <tr key={esc.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3 text-neutral-700 whitespace-nowrap">{esc.escalationType}</td>
                    <td className="px-4 py-3 text-neutral-700 whitespace-nowrap">{esc.project}</td>
                    <td className="px-4 py-3 text-neutral-700 whitespace-nowrap">{esc.tower_name}</td>
                    <td className="px-4 py-3 text-neutral-700 whitespace-nowrap">Floor {esc.floor}</td>
                    <td className="px-4 py-3 text-neutral-700 whitespace-nowrap">{esc.pour}</td>
                    <td className="px-4 py-3 max-w-[260px]">
                      <p className="font-medium text-[#1C1B1B] truncate">{esc.title}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap"><SeverityBadge severity={esc.severity} /></td>
                    <td className="px-4 py-3 text-neutral-600 whitespace-nowrap">{esc.owner}</td>
                    <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">
                      {new Date(esc.created_at).toLocaleString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {esc.sla_remaining <= 0 ? (
                        <span className="text-[11px] font-semibold text-error flex items-center gap-1">
                          <AlertTriangle size={11} /> Breached
                        </span>
                      ) : (
                        <span className="text-[11px] text-warning font-medium flex items-center gap-1">
                          <Clock size={11} /> {esc.sla_remaining}h
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded capitalize ${statusConfig[esc.status]}`}>
                        {esc.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => setSelected(esc)}
                        className="flex items-center gap-1 text-primary hover:underline font-medium"
                      >
                        View <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && <EscalationDrawer esc={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
