import { TerrainCell, TerrainMap, TerrainType } from '../../sim/terrain/terrain';

export const VERTICAL_SLICE_MAP_WIDTH = 30;
export const VERTICAL_SLICE_MAP_HEIGHT = 20;

const baseCell = (terrain: TerrainType = 'plain'): TerrainCell => ({ terrain });

export const verticalSliceMap: TerrainMap = Array.from(
  { length: VERTICAL_SLICE_MAP_HEIGHT },
  () => Array.from({ length: VERTICAL_SLICE_MAP_WIDTH }, () => baseCell()),
);

function paintRect(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  painter: (cell: TerrainCell) => TerrainCell,
): void {
  for (let y = y0; y <= y1; y += 1) {
    for (let x = x0; x <= x1; x += 1) {
      if (!verticalSliceMap[y]?.[x]) {
        continue;
      }
      verticalSliceMap[y][x] = painter(verticalSliceMap[y][x]);
    }
  }
}

function paintLine(
  points: Array<{ x: number; y: number }>,
  painter: (cell: TerrainCell) => TerrainCell,
): void {
  for (const point of points) {
    if (!verticalSliceMap[point.y]?.[point.x]) {
      continue;
    }
    verticalSliceMap[point.y][point.x] = painter(verticalSliceMap[point.y][point.x]);
  }
}

// Village cluster
paintRect(3, 4, 8, 8, () => ({ terrain: 'village' }));

// Road backbone from west to east with a branch to village
paintLine(
  Array.from({ length: VERTICAL_SLICE_MAP_WIDTH }, (_, x) => ({ x, y: 11 })),
  (cell) => ({ ...cell, terrain: 'road', road: true }),
);
paintLine(
  [
    { x: 6, y: 11 },
    { x: 6, y: 10 },
    { x: 6, y: 9 },
    { x: 6, y: 8 },
  ],
  (cell) => ({ ...cell, terrain: 'road', road: true }),
);

// Forest belts
paintRect(11, 2, 16, 6, () => ({ terrain: 'forest' }));
paintRect(20, 13, 24, 17, () => ({ terrain: 'forest' }));

// Hill area near center-right
paintRect(18, 6, 23, 10, () => ({ terrain: 'hill' }));

// Vertical river with explicit bridge crossing
paintLine(
  Array.from({ length: VERTICAL_SLICE_MAP_HEIGHT }, (_, y) => ({ x: 14, y })),
  () => ({ terrain: 'river', river: true }),
);
verticalSliceMap[11][14] = { terrain: 'bridge', river: true, bridge: true, road: true };
verticalSliceMap[11][13] = { terrain: 'road', road: true };
verticalSliceMap[11][15] = { terrain: 'road', road: true };

// Trench line protecting eastern sector
paintLine(
  [
    { x: 21, y: 3 },
    { x: 22, y: 3 },
    { x: 23, y: 3 },
    { x: 24, y: 3 },
    { x: 25, y: 4 },
    { x: 26, y: 5 },
    { x: 27, y: 6 },
  ],
  () => ({ terrain: 'trench' }),
);

// Ruins around contested crossroads
paintRect(12, 9, 13, 10, () => ({ terrain: 'ruins', wreck: true }));

// Minefield and zoc marker examples used by movement/path systems
verticalSliceMap[10][18] = { terrain: 'plain', minefield: true };
verticalSliceMap[10][19] = { terrain: 'plain', minefield: true };
verticalSliceMap[12][17] = { terrain: 'plain', zocOwnerId: 'enemy-alpha' };
