import { CellCoord, IGrid } from '../grid/IGrid';
import { isTerrainPassable, MovementProfile, TerrainMap, getTerrainCell } from '../terrain/terrain';

export interface UnitFootprint {
  offsets: CellCoord[];
}

export interface PlacementOptions {
  movingUnitId?: string;
  ignoreMines?: boolean;
}

export function getFootprintCells(anchor: CellCoord, footprint: UnitFootprint): CellCoord[] {
  return footprint.offsets.map((offset) => ({
    x: anchor.x + offset.x,
    y: anchor.y + offset.y,
  }));
}

export function canPlaceUnit(
  grid: IGrid,
  map: TerrainMap,
  anchor: CellCoord,
  footprint: UnitFootprint,
  movementProfile: MovementProfile,
  options: PlacementOptions = {},
): boolean {
  const cells = getFootprintCells(anchor, footprint);

  return cells.every((coord) => {
    if (!grid.isInside(coord)) {
      return false;
    }

    const cell = getTerrainCell(map, coord);
    if (!cell) {
      return false;
    }

    if (!isTerrainPassable(cell, movementProfile)) {
      return false;
    }

    if (cell.minefield && !options.ignoreMines) {
      return false;
    }

    if (cell.occupiedByUnitId && cell.occupiedByUnitId !== options.movingUnitId) {
      return false;
    }

    return true;
  });
}
