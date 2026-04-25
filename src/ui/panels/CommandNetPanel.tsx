import React from 'react';

export interface HQStatusItem {
  id: string;
  name: string;
  status: 'online' | 'degraded' | 'suppressed' | 'offline';
  radioLoad: number;
}

export interface CommandNetPanelProps {
  hqStatus: HQStatusItem[];
  delayedOrders: number;
  failedOrders: number;
  pendingReports: number;
}

const pct = (value: number): string => `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%`;

const statusColor: Record<HQStatusItem['status'], string> = {
  online: '#4caf50',
  degraded: '#ff9800',
  suppressed: '#f44336',
  offline: '#757575',
};

export function CommandNetPanel({
  hqStatus,
  delayedOrders,
  failedOrders,
  pendingReports,
}: CommandNetPanelProps): JSX.Element {
  const avgRadioLoad =
    hqStatus.length === 0
      ? 0
      : hqStatus.reduce((acc, hq) => acc + hq.radioLoad, 0) / hqStatus.length;

  return (
    <section style={{ padding: 12, background: '#111923', color: '#e8eef7', borderRadius: 8 }}>
      <header style={{ marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Command Net</h3>
        <small style={{ opacity: 0.8 }}>HQ status, radio load and message health</small>
      </header>

      <div style={{ marginBottom: 12 }}>
        <strong>HQ status</strong>
        <ul style={{ marginTop: 6, paddingLeft: 20 }}>
          {hqStatus.map((hq) => (
            <li key={hq.id}>
              <span style={{ color: statusColor[hq.status], fontWeight: 700 }}>{hq.name}</span>
              {' • '}
              <span>{hq.status}</span>
              {' • radio load '}
              <span>{pct(hq.radioLoad)}</span>
            </li>
          ))}
          {hqStatus.length === 0 ? <li>No HQ telemetry.</li> : null}
        </ul>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <Metric label="Radio load" value={pct(avgRadioLoad)} />
        <Metric label="Delayed orders" value={String(delayedOrders)} />
        <Metric label="Failed orders" value={String(failedOrders)} />
        <Metric label="Pending reports" value={String(pendingReports)} />
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div style={{ background: '#182433', borderRadius: 6, padding: 8 }}>
      <small style={{ opacity: 0.75 }}>{label}</small>
      <div style={{ fontSize: 18, fontWeight: 700 }}>{value}</div>
    </div>
  );
}
