import type { Cell } from './grid';
import { gridNeighbors, key } from './grid';

export type CostMap = number[][];

type ScoredCell = { cell: Cell; score: number };

export function movementCost(path: Cell[], costMap: CostMap): number {
  return path.slice(1).reduce((acc, c) => acc + costMap[c.y][c.x], 0);
}

export function findPath(start: Cell, goal: Cell, costMap: CostMap): Cell[] {
  const height = costMap.length;
  const width = costMap[0]?.length ?? 0;
  const open: ScoredCell[] = [{ cell: start, score: 0 }];
  const cameFrom = new Map<string, string>();
  const gScore = new Map<string, number>([[key(start), 0]]);

  while (open.length > 0) {
    open.sort((a, b) => a.score - b.score);
    const current = open.shift()!.cell;

    if (current.x === goal.x && current.y === goal.y) {
      const path: Cell[] = [goal];
      let currentKey = key(goal);
      while (cameFrom.has(currentKey)) {
        const previous = cameFrom.get(currentKey)!;
        const [x, y] = previous.split(',').map(Number);
        path.unshift({ x, y });
        currentKey = previous;
      }
      return path;
    }

    for (const neighbor of gridNeighbors(current, width, height)) {
      const traversalCost = costMap[neighbor.y][neighbor.x];
      if (traversalCost === Infinity) continue;
      const tentative = (gScore.get(key(current)) ?? Infinity) + traversalCost;
      if (tentative < (gScore.get(key(neighbor)) ?? Infinity)) {
        cameFrom.set(key(neighbor), key(current));
        gScore.set(key(neighbor), tentative);
        open.push({ cell: neighbor, score: tentative });
      }
    }
  }

  return [];
}
