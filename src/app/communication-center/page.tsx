'use client';

import { useState } from 'react';
import { Search, MessageSquare, AlertTriangle, Clock } from 'lucide-react';
import { Card, KPICard } from '../../components/common/Card';
import { mockCommunications, mockTicUpdates, mockTowers } from '../../data/mock';
import type { CommType } from '../../types';

const commTypeConfig: Record<CommType, { label: string; cls: string }> = {
  sod_received: { label: 'SoD', cls: 'bg-success-light text-success' },
  eod_received: { label: 'EoD', cls: 'bg-primary-100 text-primary-600' },
  risk_raised: { label: 'Risk', cls: 'bg-warning-light text-warning' },
  escalation_sent: { label: 'Escalation', cls: 'bg-error-light text-error' },
  acknowledgement: { label: 'Ack', cls: 'bg-neutral-100 text-neutral-600' },
  fallback_triggered: { label: 'Fallback', cls: 'bg-alert-light text-alert' },
  reminder_sent: { label: 'Reminder', cls: 'bg-neutral-100 text-neutral-500' },
};

function TicStatusRow({ tower }: { tower: typeof mockTowers[0] }) {
  const todayUpdates = mockTicUpdates.filter((u) => u.tower_id === tower.id);
  const hasSod = todayUpdates.some((u) => u.update_type === 'sod');
  const hasEod = todayUpdates.some((u) => u.update_type === 'eod');
  const lastUpdate = todayUpdates.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())[0];

  let statusColor = 'bg-success';
  let statusLabel = 'Updated';
  if (!hasSod && !hasEod) { statusColor = 'bg-error'; statusLabel = 'No Updates'; }
  else if (!hasEod) { statusColor = 'bg-warning'; statusLabel = 'EoD Pending'; }

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusColor}`} />
        <div>
          <p className="text-xs font-medium text-[#1C1B1B]">{tower.name}</p>
          <p className="text-[10px] text-neutral-400">
            {lastUpdate ? new Date(lastUpdate.submitted_at).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }) : 'No update'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${hasSod ? 'bg-success-light text-success' : 'bg-neutral-100 text-neutral-400'}`}>SoD</span>
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${hasEod ? 'bg-success-light text-success' : 'bg-neutral-100 text-neutral-400'}`}>EoD</span>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${statusColor === 'bg-success' ? 'bg-success-light text-success' : statusColor === 'bg-warning' ? 'bg-warning-light text-warning' : 'bg-error-light text-error'}`}>
          {statusLabel}
        </span>
      </div>
    </div>
  );
}

export default function CommunicationCenterPage() {
  const [filterTower, setFilterTower] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const filtered = mockCommunications
    .filter((c) => filterTower === 'all' || c.tower_id === filterTower)
    .filter((c) => filterType === 'all' || c.type === filterType)
    .sort((a, b) => new Date(b.received_at).getTime() - new Date(a.received_at).getTime());

  const sodCount = mockTicUpdates.filter((u) => u.update_type === 'sod').length;
  const eodCount = mockTicUpdates.filter((u) => u.update_type === 'eod').length;
  const missingEod = mockTowers.length - eodCount;
  const fallbacks = mockCommunications.filter((c) => c.type === 'fallback_triggered').length;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KPICard label="SoD Received" value={`${sodCount}/${mockTowers.length}`} variant="success" />
        <KPICard label="EoD Received" value={`${eodCount}/${mockTowers.length}`} variant={eodCount < mockTowers.length ? 'warning' : 'success'} />
        <KPICard label="Missing Updates" value={missingEod} variant={missingEod > 0 ? 'error' : 'success'} />
        <KPICard label="Fallbacks Today" value={fallbacks} variant={fallbacks > 0 ? 'warning' : 'default'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="space-y-4">
          <section>
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">TIC Update Status</h3>
            <Card className="p-4">
              {mockTowers.map((tower) => (
                <TicStatusRow key={tower.id} tower={tower} />
              ))}
            </Card>
          </section>

          <section>
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              CM Fallback Queue
              {fallbacks > 0 && <span className="bg-error-light text-error text-[10px] font-bold px-1.5 py-0.5 rounded-full">{fallbacks}</span>}
            </h3>
            <Card className="p-4">
              {mockTowers
                .filter((t) => {
                  const hasEod = mockTicUpdates.some((u) => u.tower_id === t.id && u.update_type === 'eod');
                  return !hasEod;
                })
                .map((tower) => (
                  <div key={tower.id} className="border border-border rounded-lg p-3 mb-3 last:mb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-xs font-semibold text-[#1C1B1B]">{tower.name}</p>
                        <p className="text-[10px] text-neutral-500 flex items-center gap-1">
                          <Clock size={10} /> EoD expected by 21:00
                        </p>
                      </div>
                      <AlertTriangle size={14} className="text-warning mt-0.5 flex-shrink-0" />
                    </div>
                    <button className="w-full h-7 bg-primary text-white rounded-lg text-[11px] font-semibold hover:bg-primary-600 transition-colors">
                      Submit Fallback Update
                    </button>
                  </div>
                ))}
              {mockTowers.every((t) => mockTicUpdates.some((u) => u.tower_id === t.id && u.update_type === 'eod')) && (
                <p className="text-xs text-neutral-400 text-center py-2">All EoDs received</p>
              )}
            </Card>
          </section>
        </div>

        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Communication Timeline</h3>
            <div className="flex gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-white border border-border rounded-lg px-2.5 py-1.5">
                <Search size={12} className="text-neutral-400" />
                <select
                  value={filterTower}
                  onChange={(e) => setFilterTower(e.target.value)}
                  className="text-xs bg-transparent text-neutral-600 focus:outline-none"
                >
                  <option value="all">All Towers</option>
                  {mockTowers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="text-xs border border-border rounded-lg px-2.5 py-1.5 bg-white text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Types</option>
                <option value="sod_received">SoD Received</option>
                <option value="eod_received">EoD Received</option>
                <option value="risk_raised">Risk Raised</option>
                <option value="escalation_sent">Escalation Sent</option>
                <option value="fallback_triggered">Fallback</option>
              </select>
            </div>
          </div>

          <Card className="p-4">
            {filtered.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare size={24} className="text-neutral-200 mx-auto mb-2" />
                <p className="text-sm text-neutral-400">No communications found</p>
              </div>
            ) : (
              <div className="relative space-y-4">
                {filtered.map((comm, i) => {
                  const cfg = commTypeConfig[comm.type];
                  return (
                    <div key={comm.id} className="flex gap-3">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className={`w-2.5 h-2.5 rounded-full mt-0.5 ${cfg.cls.includes('success') ? 'bg-success' : cfg.cls.includes('error') ? 'bg-error' : cfg.cls.includes('warning') ? 'bg-warning' : cfg.cls.includes('alert') ? 'bg-alert' : 'bg-primary'}`} />
                        {i < filtered.length - 1 && <div className="w-px flex-1 bg-border mt-1 min-h-[20px]" />}
                      </div>
                      <div className="pb-3 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${cfg.cls}`}>{cfg.label}</span>
                          <span className="text-xs font-medium text-[#1C1B1B]">{comm.tower_name}</span>
                          <span className="text-[11px] text-neutral-400 flex items-center gap-1 ml-auto">
                            <Clock size={10} />
                            {new Date(comm.received_at).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-600 leading-relaxed">{comm.message}</p>
                        {comm.sender && (
                          <p className="text-[10px] text-neutral-400 mt-0.5">From: {comm.sender}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </section>
      </div>
    </div>
  );
}
