export type VehicleStatus = 'operational' | 'damaged' | 'immobilized' | 'mission_kill' | 'destroyed';

export interface VehicleComponentState {
  engine: number;
  transmission: number;
  tracks: number;
  turretRing: number;
  optics: number;
  gun: number;
  ammoRack: number;
  fuelSystem: number;
}

export interface CrewState {
  commander: number;
  gunner: number;
  loader: number;
  driver: number;
}

export interface VehicleState {
  id: string;
  hp: number;
  maxHp: number;
  onFire: boolean;
  ammoCookoffRisk: number;
  status: VehicleStatus;
  components: VehicleComponentState;
  crew: CrewState;
}

export interface DamageEvent {
  component?: keyof VehicleComponentState;
  crewRole?: keyof CrewState;
  damage: number;
  overmatch?: boolean;
  spall?: boolean;
}

export interface CriticalEffects {
  ignition: boolean;
  ammoCookoff: boolean;
  updatedFireRisk: number;
}

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

export function applyComponentDamage(
  state: VehicleState,
  event: DamageEvent,
): VehicleState {
  if (!event.component) {
    return state;
  }

  const component = event.component;
  const baseDamage = event.damage * (event.overmatch ? 1.25 : 1);
  const nextValue = clamp(state.components[component] - baseDamage, 0, 100);

  return {
    ...state,
    components: {
      ...state.components,
      [component]: nextValue,
    },
  };
}

export function applyCrewDamage(state: VehicleState, event: DamageEvent): VehicleState {
  if (!event.crewRole) {
    return state;
  }

  const role = event.crewRole;
  const spallModifier = event.spall ? 1.35 : 1;
  const nextHealth = clamp(state.crew[role] - event.damage * spallModifier, 0, 100);

  return {
    ...state,
    crew: {
      ...state.crew,
      [role]: nextHealth,
    },
  };
}

export function checkFireAndAmmoCookoff(
  state: VehicleState,
  event: DamageEvent,
  rng: () => number = Math.random,
): CriticalEffects {
  const fuelHit = event.component === 'fuelSystem';
  const ammoHit = event.component === 'ammoRack';

  const fireRiskGain = fuelHit ? 0.22 : ammoHit ? 0.12 : 0.05;
  const updatedFireRisk = clamp(state.ammoCookoffRisk + fireRiskGain, 0, 0.95);

  const ignitionThreshold = (fuelHit ? 0.35 : 0.55) - (event.overmatch ? 0.1 : 0);
  const ignition = !state.onFire && rng() < updatedFireRisk * (1 - ignitionThreshold);

  const cookoffChance = ammoHit ? updatedFireRisk * 0.5 + (event.overmatch ? 0.15 : 0) : updatedFireRisk * 0.1;
  const ammoCookoff = rng() < clamp(cookoffChance, 0, 0.9);

  return {
    ignition,
    ammoCookoff,
    updatedFireRisk,
  };
}

export function updateVehicleStatus(state: VehicleState): VehicleState {
  const componentValues = Object.values(state.components);
  const crewValues = Object.values(state.crew);

  const mobility = Math.min(state.components.engine, state.components.transmission, state.components.tracks);
  const firepower = Math.min(state.components.gun, state.components.optics, state.components.turretRing);
  const crewAvg = crewValues.reduce((a, b) => a + b, 0) / crewValues.length;

  let status: VehicleStatus = 'operational';
  if (state.hp <= 0 || state.components.ammoRack <= 0) {
    status = 'destroyed';
  } else if (mobility <= 0 || firepower <= 0 || crewAvg < 30) {
    status = 'mission_kill';
  } else if (mobility < 25) {
    status = 'immobilized';
  } else if (componentValues.some((value) => value < 70) || state.hp < state.maxHp * 0.75) {
    status = 'damaged';
  }

  return {
    ...state,
    status,
  };
}
