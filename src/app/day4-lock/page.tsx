'use client';

import { CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { Card, KPICard } from '../../components/common/Card';
import { day4ComplianceData } from '../../data/mock';

function ActivityCell({ status }: { status: string }) {
  if (status === 'complete') return <CheckCircle2 size={16} className="text-success mx-auto" />;
  if (status === 'in_progress') return <Clock size={16} className="text-warning mx-auto" />;
  if (status === 'blocked') return <XCircle size={16} className="text-error mx-auto" />;
  return <div className="w-3 h-3 rounded-full border-2 border-neutral-300 mx-auto" />;
}

const statusConfig = {
  compliant: { label: 'Compliant', cls: 'bg-success-light text-success' },
  at_risk: { label: 'At Risk', cls: 'bg-warning-light text-warning' },
  breached: { label: 'Breached', cls: 'bg-error-light text-error' },
  pending: { label: 'Pending', cls: 'bg-neutral-100 text-neutral-500' },
};

export default function Day4LockPage() {
  const compliant = day4ComplianceData.filter((d) => d.status === 'compliant').length;
  const atRisk = day4ComplianceData.filter((d) => d.status === 'at_risk').length;
  const breached = day4ComplianceData.filter((d) => d.status === 'breached').length;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <Card className="p-4 bg-primary-50 border-primary-200">
        <div className="flex items-start gap-3">
          <AlertTriangle size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-primary">Day-4 Lock Rule</p>
            <p className="text-xs text-primary-600 mt-0.5">Activities A07 (Slab Top Reinforcement), A10 (Pre-pour Inspection), and A15 (Cube Test Arrangement) must all be completed before Day-4 End of Day.</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KPICard label="Total Towers" value={day4ComplianceData.length} />
        <KPICard label="Compliant" value={compliant} variant="success" />
        <KPICard label="At Risk" value={atRisk} variant="warning" />
        <KPICard label="Breached" value={breached} variant="error" />
      </div>

      <section>
        <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Compliance Grid</h3>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-neutral-50 border-b border-border">
                  {['Tower', 'Floor', 'Pour', 'Current Day', 'A07', 'A10', 'A15', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {day4ComplianceData.map((row) => {
                  const cfg = statusConfig[row.status as keyof typeof statusConfig];
                  return (
                    <tr key={row.tower_id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-[#1C1B1B]">{row.tower_name}</td>
                      <td className="px-4 py-3 text-neutral-600">{row.floor}</td>
                      <td className="px-4 py-3 text-neutral-600">P{row.pour}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                          row.current_day === 4 ? 'bg-primary text-white' : 'text-neutral-600'
                        }`}>Day {row.current_day}</span>
                      </td>
                      <td className="px-4 py-3 text-center"><ActivityCell status={row.a07} /></td>
                      <td className="px-4 py-3 text-center"><ActivityCell status={row.a10} /></td>
                      <td className="px-4 py-3 text-center"><ActivityCell status={row.a15} /></td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${cfg.cls}`}>{cfg.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <section>
        <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Recovery Actions Required</h3>
        <div className="space-y-3">
          {day4ComplianceData.filter((d) => d.status === 'at_risk').map((d) => (
            <Card key={d.tower_id} className="p-4 border-l-4 border-l-warning">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-[#1C1B1B]">{d.tower_name}</h4>
                    <span className="text-[11px] bg-warning-light text-warning px-2 py-0.5 rounded font-medium">At Risk</span>
                  </div>
                  <p className="text-xs text-neutral-500">Day-4 Lock compliance at risk. Activities not yet complete.</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(['a07', 'a10', 'a15'] as const).filter((k) => d[k] !== 'complete').map((k) => (
                    <span key={k} className="text-[11px] bg-neutral-100 text-neutral-600 px-2 py-1 rounded font-mono">{k.toUpperCase()} pending</span>
                  ))}
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border">
                <div>
                  <p className="text-[10px] text-neutral-400 uppercase mb-1">Delay Reason</p>
                  <p className="text-xs text-neutral-600">Reinforcement gang delayed</p>
                </div>
                <div>
                  <p className="text-[10px] text-neutral-400 uppercase mb-1">Recovery Plan</p>
                  <p className="text-xs text-neutral-600">Extra shift arranged for evening</p>
                </div>
                <div>
                  <p className="text-[10px] text-neutral-400 uppercase mb-1">Owner</p>
                  <p className="text-xs text-neutral-600">CM Singh · Due: EoD today</p>
                </div>
              </div>
            </Card>
          ))}
          {day4ComplianceData.filter((d) => d.status === 'at_risk').length === 0 && (
            <Card className="p-6 text-center">
              <CheckCircle2 size={24} className="text-success mx-auto mb-2" />
              <p className="text-sm font-medium text-[#1C1B1B]">No recovery actions required</p>
              <p className="text-xs text-neutral-500 mt-1">All towers are on track for Day-4 compliance</p>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
