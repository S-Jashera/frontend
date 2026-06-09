import type { Tower } from '../types';

export function normalizeFilterParam(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function getProjectLabelFromParam(param: string, projects: string[]) {
  const normalizedParam = normalizeFilterParam(param);
  return projects.find((project) => normalizeFilterParam(project) === normalizedParam);
}

export function getTowerIdFromParam(param: string, towers: Tower[]) {
  const normalizedParam = normalizeFilterParam(param);
  return towers.find((tower) => {
    const normalizedTower = normalizeFilterParam(tower.name);
    return (
      tower.id === normalizedParam ||
      normalizedTower === normalizedParam ||
      normalizedTower.endsWith(`-${normalizedParam}`)
    );
  })?.id;
}

export function getFloorLabelFromParam(param: string) {
  if (!param) return undefined;
  const digits = param.match(/\d+/)?.[0];
  return digits ? `F${digits}` : undefined;
}

export function getPourLabelFromParam(param: string, pours: string[]) {
  const normalizedParam = normalizeFilterParam(param);
  return pours.find((pour) => normalizeFilterParam(pour) === normalizedParam);
}

export function getEscalationTypeFromParam(param: string) {
  const normalizedParam = normalizeFilterParam(param);
  if (normalizedParam === 'activity' || normalizedParam === 'activity-escalations' || normalizedParam === 'activity-escalation') {
    return 'activity';
  }
  if (normalizedParam === 'precondition' || normalizedParam === 'precondition-escalations' || normalizedParam === 'precondition-escalation') {
    return 'precondition';
  }
  return 'all';
}
