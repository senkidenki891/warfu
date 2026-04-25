import { CellCoord } from '../grid/IGrid';

export type TerrainType =
  | 'plain'
  | 'road'
  | 'forest'
  | 'hill'
  | 'river'
  | 'bridge'
  | 'village'
  | 'trench'
  | 'ruins';

export type MovementProfile =
  | 'infantry'
  | 'wheeled'
  | 'tracked'
  | 'amphibious'
  | 'hover';

export interface TerrainCell {
  terrain: TerrainType;
  road?: boolean;
  bridge?: boolean;
  river?: boolean;
  wreck?: boolean;
  minefield?: boolean;
  occupiedByUnitId?: string;
  zocOwnerId?: string;
}

export type TerrainMap = TerrainCell[][];

const BASE_MOVEMENT_COST: Record<TerrainType, Record<MovementProfile, number>> = {
  plain: { infantry: 1, wheeled: 1.2, tracked: 1, amphibious: 1, hover: 1 },
  road: { infantry: 0.8, wheeled: 0.6, tracked: 0.8, amphibious: 0.8, hover: 0.8 },
  forest: { infantry: 1.5, wheeled: Infinity, tracked: 2, amphibious: 2, hover: 1.4 },
  hill: { infantry: 1.6, wheeled: 2.2, tracked: 1.8, amphibious: 2, hover: 1.5 },
  river: { infantry: Infinity, wheeled: Infinity, tracked: Infinity, amphibious: 1.8, hover: 1.6 },
  bridge: { infantry: 1, wheeled: 1, tracked: 1, amphibious: 1, hover: 1 },
  village: { infantry: 1.2, wheeled: 1.4, tracked: 1.3, amphibious: 1.3, hover: 1.1 },
  trench: { infantry: 1.3, wheeled: Infinity, tracked: 2.4, amphibious: 2.2, hover: 1.8 },
  ruins: { infantry: 1.4, wheeled: Infinity, tracked: 1.9, amphibious: 2, hover: 1.7 },
};

export function getTerrainCell(map: TerrainMap, coord: CellCoord): TerrainCell | undefined {
  return map[coord.y]?.[coord.x];
}

export function getBaseTerrainCost(
  cell: TerrainCell,
  movementProfile: MovementProfile,
): number {
  const effectiveTerrain = cell.bridge ? 'bridge' : cell.terrain;
  return BASE_MOVEMENT_COST[effectiveTerrain][movementProfile];
}

export function isTerrainPassable(
  cell: TerrainCell,
  movementProfile: MovementProfile,
): boolean {
  if (cell.river && !cell.bridge && movementProfile !== 'amphibious' && movementProfile !== 'hover') {
    return false;
  }

  return Number.isFinite(getBaseTerrainCost(cell, movementProfile));
}
