import type { LineOfSightResult } from '../visibility/lineOfSight';

export interface DetectionInput {
  observerSkill: number;
  sensorQuality: number;
  targetSignature: number;
  targetSpeed: number;
  distanceMeters: number;
  concealmentFactor: number;
  lineOfSight: LineOfSightResult;
  rng?: () => number;
}

export interface DetectionResult {
  detected: boolean;
  confidence: number;
  confidenceRadiusMeters: number;
  isFalsePositive: boolean;
}

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export function detectTarget({
  observerSkill,
  sensorQuality,
  targetSignature,
  targetSpeed,
  distanceMeters,
  concealmentFactor,
  lineOfSight,
  rng = Math.random,
}: DetectionInput): DetectionResult {
  const distancePenalty = clamp(distanceMeters / 1800, 0, 1);
  const motionBonus = clamp(targetSpeed / 60, 0, 0.25);

  const baseScore =
    observerSkill * 0.35 +
    sensorQuality * 0.35 +
    targetSignature * 0.25 +
    motionBonus * 100 -
    concealmentFactor * 45 -
    distancePenalty * 55;

  const losBonus = lineOfSight.hasLineOfSight ? 12 : -8;
  const scoreWithLos = baseScore + losBonus + lineOfSight.visibilityFactor * 20;

  const confidence = clamp(scoreWithLos + (rng() * 2 - 1) * 10, 0, 100);
  const detected = confidence >= 45;

  const confidenceRadiusMeters = clamp(400 - confidence * 3 + distanceMeters * 0.2, 30, 1200);
  const falsePositiveThreshold = lineOfSight.hasLineOfSight ? 0.05 : 0.2;
  const isFalsePositive = detected && rng() < falsePositiveThreshold * (1 - confidence / 100);

  return {
    detected,
    confidence,
    confidenceRadiusMeters,
    isFalsePositive,
  };
}
