import { ammoTypes } from '../data/ammoTypes';
import { balanceConstants } from '../data/balanceConstants';
import { factionTypes } from '../data/factionTypes';
import { terrainTypes } from '../data/terrainTypes';
import { unitTypes } from '../data/unitTypes';
import { vehicleTypes } from '../data/vehicleTypes';
import { weaponTypes } from '../data/weaponTypes';
import { weatherTypes } from '../data/weatherTypes';

const byId = <T extends { id: string }>(entries: T[]) =>
  entries.reduce<Record<string, T>>((acc, entry) => {
    acc[entry.id] = entry;
    return acc;
  }, {});

export const dataRegistry = {
  terrainTypes,
  terrainById: byId(terrainTypes),
  factionTypes,
  factionById: byId(factionTypes),
  unitTypes,
  unitById: byId(unitTypes),
  vehicleTypes,
  vehicleById: byId(vehicleTypes),
  weaponTypes,
  weaponById: byId(weaponTypes),
  ammoTypes,
  ammoById: byId(ammoTypes),
  weatherTypes,
  weatherById: byId(weatherTypes),
  balanceConstants,
};

export type DataRegistry = typeof dataRegistry;
