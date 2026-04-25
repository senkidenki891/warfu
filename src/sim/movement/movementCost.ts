import { CellCoord } from '../grid/IGrid';
import {
  getBaseTerrainCost,
  getTerrainCell,
  isTerrainPassable,
  MovementProfile,
  TerrainMap,
} from '../terrain/terrain';

export interface UnitMobilityState {
  movementProfile: MovementProfile;
  mobilityDamage?: number;
  unitId?: string;
  isEngineer?: boolean;
  ignoresZoc?: boolean;
}

export interface MovementCostContext {
  map: TerrainMap;
  activeEnemyIds?: string[];
}

export function calculateMovementCost(
  from: CellCoord,
  to: CellCoord,
  unit: UnitMobilityState,
  context: MovementCostContext,
): number {
  const destinationCell = getTerrainCell(context.map, to);
  if (!destinationCell) {
    return Infinity;
  }

  if (!isTerrainPassable(destinationCell, unit.movementProfile)) {
    return Infinity;
  }

  if (
    destinationCell.occupiedByUnitId &&
    destinationCell.occupiedByUnitId !== unit.unitId
  ) {
    return Infinity;
  }

  let cost = getBaseTerrainCost(destinationCell, unit.movementProfile);

  // River crossing is only possible on bridge for regular movers.
  if (
    destinationCell.river &&
    !destinationCell.bridge &&
    unit.movementProfile !== 'amphibious' &&
    unit.movementProfile !== 'hover'
  ) {
    return Infinity;
  }

  // Wreck creates hard micro-obstacles for wheeled units and slows others.
  if (destinationCell.wreck) {
    if (unit.movementProfile === 'wheeled') {
      return Infinity;
    }
    cost += 0.8;
  }

  // Minefields are very expensive unless unit is specialized engineer.
  if (destinationCell.minefield) {
    if (unit.isEngineer) {
      cost += 1.2;
    } else if (unit.movementProfile === 'wheeled') {
      return Infinity;
    } else {
      cost += 3;
    }
  }

  // Entering enemy ZOC consumes additional movement points.
  if (
    destinationCell.zocOwnerId &&
    !unit.ignoresZoc &&
    destinationCell.zocOwnerId !== unit.unitId
  ) {
    const activeEnemySet = new Set(context.activeEnemyIds ?? []);
    const zocIsEnemy =
      activeEnemySet.size === 0 || activeEnemySet.has(destinationCell.zocOwnerId);
    if (zocIsEnemy) {
      cost += 1;
    }
  }

  // Damaged running gear proportionally increases movement spend.
  const mobilityDamage = Math.max(0, Math.min(1, unit.mobilityDamage ?? 0));
  cost *= 1 + mobilityDamage;

  // Mild turn penalty for diagonal-ish movement emulation on square grids
  // (kept simple while we prepare for axial/cube replacement later).
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  if (dx + dy > 1) {
    cost *= 1.1;
  }

  return cost;
}
