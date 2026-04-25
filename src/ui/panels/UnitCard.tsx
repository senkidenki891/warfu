import React from 'react';

export type ContactState = 'tracked' | 'observed' | 'estimated' | 'suspected' | 'unknown';

export interface UnitCardProps {
  name: string;
  callsign: string;
  hp: number;
  maxHp: number;
  morale: number;
  suppression: number;
  damageState: string;
  contactState: ContactState;
  contactConfidence: number;
  confidenceRadiusMeters: number;
  radioOnline: boolean;
  onFire?: boolean;
}

const colorByContact: Record<ContactState, string> = {
  tracked: '#00c853',
  observed: '#64dd17',
  estimated: '#ffd600',
  suspected: '#ff9100',
  unknown: '#9e9e9e',
};

const statusPill: React.CSSProperties = {
  borderRadius: 12,
  padding: '2px 8px',
  fontSize: 12,
  fontWeight: 600,
};

export function UnitCard({
  name,
  callsign,
  hp,
  maxHp,
  morale,
  suppression,
  damageState,
  contactState,
  contactConfidence,
  confidenceRadiusMeters,
  radioOnline,
  onFire = false,
}: UnitCardProps): JSX.Element {
  const hpPercent = Math.max(0, Math.min(100, (hp / Math.max(1, maxHp)) * 100));
  const suppressionPercent = Math.max(0, Math.min(100, suppression));

  return (
    <section
      style={{
        background: '#151a21',
        border: '1px solid #2d3748',
        borderRadius: 10,
        padding: 14,
        color: '#e2e8f0',
        width: 320,
      }}
      aria-label={`unit-card-${callsign}`}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <strong>{name}</strong>
          <div style={{ fontSize: 12, opacity: 0.8 }}>{callsign}</div>
        </div>
        <span
          style={{
            ...statusPill,
            background: radioOnline ? '#1b5e20' : '#5d4037',
            color: '#fff',
            alignSelf: 'center',
          }}
        >
          {radioOnline ? 'RADIO OK' : 'RADIO LOST'}
        </span>
      </header>

      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 12, marginBottom: 4 }}>Damage / HP: {hp}/{maxHp}</div>
        <div style={{ background: '#263238', height: 8, borderRadius: 4 }}>
          <div
            style={{
              width: `${hpPercent}%`,
              height: '100%',
              borderRadius: 4,
              background: hpPercent > 60 ? '#00c853' : hpPercent > 30 ? '#ffd600' : '#d50000',
            }}
          />
        </div>
        <div style={{ fontSize: 12, marginTop: 4 }}>State: {damageState}{onFire ? ' • ON FIRE' : ''}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 12 }}>Morale</div>
          <strong>{morale.toFixed(0)}%</strong>
        </div>
        <div>
          <div style={{ fontSize: 12 }}>Suppression</div>
          <strong>{suppressionPercent.toFixed(0)}%</strong>
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 12, marginBottom: 4 }}>Contact state</div>
        <span style={{ ...statusPill, background: colorByContact[contactState], color: '#0b1020' }}>
          {contactState.toUpperCase()}
        </span>
      </div>

      <div style={{ fontSize: 12, opacity: 0.9 }}>
        Confidence: {contactConfidence.toFixed(0)}% · Radius: ±{confidenceRadiusMeters.toFixed(0)}m
      </div>
    </section>
  );
}

export default UnitCard;
