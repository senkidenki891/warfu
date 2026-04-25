export interface EffectiveArmorInput {
  baseArmorMm: number;
  impactAngleDeg?: number;
  normalizationDeg?: number;
  spacedArmorMm?: number;
  reactiveArmorBonusMm?: number;
  armorQualityModifier?: number;
}

export interface PenetrationInput {
  nominalPenetrationMm: number;
  distanceMeters?: number;
  referenceDistanceMeters?: number;
  falloffPer100m?: number;
  rng?: () => number;
  penetrationVariance?: number;
  effectiveArmorMm: number;
}

export interface PenetrationResult {
  adjustedPenetrationMm: number;
  effectiveArmorMm: number;
  marginMm: number;
  didPenetrate: boolean;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

/**
 * Вычисляет приведенную броню с учетом угла попадания,
 * нормализации снаряда и дополнительных защитных слоев.
 */
export function calculateEffectiveArmor({
  baseArmorMm,
  impactAngleDeg = 0,
  normalizationDeg = 0,
  spacedArmorMm = 0,
  reactiveArmorBonusMm = 0,
  armorQualityModifier = 1,
}: EffectiveArmorInput): number {
  const correctedAngle = clamp(impactAngleDeg - normalizationDeg, 0, 85);
  const radians = (correctedAngle * Math.PI) / 180;

  // При больших углах приведенная толщина растет как 1/cos(theta)
  const slopedArmor = baseArmorMm / Math.max(Math.cos(radians), 0.1);
  const layeredArmor = slopedArmor + spacedArmorMm + reactiveArmorBonusMm;

  return Math.max(0, layeredArmor * Math.max(0.1, armorQualityModifier));
}

/**
 * Сравнивает фактическое пробитие с приведенной броней.
 */
export function calculatePenetration({
  nominalPenetrationMm,
  distanceMeters = 0,
  referenceDistanceMeters = 500,
  falloffPer100m = 0.015,
  rng = Math.random,
  penetrationVariance = 0.1,
  effectiveArmorMm,
}: PenetrationInput): PenetrationResult {
  const rangeDelta = Math.max(0, distanceMeters - referenceDistanceMeters);
  const rangeFactor = Math.max(0.2, 1 - (rangeDelta / 100) * falloffPer100m);

  const spread = clamp(penetrationVariance, 0, 0.5);
  const randomFactor = 1 + (rng() * 2 - 1) * spread;

  const adjustedPenetrationMm = nominalPenetrationMm * rangeFactor * randomFactor;
  const marginMm = adjustedPenetrationMm - effectiveArmorMm;

  return {
    adjustedPenetrationMm,
    effectiveArmorMm,
    marginMm,
    didPenetrate: marginMm >= 0,
  };
}
