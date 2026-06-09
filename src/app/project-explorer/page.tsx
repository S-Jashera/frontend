'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Card } from '../../components/common/Card';
import {
  getFloorLabelFromParam,
  getPourLabelFromParam,
  getProjectLabelFromParam,
  getTowerIdFromParam,
} from '../../lib/cascadingFilters';

import { mockTowers } from '../../data/mock';

export default function ProjectExplorerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [project, setProject] = useState('all');
  const [tower, setTower] = useState('all');
  const [filterFloor, setFilterFloor] = useState('all');
  const [filterPour, setFilterPour] = useState('all');
  const [search, setSearch] = useState('');

  const projectOptions = useMemo(
    () => Array.from(new Set(mockTowers.map((t) => t.project))),
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
        mockInstances
          .filter((instance) => {
            if (selectedProject !== 'all' && instance.project !== selectedProject) return false;
            if (towerId && instance.towerId !== towerId) return false;
            if (floorValue !== 'all' && instance.floor !== floorValue) return false;
            return true;
          })
          .map((instance) => instance.pour)
      )
    );

    setProject(selectedProject);
    setTower(towerId ?? 'all');
    setFilterFloor(floorValue);
    setFilterPour(pourParam ? getPourLabelFromParam(pourParam, poursForTower) ?? 'all' : 'all');
  }, [searchParams, projectOptions]);

  const projectTowers = useMemo(() => {
    if (project === 'all') return mockTowers;
    return mockTowers.filter((t) => t.project === project);
  }, [project]);

  const mockInstances = useMemo(
    () => [
      {
        id: '1',
        project: 'Reserve Kandivali',
        towerId: '1',
        tower: 'Reserve T1',
        floor: 'F24',
        pour: 'P01-Core',
        currentDay: 'Day 3',
        completedActivities: 18,
        totalActivities: 24,
        escalations: 2,
      },  
      
 {
        id: '5',
        project: 'Reserve Kandivali',
        towerId: '1',
        tower: 'Reserve T1',
        floor: 'F24',
        pour: 'P02-Slab',
        currentDay: 'Day 1',
        completedActivities: 4,
        totalActivities: 24,
        escalations: 0,
      },
      {
        id: '2',
        project: 'Reserve Kandivali',
        towerId: '2',
        tower: 'Reserve T2',
        floor: 'F24',
        pour: 'P02-Slab',
        currentDay: 'Day 1',
        completedActivities: 4,
        totalActivities: 24,
        escalations: 0,
      },
      {
        id: '3',
        project: 'Ascend Thane',
        towerId: '4',
        tower: 'Ascend T1',
        floor: 'F23',
        pour: 'P03-Cols',
        currentDay: 'Day 4',
        completedActivities: 15,
        totalActivities: 24,
        escalations: 1,
      },
      {
        id: '4',
        project: 'Ascend Thane',
        towerId: '5',
        tower: 'Ascend T2',
        floor: 'F25',
        pour: 'P01-Core',
        currentDay: 'Day 6',
        completedActivities: 21,
        totalActivities: 24,
        escalations: 0,
      },
    ],
    []
  );

  const floors = useMemo(() => {
    return Array.from(
      new Set(
        mockInstances
          .filter((instance) => {
            if (project !== 'all' && instance.project !== project) return false;
            if (tower !== 'all' && instance.towerId !== tower) return false;
            return true;
          })
          .map((instance) => instance.floor)
      )
    );
  }, [mockInstances, project, tower]);

  const pours = useMemo(() => {
    return Array.from(
      new Set(
        mockInstances
          .filter((instance) => {
            if (project !== 'all' && instance.project !== project) return false;
            if (tower !== 'all' && instance.towerId !== tower) return false;
            if (filterFloor !== 'all' && instance.floor !== filterFloor) return false;
            return true;
          })
          .map((instance) => instance.pour)
      )
    );
  }, [mockInstances, project, tower, filterFloor]);

  const filtered = mockInstances.filter((instance) => {
    if (project !== 'all' && instance.project !== project) return false;
    if (tower !== 'all' && instance.towerId !== tower) return false;
    if (filterFloor !== 'all' && instance.floor !== filterFloor) return false;
    if (filterPour !== 'all' && instance.pour !== filterPour) return false;
    if (
      search &&
      !instance.floor.toLowerCase().includes(search.toLowerCase()) &&
      !instance.pour.toLowerCase().includes(search.toLowerCase()) &&
      !instance.tower.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  function handleOpen(query: string) {
    router.push(`/instance-workspace?${query}`);
  }

  const selectedTower = mockTowers.find((t) => t.id === tower);
  const contextParts = [];
  if (project !== 'all') contextParts.push(project);
  if (selectedTower) contextParts.push(selectedTower.name);
  if (filterFloor !== 'all') {
    const floorLabel = filterFloor.startsWith('F') ? `Floor ${filterFloor.slice(1)}` : filterFloor;
    contextParts.push(floorLabel);
  }
  if (filterPour !== 'all') contextParts.push(filterPour);

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-[#1C1B1B]">Project Explorer</h1>
        <p className="text-sm text-neutral-500">
          Monitor and manage active Floor + Pour execution instances.
        </p>
        {contextParts.length > 0 ? (
          <p className="text-xs text-neutral-400">{contextParts.join(' > ')}</p>
        ) : null}
      </div>

      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={project}
            onChange={(event) => {
              setProject(event.target.value);
              setTower('all');
              setFilterFloor('all');
              setFilterPour('all');
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
              setFilterFloor('all');
              setFilterPour('all');
            }}
            className="text-xs border border-border rounded-lg px-2 py-1.5 bg-white text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Towers</option>
            {projectTowers.map((towerItem) => (
              <option key={towerItem.id} value={towerItem.id}>
                {towerItem.name}
              </option>
            ))}
          </select>

          <select
            value={filterFloor}
            onChange={(event) => {
              setFilterFloor(event.target.value);
              setFilterPour('all');
            }}
            className="text-xs border border-border rounded-lg px-2 py-1.5 bg-white text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Floors</option>
            {floors.map((floor) => (
              <option key={floor} value={floor}>
                {floor}
              </option>
            ))}
          </select>

          <select
            value={filterPour}
            onChange={(event) => setFilterPour(event.target.value)}
            className="text-xs border border-border rounded-lg px-2 py-1.5 bg-white text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Pours</option>
            {pours.map((pour) => (
              <option key={pour} value={pour}>
                {pour}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 flex-1 min-w-[180px]">
            <Search size={15} className="text-neutral-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="floor, pour..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="flex-1 text-sm bg-transparent outline-none text-[#1C1B1B] placeholder-neutral-400"
            />
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-neutral-50 border-b border-border">
                {['Tower', 'Floor', 'Pour', 'Current Day', 'Activity Progress', 'Escalations', 'Action'].map((heading) => (
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-neutral-400">
                    No instances found for the selected Project, Tower, Floor, and Pour filters.
                  </td>
                </tr>
              ) : (
                filtered.map((instance) => {
                  const progress = Math.round((instance.completedActivities / instance.totalActivities) * 100);
                  const normalize = (value: string) =>
                    value
                      .trim()
                      .toLowerCase()
                      .replace(/\s+/g, '-')
                      .replace(/[^a-z0-9-]/g, '');
                  const query = new URLSearchParams({
                    project: normalize(instance.project),
                    tower: normalize(instance.tower),
                    floor: instance.floor.replace(/^F/i, ''),
                    pour: normalize(instance.pour),
                  }).toString();

                  return (
                    <tr
                      key={instance.id}
                      className="hover:bg-neutral-50 transition-colors cursor-pointer"
                      onClick={() => handleOpen(query)}
                    >
                      <td className="px-4 py-2.5 text-neutral-600">{instance.tower}</td>
                      <td className="px-4 py-2.5 text-neutral-600">{instance.floor}</td>
                      <td className="px-4 py-2.5 text-neutral-600">{instance.pour}</td>
                      <td className="px-4 py-2.5 text-neutral-600">{instance.currentDay}</td>
                      <td className="px-4 py-2.5 text-neutral-600">
                        <div className="text-sm font-medium">{instance.completedActivities}/{instance.totalActivities}</div>
                        <div className="mt-2 h-2 w-full rounded-full bg-neutral-200 overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-1">{progress}%</div>
                      </td>
                      <td className="px-4 py-2.5">
  {instance.escalations > 0 ? (
    <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-50 text-red-600 text-xs font-medium">
      {instance.escalations} Active
    </span>
  ) : (
    <span className="text-neutral-300">—</span>
  )}
</td>
                      <td className="px-4 py-2.5">
                        <button
                          type="button"
                          className="text-primary font-medium flex items-center gap-2"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleOpen(query);
                          }}
                        >
                          Open <span className="opacity-80">→</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
