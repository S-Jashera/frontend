'use client';

import { CheckCircle2, XCircle, Clock, Droplets } from 'lucide-react';
import { Card, KPICard } from '../../components/common/Card';
import { mockPourReadiness, mockTowers } from '../../data/mock';

function ChecklistItem({ item, status }: { item: string; status: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
      <div className="flex-shrink-0">
        {status === 'complete' ? (
          <CheckCircle2 size={18} className="text-success" />
        ) : status === 'blocked' ? (
          <XCircle size={18} className="text-error" />
        ) : (
          <Clock size={18} className="text-neutral-300" />
        )}
      </div>
      <span className={`text-sm flex-1 ${
        status === 'complete' ? 'text-neutral-500 line-through' :
        status === 'blocked' ? 'text-error font-medium' :
        'text-[#1C1B1B]'
      }`}>
        {item}
      </span>
      {status === 'blocked' && (
        <span className="text-[10px] bg-error-light text-error px-1.5 py-0.5 rounded font-medium">Blocked</span>
      )}
    </div>
  );
}

export default function PourReadinessPage() {
  const towers = mockTowers.filter((t) => t.current_day >= 5);

  const getTowerReadiness = (towerId: string) => {
    const items = mockPourReadiness.filter((p) => p.tower_id === towerId);
    const complete = items.filter((i) => i.status === 'complete').length;
    const blocked = items.filter((i) => i.status === 'blocked').length;
    return { items, complete, total: items.length, blocked, ready: blocked === 0 && complete === items.length };
  };

  const allTowers = [
    { label: 'Today', towers: towers.filter((t) => t.current_day === 7) },
    { label: 'Tomorrow', towers: towers.filter((t) => t.current_day === 6) },
    { label: 'Next 3 Days', towers: towers.filter((t) => t.current_day === 5) },
  ].filter((g) => g.towers.length > 0);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KPICard label="Upcoming Pours" value={towers.length} icon={<Droplets size={14} />} />
        <KPICard
          label="Pour Ready"
          value={towers.filter((t) => getTowerReadiness(t.id).ready).length}
          variant="success"
        />
        <KPICard
          label="Checklist Pending"
          value={towers.filter((t) => !getTowerReadiness(t.id).ready).length}
          variant="warning"
        />
        <KPICard
          label="Blockers"
          value={mockPourReadiness.filter((p) => p.status === 'blocked').length}
          variant="error"
        />
      </div>

      {allTowers.map((group) => (
        <section key={group.label}>
          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${group.label === 'Today' ? 'bg-error' : group.label === 'Tomorrow' ? 'bg-warning' : 'bg-neutral-300'}`} />
            {group.label}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {group.towers.map((tower) => {
              const { items, complete, total, blocked, ready } = getTowerReadiness(tower.id);
              const pct = total > 0 ? Math.round((complete / total) * 100) : 0;

              return (
                <Card key={tower.id} className={`p-4 ${blocked > 0 ? 'border-l-4 border-l-error' : ready ? 'border-l-4 border-l-success' : 'border-l-4 border-l-warning'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-semibold text-[#1C1B1B]">{tower.name}</h4>
                      <p className="text-[11px] text-neutral-500">Fl. {tower.active_floor} · P{tower.active_pour}</p>
                    </div>
                    {ready ? (
                      <span className="text-[11px] font-semibold bg-success-light text-success px-2.5 py-1 rounded-lg">Ready for Pour</span>
                    ) : (
                      <span className="text-[11px] font-semibold bg-warning-light text-warning px-2.5 py-1 rounded-lg">{complete}/{total} Done</span>
                    )}
                  </div>

                  <div className="h-1.5 bg-neutral-100 rounded-full mb-4 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${blocked > 0 ? 'bg-error' : pct === 100 ? 'bg-success' : 'bg-warning'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div>
                    {items.map((item) => (
                      <ChecklistItem key={item.id} item={item.item} status={item.status} />
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      ))}

      {towers.length === 0 && (
        <Card className="p-8 text-center">
          <Droplets size={32} className="text-neutral-200 mx-auto mb-3" />
          <p className="text-sm font-medium text-neutral-600">No upcoming pours in the next 3 days</p>
        </Card>
      )}
    </div>
  );
}
