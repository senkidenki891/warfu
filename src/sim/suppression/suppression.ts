export interface SuppressionInput {
  currentSuppression: number;
  incomingFirepower: number;
  distanceMeters: number;
  coverModifier?: number;
  pinned?: boolean;
}

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

export function accumulateSuppression({
  currentSuppression,
  incomingFirepower,
  distanceMeters,
  coverModifier = 1,
  pinned = false,
}: SuppressionInput): number {
  const distanceFactor = clamp(1 - distanceMeters / 1000, 0.2, 1);
  const baseGain = incomingFirepower * distanceFactor * coverModifier;
  const pinnedPenalty = pinned ? 0.2 : 0;

  return clamp(currentSuppression + baseGain + pinnedPenalty, 0, 100);
}

export function recoverSuppression(currentSuppression: number, cohesion: number): number {
  const recovery = 4 + cohesion * 0.08;
  return clamp(currentSuppression - recovery, 0, 100);
}
