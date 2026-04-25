export type MoraleState = 'steady' | 'shaken' | 'suppressed' | 'routed';

export function evaluateMorale(baseMorale: number, suppression: number): MoraleState {
  const effective = baseMorale - suppression;
  if (effective <= 10) return 'routed';
  if (effective <= 30) return 'suppressed';
  if (effective <= 50) return 'shaken';
  return 'steady';
}
