import type { Cell } from './grid';
import { key } from './grid';

export type Footprint = { width: number; height: number };

export function canPlaceFootprint(
  origin: Cell,
  footprint: Footprint,
  mapWidth: number,
  mapHeight: number,
  occupied: Set<string>
): boolean {
  for (let dx = 0; dx < footprint.width; dx += 1) {
    for (let dy = 0; dy < footprint.height; dy += 1) {
      const tile = { x: origin.x + dx, y: origin.y + dy };
      if (tile.x < 0 || tile.y < 0 || tile.x >= mapWidth || tile.y >= mapHeight) return false;
      if (occupied.has(key(tile))) return false;
    }
  }

  return true;
}
