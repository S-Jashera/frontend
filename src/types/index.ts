export type TowerHealth = 'good' | 'at_risk' | 'critical';
export type ActivityStatus = 'not_started' | 'in_progress' | 'complete' | 'blocked';
export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';
export type UpdateType = 'sod' | 'eod' | 'activity' | 'risk' | 'escalation' | 'fallback';
export type CommType = 'sod_received' | 'eod_received' | 'risk_raised' | 'escalation_sent' | 'acknowledgement' | 'fallback_triggered' | 'reminder_sent';

export interface Tower {
  id: string;
  name: string;
  project: string;
  status: 'active' | 'paused' | 'complete';
  active_floor: number;
  active_pour: number;
  current_day: number;
  health: TowerHealth;
  schedule_variance: number;
  open_risks: number;
}

export interface Activity {
  id: string;
  tower_id: string;
  tower_name: string;
  activity_code: string;
  activity_name: string;
  planned_day: number;
  actual_day: number | null;
  status: ActivityStatus;
  updated_by: string;
  updated_at: string;
  floor: number;
  pour: number;
}

export interface Risk {
  id: string;
  tower_id: string;
  tower_name: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  status: 'open' | 'in_progress' | 'resolved';
  owner: string;
  created_at: string;
}

export interface Escalation {
  id: string;
  tower_id: string;
  tower_name: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  owner: string;
  sla_hours: number;
  created_at: string;
  sla_remaining: number;
  actions: EscalationAction[];
}

export interface EscalationAction {
  id: string;
  note: string;
  by: string;
  at: string;
}

export interface TicUpdate {
  id: string;
  tower_id: string;
  tower_name: string;
  update_type: UpdateType;
  message: string;
  submitted_by: string;
  submitted_at: string;
  floor: number;
  pour: number;
}

export interface Communication {
  id: string;
  tower_id: string;
  tower_name: string;
  type: CommType;
  message: string;
  sender: string;
  received_at: string;
}

export interface PourReadinessItem {
  id: string;
  tower_id: string;
  tower_name: string;
  item: string;
  status: 'pending' | 'complete' | 'blocked';
  notes: string;
  pour_date: string;
}
