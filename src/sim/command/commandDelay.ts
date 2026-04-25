import type { Priority } from '../types/command';

export interface CommandDelayInput {
  /** Straight line distance in km */
  distanceKm: number;
  /** Effective radio quality, 0..1 */
  radioQuality: number;
  /** Friendly EW/jamming pressure, 0..1 */
  jamming: number;
  /** HQ suppression state, 0..1 */
  suppression: number;
  /** Staff/workflow load multiplier, usually from calculateStaffWorkload */
  workloadMultiplier: number;
  priority: Priority;
  /** Optional weather attenuation, 0..1 */
  weatherImpact?: number;
  /** Optional terrain attenuation, 0..1 */
  terrainImpact?: number;
}

export interface CommandDelayResult {
  seconds: number;
  reliability: number;
  breakdown: {
    baseSeconds: number;
    distanceFactor: number;
    commsFactor: number;
    suppressionFactor: number;
    workloadFactor: number;
    priorityFactor: number;
    weatherFactor: number;
    terrainFactor: number;
  };
}

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

const priorityDelayFactor: Record<Priority, number> = {
  critical: 0.75,
  high: 0.9,
  normal: 1,
  low: 1.25,
};

const priorityReliabilityBonus: Record<Priority, number> = {
  critical: 0.08,
  high: 0.05,
  normal: 0,
  low: -0.05,
};

/**
 * Formula combines distance, comms health, suppression and workload.
 */
export function calculateCommandDelay(input: CommandDelayInput): CommandDelayResult {
  const distance = Math.max(0, input.distanceKm);
  const radioQuality = clamp(input.radioQuality, 0, 1);
  const jamming = clamp(input.jamming, 0, 1);
  const suppression = clamp(input.suppression, 0, 1);
  const workload = Math.max(0.6, input.workloadMultiplier);
  const weather = clamp(input.weatherImpact ?? 0, 0, 1);
  const terrain = clamp(input.terrainImpact ?? 0, 0, 1);

  const baseSeconds = 45;
  const distanceFactor = 1 + distance / 22;
  const commsFactor = 1 + (1 - radioQuality) * 1.2 + jamming * 1.1;
  const suppressionFactor = 1 + suppression * 0.9;
  const workloadFactor = workload;
  const priorityFactor = priorityDelayFactor[input.priority];
  const weatherFactor = 1 + weather * 0.5;
  const terrainFactor = 1 + terrain * 0.45;

  const rawDelay =
    baseSeconds *
    distanceFactor *
    commsFactor *
    suppressionFactor *
    workloadFactor *
    priorityFactor *
    weatherFactor *
    terrainFactor;

  const reliability = clamp(
    0.96 -
      (distance / 300) * 0.2 -
      (1 - radioQuality) * 0.25 -
      jamming * 0.18 -
      suppression * 0.15 -
      (workload - 1) * 0.12 -
      weather * 0.08 -
      terrain * 0.07 +
      priorityReliabilityBonus[input.priority],
    0.05,
    0.99,
  );

  return {
    seconds: Math.max(5, Math.round(rawDelay)),
    reliability,
    breakdown: {
      baseSeconds,
      distanceFactor,
      commsFactor,
      suppressionFactor,
      workloadFactor,
      priorityFactor,
      weatherFactor,
      terrainFactor,
    },
  };
}
