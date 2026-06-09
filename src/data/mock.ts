import type { Tower, Activity, Risk, Escalation, TicUpdate, Communication, PourReadinessItem } from '../types';

export const mockTowers: Tower[] = [
  // Reserve Kandivali Project
  {
    id: '1',
    name: 'Reserve T1',
    project: 'Reserve Kandivali',
    status: 'active',
    active_floor: 12,
    active_pour: 1,
    current_day: 5,
    health: 'good',
    schedule_variance: 0,
    open_risks: 1,
  },
  {
    id: '2',
    name: 'Reserve T2',
    project: 'Reserve Kandivali',
    status: 'active',
    active_floor: 14,
    active_pour: 2,
    current_day: 4,
    health: 'at_risk',
    schedule_variance: -1,
    open_risks: 3,
  },
  {
    id: '3',
    name: 'Reserve T3',
    project: 'Reserve Kandivali',
    status: 'active',
    active_floor: 10,
    active_pour: 1,
    current_day: 3,
    health: 'good',
    schedule_variance: 0,
    open_risks: 0,
  },

  // Ascend Thane Project
  {
    id: '4',
    name: 'Ascend T1',
    project: 'Ascend Thane',
    status: 'active',
    active_floor: 8,
    active_pour: 1,
    current_day: 6,
    health: 'good',
    schedule_variance: 0,
    open_risks: 1,
  },
  {
    id: '5',
    name: 'Ascend T2',
    project: 'Ascend Thane',
    status: 'active',
    active_floor: 11,
    active_pour: 1,
    current_day: 2,
    health: 'critical',
    schedule_variance: -2,
    open_risks: 5,
  },
  {
    id: '6',
    name: 'Ascend T3',
    project: 'Ascend Thane',
    status: 'active',
    active_floor: 9,
    active_pour: 1,
    current_day: 4,
    health: 'at_risk',
    schedule_variance: -1,
    open_risks: 2,
  },

  // Pinnacle Mumbai Project
  {
    id: '7',
    name: 'Pinnacle T1',
    project: 'Pinnacle Mumbai',
    status: 'active',
    active_floor: 7,
    active_pour: 1,
    current_day: 3,
    health: 'good',
    schedule_variance: 0,
    open_risks: 0,
  },
  {
    id: '8',
    name: 'Pinnacle T2',
    project: 'Pinnacle Mumbai',
    status: 'active',
    active_floor: 6,
    active_pour: 1,
    current_day: 5,
    health: 'good',
    schedule_variance: 0,
    open_risks: 0,
  },
  {
    id: '9',
    name: 'Pinnacle T3',
    project: 'Pinnacle Mumbai',
    status: 'active',
    active_floor: 5,
    active_pour: 1,
    current_day: 2,
    health: 'at_risk',
    schedule_variance: -1,
    open_risks: 2,
  },
];

export const mockActivities: Activity[] = [
  // Reserve T2 (id: 2)
  { id: 'a1', tower_id: '2', tower_name: 'Reserve T2', activity_code: 'A01', activity_name: 'Shutter Release & Stacking', planned_day: 1, actual_day: 1, status: 'complete', updated_by: 'TIC Ravi', updated_at: '2026-06-04T08:00:00Z', floor: 14, pour: 2 },
  { id: 'a2', tower_id: '2', tower_name: 'Reserve T2', activity_code: 'A02', activity_name: 'Bottom Deck Shutter Fixing', planned_day: 1, actual_day: 1, status: 'complete', updated_by: 'TIC Ravi', updated_at: '2026-06-04T09:00:00Z', floor: 14, pour: 2 },
  { id: 'a3', tower_id: '2', tower_name: 'Reserve T2', activity_code: 'A03', activity_name: 'Beam Bottom & Web Fixing', planned_day: 2, actual_day: 2, status: 'complete', updated_by: 'TIC Ravi', updated_at: '2026-06-04T10:00:00Z', floor: 14, pour: 2 },
  { id: 'a4', tower_id: '2', tower_name: 'Reserve T2', activity_code: 'A04', activity_name: 'Column & Wall Casting', planned_day: 2, actual_day: 2, status: 'complete', updated_by: 'TIC Ravi', updated_at: '2026-06-04T11:00:00Z', floor: 14, pour: 2 },
  { id: 'a5', tower_id: '2', tower_name: 'Reserve T2', activity_code: 'A05', activity_name: 'Slab Bottom Reinforcement', planned_day: 3, actual_day: 3, status: 'complete', updated_by: 'TIC Ravi', updated_at: '2026-06-04T12:00:00Z', floor: 14, pour: 2 },
  { id: 'a6', tower_id: '2', tower_name: 'Reserve T2', activity_code: 'A06', activity_name: 'MEP Conduit & Inserts', planned_day: 3, actual_day: null, status: 'in_progress', updated_by: 'TIC Ravi', updated_at: '2026-06-04T14:00:00Z', floor: 14, pour: 2 },
  { id: 'a7', tower_id: '2', tower_name: 'Reserve T2', activity_code: 'A07', activity_name: 'Slab Top Reinforcement', planned_day: 4, actual_day: null, status: 'not_started', updated_by: '', updated_at: '2026-06-04T00:00:00Z', floor: 14, pour: 2 },
  { id: 'a8', tower_id: '2', tower_name: 'Reserve T2', activity_code: 'A08', activity_name: 'Edge Shutter Fixing', planned_day: 4, actual_day: null, status: 'blocked', updated_by: 'TIC Ravi', updated_at: '2026-06-04T13:00:00Z', floor: 14, pour: 2 },
  { id: 'a9', tower_id: '2', tower_name: 'Reserve T2', activity_code: 'A09', activity_name: 'Electrical Top Works', planned_day: 4, actual_day: null, status: 'not_started', updated_by: '', updated_at: '2026-06-04T00:00:00Z', floor: 14, pour: 2 },
  { id: 'a10', tower_id: '2', tower_name: 'Reserve T2', activity_code: 'A10', activity_name: 'Pre-pour Inspection', planned_day: 4, actual_day: null, status: 'not_started', updated_by: '', updated_at: '2026-06-04T00:00:00Z', floor: 14, pour: 2 },
  { id: 'a11', tower_id: '2', tower_name: 'Reserve T2', activity_code: 'A15', activity_name: 'Cube Test Arrangement', planned_day: 4, actual_day: null, status: 'not_started', updated_by: '', updated_at: '2026-06-04T00:00:00Z', floor: 14, pour: 2 },
  { id: 'a12', tower_id: '2', tower_name: 'Reserve T2', activity_code: 'A16', activity_name: 'RMC Order Confirmation', planned_day: 5, actual_day: null, status: 'not_started', updated_by: '', updated_at: '2026-06-04T00:00:00Z', floor: 14, pour: 2 },
  { id: 'a13', tower_id: '2', tower_name: 'Reserve T2', activity_code: 'A17', activity_name: 'Pump Setup & Testing', planned_day: 6, actual_day: null, status: 'not_started', updated_by: '', updated_at: '2026-06-04T00:00:00Z', floor: 14, pour: 2 },
  { id: 'a14', tower_id: '2', tower_name: 'Reserve T2', activity_code: 'A18', activity_name: 'Labour Mobilisation', planned_day: 6, actual_day: null, status: 'not_started', updated_by: '', updated_at: '2026-06-04T00:00:00Z', floor: 14, pour: 2 },
  { id: 'a15', tower_id: '2', tower_name: 'Reserve T2', activity_code: 'A19', activity_name: 'Safety Pre-pour Check', planned_day: 7, actual_day: null, status: 'not_started', updated_by: '', updated_at: '2026-06-04T00:00:00Z', floor: 14, pour: 2 },
  { id: 'a16', tower_id: '2', tower_name: 'Reserve T2', activity_code: 'A20', activity_name: 'Concrete Casting', planned_day: 7, actual_day: null, status: 'not_started', updated_by: '', updated_at: '2026-06-04T00:00:00Z', floor: 14, pour: 2 },

  // Ascend T2 (id: 5)
  { id: 'b1', tower_id: '5', tower_name: 'Ascend T2', activity_code: 'A01', activity_name: 'Shutter Release & Stacking', planned_day: 1, actual_day: 1, status: 'complete', updated_by: 'TIC Sanjay', updated_at: '2026-06-04T08:00:00Z', floor: 11, pour: 1 },
  { id: 'b2', tower_id: '5', tower_name: 'Ascend T2', activity_code: 'A02', activity_name: 'Bottom Deck Shutter Fixing', planned_day: 1, actual_day: 2, status: 'in_progress', updated_by: 'TIC Sanjay', updated_at: '2026-06-04T13:00:00Z', floor: 11, pour: 1 },
  { id: 'b3', tower_id: '5', tower_name: 'Ascend T2', activity_code: 'A03', activity_name: 'Beam Bottom & Web Fixing', planned_day: 2, actual_day: null, status: 'blocked', updated_by: 'TIC Sanjay', updated_at: '2026-06-04T15:00:00Z', floor: 11, pour: 1 },

  // Ascend T1 (id: 4)
  { id: 'c1', tower_id: '4', tower_name: 'Ascend T1', activity_code: 'A01', activity_name: 'Shutter Release & Stacking', planned_day: 1, actual_day: 1, status: 'complete', updated_by: 'TIC Priya', updated_at: '2026-06-04T08:00:00Z', floor: 8, pour: 1 },
  { id: 'c2', tower_id: '4', tower_name: 'Ascend T1', activity_code: 'A07', activity_name: 'Slab Top Reinforcement', planned_day: 4, actual_day: 4, status: 'complete', updated_by: 'TIC Priya', updated_at: '2026-06-04T09:00:00Z', floor: 8, pour: 1 },
  { id: 'c3', tower_id: '4', tower_name: 'Ascend T1', activity_code: 'A10', activity_name: 'Pre-pour Inspection', planned_day: 4, actual_day: 4, status: 'complete', updated_by: 'TIC Priya', updated_at: '2026-06-04T10:00:00Z', floor: 8, pour: 1 },
  { id: 'c4', tower_id: '4', tower_name: 'Ascend T1', activity_code: 'A15', activity_name: 'Cube Test Arrangement', planned_day: 4, actual_day: 4, status: 'complete', updated_by: 'TIC Priya', updated_at: '2026-06-04T11:00:00Z', floor: 8, pour: 1 },
  { id: 'c5', tower_id: '4', tower_name: 'Ascend T1', activity_code: 'A17', activity_name: 'Pump Setup & Testing', planned_day: 6, actual_day: null, status: 'in_progress', updated_by: 'TIC Priya', updated_at: '2026-06-04T14:00:00Z', floor: 8, pour: 1 },
  { id: 'c6', tower_id: '4', tower_name: 'Ascend T1', activity_code: 'A19', activity_name: 'Safety Pre-pour Check', planned_day: 7, actual_day: null, status: 'not_started', updated_by: '', updated_at: '2026-06-04T00:00:00Z', floor: 8, pour: 1 },
  { id: 'c7', tower_id: '4', tower_name: 'Ascend T1', activity_code: 'A20', activity_name: 'Concrete Casting', planned_day: 7, actual_day: null, status: 'not_started', updated_by: '', updated_at: '2026-06-04T00:00:00Z', floor: 8, pour: 1 },
];

export const mockRisks: Risk[] = [
  {
    id: 'r1',
    tower_id: '2',
    tower_name: 'Reserve T2',
    title: 'Edge shutter material delayed',
    description: 'Shutter material for A08 has not arrived. Vendor confirmed delivery tomorrow morning.',
    severity: 'high',
    status: 'open',
    owner: 'TIC Ravi',
    created_at: '2026-06-04T13:00:00Z',
  },
  {
    id: 'r2',
    tower_id: '2',
    tower_name: 'Reserve T2',
    title: 'Labour shortage - 4 workers absent',
    description: 'Reinforcement gang short by 4 workers. Contractor arranging replacements.',
    severity: 'medium',
    status: 'in_progress',
    owner: 'CM Singh',
    created_at: '2026-06-04T09:30:00Z',
  },
  {
    id: 'r3',
    tower_id: '5',
    tower_name: 'Ascend T2',
    title: 'Crane breakdown - Crane #2',
    description: 'Main tower crane offline since 06:00. Maintenance team working on it. ETA 4 hours.',
    severity: 'critical',
    status: 'open',
    owner: 'CM Singh',
    created_at: '2026-06-04T06:00:00Z',
  },
  {
    id: 'r4',
    tower_id: '5',
    tower_name: 'Ascend T2',
    title: 'RMC supplier confirmation pending',
    description: 'Pour scheduled Day 9 but RMC not confirmed. Risk of delay.',
    severity: 'high',
    status: 'open',
    owner: 'TIC Sanjay',
    created_at: '2026-06-03T18:00:00Z',
  },
  {
    id: 'r5',
    tower_id: '4',
    tower_name: 'Ascend T1',
    title: 'MEP coordination delay',
    description: 'MEP conduits not installed in 2 zones. Awaiting MEP contractor.',
    severity: 'low',
    status: 'in_progress',
    owner: 'TIC Priya',
    created_at: '2026-06-04T10:00:00Z',
  },
  {
    id: 'r6',
    tower_id: '9',
    tower_name: 'Pinnacle T3',
    title: 'Formwork material shortage',
    description: '200 sqm plywood shortage. Vendor sourcing from alternate supplier.',
    severity: 'medium',
    status: 'open',
    owner: 'TIC Kumar',
    created_at: '2026-06-04T11:00:00Z',
  },
];

export const mockEscalations: Escalation[] = [
  {
    id: 'e1',
    tower_id: '5',
    tower_name: 'Ascend T2',
    title: 'Crane breakdown impacting slab cycle Day 2',
    description: 'Crane #2 breakdown has halted all vertical material movement. Beam fixing blocked.',
    severity: 'critical',
    status: 'open',
    owner: 'CM Singh',
    sla_hours: 4,
    created_at: '2026-06-04T06:00:00Z',
    sla_remaining: 0,
    actions: [
      { id: 'ea1', note: 'Maintenance team notified. ETA assessment underway.', by: 'CM Singh', at: '2026-06-04T06:15:00Z' },
      { id: 'ea2', note: 'Mobile crane requested from depot as backup.', by: 'CM Singh', at: '2026-06-04T07:30:00Z' },
    ],
  },
  {
    id: 'e2',
    tower_id: '2',
    tower_name: 'Reserve T2',
    title: 'Day-4 Lock at risk - A08 blocked',
    description: 'Edge shutter material not on site. A08 blocked, threatens Day-4 compliance.',
    severity: 'high',
    status: 'in_progress',
    owner: 'TIC Ravi',
    sla_hours: 6,
    created_at: '2026-06-04T14:00:00Z',
    sla_remaining: 3,
    actions: [
      { id: 'ea3', note: 'Vendor contacted. Material promised by 19:00.', by: 'CM Singh', at: '2026-06-04T14:30:00Z' },
    ],
  },
  {
    id: 'e3',
    tower_id: '6',
    tower_name: 'Ascend T3',
    title: 'TIC EoD not received by 21:00',
    description: 'TIC Vikram failed to submit EoD update. CM fallback queue triggered.',
    severity: 'medium',
    status: 'in_progress',
    owner: 'CM Singh',
    sla_hours: 2,
    created_at: '2026-06-03T21:00:00Z',
    sla_remaining: 0,
    actions: [
      { id: 'ea4', note: 'Reminder sent via WhatsApp.', by: 'System', at: '2026-06-03T21:15:00Z' },
      { id: 'ea5', note: 'CM fallback EoD submitted.', by: 'CM Singh', at: '2026-06-03T21:45:00Z' },
    ],
  },
];

export const mockTicUpdates: TicUpdate[] = [
  { id: 'u1', tower_id: '2', tower_name: 'Reserve T2', update_type: 'sod', message: 'SoD: Day 4 starting. A06 continuing. A08 material awaited.', submitted_by: 'TIC Ravi', submitted_at: '2026-06-04T07:00:00Z', floor: 14, pour: 2 },
  { id: 'u2', tower_id: '2', tower_name: 'Reserve T2', update_type: 'risk', message: 'Risk: Edge shutter material not on site. Vendor contacted.', submitted_by: 'TIC Ravi', submitted_at: '2026-06-04T13:00:00Z', floor: 14, pour: 2 },
  { id: 'u3', tower_id: '2', tower_name: 'Reserve T2', update_type: 'activity', message: 'A06 MEP conduits 70% complete. A07 to start at 16:00.', submitted_by: 'TIC Ravi', submitted_at: '2026-06-04T14:30:00Z', floor: 14, pour: 2 },
  { id: 'u4', tower_id: '4', tower_name: 'Ascend T1', update_type: 'sod', message: 'SoD: Day 6. Pump setup started. All Day 4 activities complete.', submitted_by: 'TIC Priya', submitted_at: '2026-06-04T07:15:00Z', floor: 8, pour: 1 },
  { id: 'u5', tower_id: '4', tower_name: 'Ascend T1', update_type: 'eod', message: 'EoD: Pump setup 80% done. Pour on track for tomorrow.', submitted_by: 'TIC Priya', submitted_at: '2026-06-04T19:00:00Z', floor: 8, pour: 1 },
  { id: 'u6', tower_id: '5', tower_name: 'Ascend T2', update_type: 'sod', message: 'SoD: Day 2. Crane down since 06:00. Beam fixing halted.', submitted_by: 'TIC Sanjay', submitted_at: '2026-06-04T08:00:00Z', floor: 11, pour: 1 },
  { id: 'u7', tower_id: '5', tower_name: 'Ascend T2', update_type: 'escalation', message: 'ESCALATION: Crane #2 breakdown. A03, A04 blocked.', submitted_by: 'TIC Sanjay', submitted_at: '2026-06-04T06:15:00Z', floor: 11, pour: 1 },
  { id: 'u8', tower_id: '1', tower_name: 'Reserve T1', update_type: 'sod', message: 'SoD: Day 5. Slab top reinforcement at 60%. On schedule.', submitted_by: 'TIC Ravi', submitted_at: '2026-06-04T07:30:00Z', floor: 12, pour: 1 },
  { id: 'u9', tower_id: '8', tower_name: 'Pinnacle T2', update_type: 'sod', message: 'SoD: Day 5. All Day 4 activities complete. EoD expected by 18:00.', submitted_by: 'TIC Kumar', submitted_at: '2026-06-04T07:45:00Z', floor: 6, pour: 1 },
];

export const mockCommunications: Communication[] = [
  { id: 'c1', tower_id: '4', tower_name: 'Ascend T1', type: 'sod_received', message: 'SoD received from TIC Priya', sender: 'TIC Priya', received_at: '2026-06-04T07:15:00Z' },
  { id: 'c2', tower_id: '2', tower_name: 'Reserve T2', type: 'sod_received', message: 'SoD received from TIC Ravi', sender: 'TIC Ravi', received_at: '2026-06-04T07:00:00Z' },
  { id: 'c3', tower_id: '5', tower_name: 'Ascend T2', type: 'sod_received', message: 'SoD received from TIC Sanjay', sender: 'TIC Sanjay', received_at: '2026-06-04T08:00:00Z' },
  { id: 'c4', tower_id: '5', tower_name: 'Ascend T2', type: 'escalation_sent', message: 'Escalation: Crane breakdown - sent to CM', sender: 'System', received_at: '2026-06-04T06:15:00Z' },
  { id: 'c5', tower_id: '2', tower_name: 'Reserve T2', type: 'risk_raised', message: 'Risk raised: Edge shutter material delayed', sender: 'TIC Ravi', received_at: '2026-06-04T13:00:00Z' },
  { id: 'c6', tower_id: '2', tower_name: 'Reserve T2', type: 'acknowledgement', message: 'CM acknowledged risk. Recovery action assigned.', sender: 'CM Singh', received_at: '2026-06-04T13:20:00Z' },
  { id: 'c7', tower_id: '4', tower_name: 'Ascend T1', type: 'eod_received', message: 'EoD received from TIC Priya', sender: 'TIC Priya', received_at: '2026-06-04T19:00:00Z' },
  { id: 'c8', tower_id: '6', tower_name: 'Ascend T3', type: 'fallback_triggered', message: 'EoD not received by 21:00. CM Fallback triggered.', sender: 'System', received_at: '2026-06-03T21:00:00Z' },
  { id: 'c9', tower_id: '8', tower_name: 'Pinnacle T2', type: 'sod_received', message: 'SoD received from TIC Kumar', sender: 'TIC Kumar', received_at: '2026-06-04T07:30:00Z' },
  { id: 'c10', tower_id: '1', tower_name: 'Reserve T1', type: 'sod_received', message: 'SoD received from TIC Ravi', sender: 'TIC Ravi', received_at: '2026-06-04T07:30:00Z' },
];

export const mockPourReadiness: PourReadinessItem[] = [
  { id: 'pr1', tower_id: '4', tower_name: 'Ascend T1', item: 'QC Clearance', status: 'complete', notes: 'QC signed off at 11:00', pour_date: '2026-06-05' },
  { id: 'pr2', tower_id: '4', tower_name: 'Ascend T1', item: 'Pour Card', status: 'complete', notes: 'Pour card approved', pour_date: '2026-06-05' },
  { id: 'pr3', tower_id: '4', tower_name: 'Ascend T1', item: 'Concrete Pump', status: 'complete', notes: 'Pump setup 80% done', pour_date: '2026-06-05' },
  { id: 'pr4', tower_id: '4', tower_name: 'Ascend T1', item: 'RMC Confirmation', status: 'complete', notes: 'RMC confirmed 80m3', pour_date: '2026-06-05' },
  { id: 'pr5', tower_id: '4', tower_name: 'Ascend T1', item: 'Labour Readiness', status: 'pending', notes: 'Gang confirmation pending', pour_date: '2026-06-05' },
  { id: 'pr6', tower_id: '4', tower_name: 'Ascend T1', item: 'Safety Readiness', status: 'complete', notes: 'Safety inspection done', pour_date: '2026-06-05' },
  { id: 'pr7', tower_id: '4', tower_name: 'Ascend T1', item: 'Cube Testing', status: 'complete', notes: 'Cubes arranged', pour_date: '2026-06-05' },
  { id: 'pr8', tower_id: '2', tower_name: 'Reserve T2', item: 'QC Clearance', status: 'pending', notes: '', pour_date: '2026-06-07' },
  { id: 'pr9', tower_id: '2', tower_name: 'Reserve T2', item: 'Pour Card', status: 'pending', notes: '', pour_date: '2026-06-07' },
  { id: 'pr10', tower_id: '2', tower_name: 'Reserve T2', item: 'Concrete Pump', status: 'pending', notes: '', pour_date: '2026-06-07' },
  { id: 'pr11', tower_id: '2', tower_name: 'Reserve T2', item: 'RMC Confirmation', status: 'pending', notes: '', pour_date: '2026-06-07' },
  { id: 'pr12', tower_id: '2', tower_name: 'Reserve T2', item: 'Labour Readiness', status: 'blocked', notes: 'Labour shortage risk', pour_date: '2026-06-07' },
  { id: 'pr13', tower_id: '2', tower_name: 'Reserve T2', item: 'Safety Readiness', status: 'pending', notes: '', pour_date: '2026-06-07' },
  { id: 'pr14', tower_id: '2', tower_name: 'Reserve T2', item: 'Cube Testing', status: 'pending', notes: '', pour_date: '2026-06-07' },
];

export const day4ComplianceData: { tower_id: string; tower_name: string; floor: number; pour: number; a07: string; a10: string; a15: string; current_day: number; status: 'compliant' | 'at_risk' | 'breached' | 'pending' }[] = [
  { tower_id: '2', tower_name: 'Reserve T2', floor: 14, pour: 2, a07: 'not_started', a10: 'not_started', a15: 'not_started', current_day: 4, status: 'at_risk' },
  { tower_id: '4', tower_name: 'Ascend T1', floor: 8, pour: 1, a07: 'complete', a10: 'complete', a15: 'complete', current_day: 6, status: 'compliant' },
  { tower_id: '5', tower_name: 'Ascend T2', floor: 11, pour: 1, a07: 'not_started', a10: 'not_started', a15: 'not_started', current_day: 2, status: 'pending' },
  { tower_id: '6', tower_name: 'Ascend T3', floor: 9, pour: 1, a07: 'in_progress', a10: 'complete', a15: 'in_progress', current_day: 4, status: 'at_risk' },
];
export const activeInstances = [
  ...new Set(
    mockActivities.map(
      (a) => `${a.tower_id}-${a.floor}-${a.pour}`
    )
  ),
].length;

export const activityEscalations = mockEscalations.filter(
  (e) =>
    e.title.includes('Day-4') ||
    e.title.includes('Delay') ||
    e.title.includes('blocked') ||
    e.title.includes('Crane')
).length;

export const preconditionEscalations = mockRisks.filter(
  (r) =>
    r.title.includes('Labour') ||
    r.title.includes('RMC') ||
    r.title.includes('material') ||
    r.title.includes('Pump') ||
    r.title.includes('readiness')
).length;

export const pendingUpdates = mockCommunications.filter(
  (c) =>
    c.type === 'fallback_triggered'
).length;

export const day4LocksDue = day4ComplianceData.filter(
  (d) =>
    d.current_day === 4
).length;


const instances = [
  {
    id: '1',
    floor: 'F24',
    pour: 'P01-Core',
    day: 'Day 3',
    eod: 'Submitted',
    activities: '4/5',
    preconditions: '3/3',
    escalations: 2,
    nextStatus: 'Ready D4'
  },
  {
    id: '2',
    floor: 'F24',
    pour: 'P02-Slab',
    day: 'Day 1',
    eod: 'Submitted',
    activities: '2/2',
    preconditions: '4/4',
    escalations: 0,
    nextStatus: 'Ready D2'
  },
  {
    id: '3',
    floor: 'F23',
    pour: 'P03-Core',
    day: 'Day 4',
    eod: 'Pending',
    activities: '3/4',
    preconditions: '2/3',
    escalations: 1,
    nextStatus: 'Action Required'
  }
];