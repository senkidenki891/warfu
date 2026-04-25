import type { Cell } from './grid';
import { gridNeighbors, key } from './grid';

export function hasSupplyLine(
  depot: Cell,
  unit: Cell,
  width: number,
  height: number,
  blocked: Set<string>
): boolean {
  const queue: Cell[] = [depot];
  const seen = new Set<string>([key(depot)]);

  while (queue.length) {
    const current = queue.shift()!;
    if (current.x === unit.x && current.y === unit.y) return true;
    for (const neighbor of gridNeighbors(current, width, height)) {
      const neighborKey = key(neighbor);
      if (seen.has(neighborKey) || blocked.has(neighborKey)) continue;
      seen.add(neighborKey);
      queue.push(neighbor);
    }
  }

  return false;
}
