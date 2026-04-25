export type MoraleState = 'steady' | 'shaken' | 'wavering' | 'broken' | 'routed';

export interface MoraleInput {
  currentMorale: number;
  suppression: number;
  nearbyAllies: number;
  leaderBonus?: number;
  casualtiesRatio?: number;
}

export interface MoraleResult {
  morale: number;
  state: MoraleState;
}

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export function resolveMorale({
  currentMorale,
  suppression,
  nearbyAllies,
  leaderBonus = 0,
  casualtiesRatio = 0,
}: MoraleInput): MoraleResult {
  const allyBuffer = Math.min(nearbyAllies * 2.5, 15);
  const suppressionPenalty = suppression * 0.45;
  const casualtyPenalty = casualtiesRatio * 45;

  const morale = clamp(
    currentMorale + allyBuffer + leaderBonus - suppressionPenalty - casualtyPenalty,
    0,
    100,
  );

  let state: MoraleState = 'steady';
  if (morale < 20) state = 'routed';
  else if (morale < 35) state = 'broken';
  else if (morale < 50) state = 'wavering';
  else if (morale < 70) state = 'shaken';

  return { morale, state };
}
