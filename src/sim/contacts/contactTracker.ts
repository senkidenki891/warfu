export type ContactState = 'tracked' | 'observed' | 'estimated' | 'suspected' | 'unknown';

export interface ContactRecord {
  id: string;
  state: ContactState;
  confidence: number;
  confidenceRadiusMeters: number;
  staleSeconds: number;
  isFalse: boolean;
  isDecoy: boolean;
  lastKnownPosition: { x: number; y: number };
}

export interface ContactUpdateInput {
  contact: ContactRecord;
  deltaSeconds: number;
  freshConfidence?: number;
  freshRadiusMeters?: number;
  hasSensorRefresh?: boolean;
  forcedDecoy?: boolean;
}

const STATE_ORDER: ContactState[] = ['tracked', 'observed', 'estimated', 'suspected', 'unknown'];

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

function degradeState(current: ContactState, steps: number): ContactState {
  const idx = STATE_ORDER.indexOf(current);
  const nextIndex = clamp(idx + steps, 0, STATE_ORDER.length - 1);
  return STATE_ORDER[nextIndex];
}

export function updateContact(input: ContactUpdateInput): ContactRecord {
  const {
    contact,
    deltaSeconds,
    freshConfidence,
    freshRadiusMeters,
    hasSensorRefresh = false,
    forcedDecoy,
  } = input;

  if (hasSensorRefresh && typeof freshConfidence === 'number') {
    return {
      ...contact,
      state: freshConfidence >= 80 ? 'tracked' : freshConfidence >= 65 ? 'observed' : 'estimated',
      confidence: clamp(freshConfidence, 0, 100),
      confidenceRadiusMeters: clamp(freshRadiusMeters ?? contact.confidenceRadiusMeters, 15, 2000),
      staleSeconds: 0,
      isFalse: false,
      isDecoy: forcedDecoy ?? contact.isDecoy,
    };
  }

  const staleSeconds = contact.staleSeconds + deltaSeconds;
  const degradeSteps = Math.floor(staleSeconds / 20);
  const state = degradeState(contact.state, degradeSteps);

  const confidenceDecay = deltaSeconds * (contact.isDecoy ? 0.9 : 0.55);
  const confidence = clamp(contact.confidence - confidenceDecay, 0, 100);
  const radiusGrowth = deltaSeconds * (contact.isDecoy ? 16 : 11);
  const confidenceRadiusMeters = clamp(contact.confidenceRadiusMeters + radiusGrowth, 20, 3000);

  const isFalse = forcedDecoy ?? contact.isFalse || (confidence < 25 && staleSeconds > 40);
  const isDecoy = forcedDecoy ?? contact.isDecoy || (confidence < 35 && staleSeconds > 30);

  return {
    ...contact,
    state,
    confidence,
    confidenceRadiusMeters,
    staleSeconds,
    isFalse,
    isDecoy,
  };
}
