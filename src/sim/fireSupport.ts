export function artilleryImpactTime(requestAt: number, prepDelay: number, commsDelay: number): number {
  return requestAt + prepDelay + commsDelay;
}

export function resolveAirDefenseEngagement(
  interceptionChance: number,
  randomRoll: number,
  missionDamage: number
): { intercepted: boolean; damageDelivered: number } {
  const intercepted = randomRoll <= interceptionChance;
  return {
    intercepted,
    damageDelivered: intercepted ? Math.round(missionDamage * 0.25) : missionDamage
  };
}
