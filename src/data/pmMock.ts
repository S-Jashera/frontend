export const pmKPIs = {
  activeTowers: 3,
  avgHealth: 79,
  scheduleVariance: -1,
  openCriticals: 2,
};

export const projectHealth = [
  {
    id: "1",
    project: "Reserve Kandivali",
    tower: "Reserve T3",
    floor: 13,
    pour: 1,
    health: 62,
    trend: "declining",
    variance: -1,
    risks: 2,
  },
  {
    id: "2",
    project: "Ascend Thane",
    tower: "Ascend T1",
    floor: 32,
    pour: 2,
    health: 91,
    trend: "improving",
    variance: 0,
    risks: 0,
  },
];
import type { TowerHealth } from '../types';

export interface PMTower {
  id: string;
  tower: string;
  project: string;
  floor: number;
  pour: number;
  day: number;
  health: TowerHealth;
  healthScore: number;
  trend: string;
  variance: number;
  risks: number;
}

export const pmTowers: PMTower[] = [
  {
    id: '1',
    tower: 'Reserve Kandivali T3',
    project: 'Reserve Kandivali',
    floor: 13,
    pour: 1,
    day: 4,
    health: 'critical',
    healthScore: 62,
    trend: 'Declining',
    variance: -1,
    risks: 2,
  },
  {
    id: '2',
    tower: 'Ascend Thane T1',
    project: 'Ascend Thane',
    floor: 32,
    pour: 2,
    day: 6,
    health: 'good',
    healthScore: 91,
    trend: 'Improving',
    variance: 0,
    risks: 0,
  },
  {
    id: '3',
    tower: 'Ascend Thane T3',
    project: 'Ascend Thane',
    floor: 21,
    pour: 1,
    day: 3,
    health: 'at_risk',
    healthScore: 74,
    trend: 'Stable',
    variance: 0,
    risks: 1,
  },
];