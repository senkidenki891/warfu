import {
  calculateEffectiveArmor,
  calculatePenetration,
  type PenetrationResult,
} from '../armor/penetration';
import {
  applyComponentDamage,
  applyCrewDamage,
  checkFireAndAmmoCookoff,
  updateVehicleStatus,
  type VehicleComponentState,
  type VehicleState,
} from '../damage/vehicleDamage';

export type HitLocation =
  | 'glacis'
  | 'lowerPlate'
  | 'turretFront'
  | 'turretSide'
  | 'hullSide'
  | 'rear'
  | 'tracks'
  | 'roof';

export interface VehicleArmorProfile {
  glacis: number;
  lowerPlate: number;
  turretFront: number;
  turretSide: number;
  hullSide: number;
  rear: number;
  tracks: number;
  roof: number;
}

export interface ResolveVehicleHitInput {
  vehicle: VehicleState;
  armor: VehicleArmorProfile;
  nominalPenetrationMm: number;
  impactAngleDeg: number;
  distanceMeters: number;
  rng?: () => number;
}

export interface ResolveVehicleHitResult {
  location: HitLocation;
  penetration: PenetrationResult;
  vehicle: VehicleState;
  ignition: boolean;
  ammoCookoff: boolean;
}

export function rollHitLocation(rng: () => number = Math.random): HitLocation {
  const roll = rng();

  if (roll < 0.2) return 'glacis';
  if (roll < 0.3) return 'lowerPlate';
  if (roll < 0.45) return 'turretFront';
  if (roll < 0.6) return 'turretSide';
  if (roll < 0.75) return 'hullSide';
  if (roll < 0.85) return 'rear';
  if (roll < 0.95) return 'tracks';
  return 'roof';
}

const LOCATION_COMPONENT_MAP: Record<HitLocation, Array<keyof VehicleComponentState>> = {
  glacis: ['fuelSystem', 'transmission'],
  lowerPlate: ['transmission', 'tracks'],
  turretFront: ['gun', 'optics', 'turretRing'],
  turretSide: ['turretRing', 'ammoRack', 'optics'],
  hullSide: ['engine', 'fuelSystem', 'tracks'],
  rear: ['engine', 'fuelSystem', 'ammoRack'],
  tracks: ['tracks', 'transmission'],
  roof: ['ammoRack', 'gun'],
};

const LOCATION_CREW_MAP: Record<HitLocation, Array<keyof VehicleState['crew']>> = {
  glacis: ['driver'],
  lowerPlate: ['driver'],
  turretFront: ['commander', 'gunner'],
  turretSide: ['gunner', 'loader'],
  hullSide: ['driver', 'loader'],
  rear: ['loader'],
  tracks: ['driver'],
  roof: ['commander', 'loader'],
};

export function resolveVehicleHit({
  vehicle,
  armor,
  nominalPenetrationMm,
  impactAngleDeg,
  distanceMeters,
  rng = Math.random,
}: ResolveVehicleHitInput): ResolveVehicleHitResult {
  const location = rollHitLocation(rng);
  const effectiveArmorMm = calculateEffectiveArmor({
    baseArmorMm: armor[location],
    impactAngleDeg,
    normalizationDeg: 4,
    spacedArmorMm: location === 'tracks' ? 10 : 0,
  });

  const penetration = calculatePenetration({
    nominalPenetrationMm,
    distanceMeters,
    effectiveArmorMm,
    rng,
  });

  let updated = vehicle;
  let ignition = false;
  let ammoCookoff = false;

  if (penetration.didPenetrate) {
    const componentCandidates = LOCATION_COMPONENT_MAP[location];
    const crewCandidates = LOCATION_CREW_MAP[location];
    const component = componentCandidates[Math.floor(rng() * componentCandidates.length)];
    const crewRole = crewCandidates[Math.floor(rng() * crewCandidates.length)];

    const damage = Math.max(8, penetration.marginMm * 0.15);

    updated = applyComponentDamage(updated, {
      component,
      damage,
      overmatch: penetration.marginMm > 50,
    });
    updated = applyCrewDamage(updated, {
      crewRole,
      damage: damage * 0.75,
      spall: true,
    });

    const criticalEffects = checkFireAndAmmoCookoff(
      updated,
      { component, damage, overmatch: penetration.marginMm > 50 },
      rng,
    );

    ignition = criticalEffects.ignition;
    ammoCookoff = criticalEffects.ammoCookoff;

    updated = {
      ...updated,
      hp: Math.max(0, updated.hp - damage * 1.5 - (ammoCookoff ? 70 : 0)),
      onFire: updated.onFire || ignition,
      ammoCookoffRisk: criticalEffects.updatedFireRisk,
    };
  } else if (location === 'tracks' || location === 'turretFront') {
    // Непробитие все равно может вывести из строя внешние компоненты.
    updated = applyComponentDamage(updated, {
      component: location === 'tracks' ? 'tracks' : 'optics',
      damage: 6,
    });
  }

  updated = updateVehicleStatus(updated);

  return {
    location,
    penetration,
    vehicle: updated,
    ignition,
    ammoCookoff,
  };
}
