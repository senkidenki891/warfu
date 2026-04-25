import { dataRegistry } from './dataRegistry';
import { type ScenarioConfig } from './scenarioConfig';

export interface ResolvedForce {
  faction: (typeof dataRegistry.factionTypes)[number];
  units: (typeof dataRegistry.unitTypes)[number][];
  vehicles: (typeof dataRegistry.vehicleTypes)[number][];
}

export interface ResolvedScenario {
  id: string;
  name: string;
  terrain: (typeof dataRegistry.terrainTypes)[number];
  weather: (typeof dataRegistry.weatherTypes)[number];
  attacker: ResolvedForce;
  defender: ResolvedForce;
}

const mustGet = <T>(entry: T | undefined, message: string): T => {
  if (!entry) {
    throw new Error(message);
  }
  return entry;
};

const resolveForce = (config: ScenarioConfig['attacker']): ResolvedForce => ({
  faction: mustGet(dataRegistry.factionById[config.factionId], `Unknown faction: ${config.factionId}`),
  units: config.unitTypeIds.map((id) => mustGet(dataRegistry.unitById[id], `Unknown unit type: ${id}`)),
  vehicles: config.vehicleTypeIds.map((id) => mustGet(dataRegistry.vehicleById[id], `Unknown vehicle type: ${id}`)),
});

export const resolveScenario = (config: ScenarioConfig): ResolvedScenario => ({
  id: config.id,
  name: config.name,
  terrain: mustGet(dataRegistry.terrainById[config.terrainTypeId], `Unknown terrain: ${config.terrainTypeId}`),
  weather: mustGet(dataRegistry.weatherById[config.weatherTypeId], `Unknown weather: ${config.weatherTypeId}`),
  attacker: resolveForce(config.attacker),
  defender: resolveForce(config.defender),
});
