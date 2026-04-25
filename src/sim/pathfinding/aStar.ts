import { CellCoord, IGrid } from '../grid/IGrid';
import { calculateMovementCost, MovementCostContext, UnitMobilityState } from '../movement/movementCost';

export interface PathfindingOptions {
  maxExpandedNodes?: number;
}

export interface PathResult {
  path: CellCoord[];
  totalCost: number;
}

interface FrontierNode {
  coord: CellCoord;
  fScore: number;
}

const toKey = (coord: CellCoord): string => `${coord.x},${coord.y}`;

export function findPath(
  grid: IGrid,
  start: CellCoord,
  goal: CellCoord,
  unit: UnitMobilityState,
  context: MovementCostContext,
  options: PathfindingOptions = {},
): PathResult | null {
  if (!grid.isInside(start) || !grid.isInside(goal)) {
    return null;
  }

  const maxExpandedNodes = options.maxExpandedNodes ?? 10_000;
  let expandedNodes = 0;

  const frontier: FrontierNode[] = [{ coord: start, fScore: 0 }];
  const cameFrom = new Map<string, string>();
  const gScore = new Map<string, number>([[toKey(start), 0]]);

  while (frontier.length > 0 && expandedNodes < maxExpandedNodes) {
    frontier.sort((a, b) => a.fScore - b.fScore);
    const current = frontier.shift();

    if (!current) {
      break;
    }

    expandedNodes += 1;
    if (current.coord.x === goal.x && current.coord.y === goal.y) {
      const path = reconstructPath(cameFrom, current.coord);
      return { path, totalCost: gScore.get(toKey(current.coord)) ?? Infinity };
    }

    for (const neighbor of grid.getNeighbors(current.coord)) {
      const stepCost = calculateMovementCost(current.coord, neighbor, unit, context);
      if (!Number.isFinite(stepCost)) {
        continue;
      }

      const currentCost = gScore.get(toKey(current.coord)) ?? Infinity;
      const tentativeG = currentCost + stepCost;
      const neighborKey = toKey(neighbor);
      const knownG = gScore.get(neighborKey) ?? Infinity;

      if (tentativeG < knownG) {
        cameFrom.set(neighborKey, toKey(current.coord));
        gScore.set(neighborKey, tentativeG);
        const h = grid.getDistance(neighbor, goal);
        const f = tentativeG + h;

        const existing = frontier.find((node) => toKey(node.coord) === neighborKey);
        if (existing) {
          existing.fScore = f;
        } else {
          frontier.push({ coord: neighbor, fScore: f });
        }
      }
    }
  }

  return null;
}

function reconstructPath(
  cameFrom: Map<string, string>,
  end: CellCoord,
): CellCoord[] {
  const path: CellCoord[] = [end];
  let currentKey = toKey(end);

  while (cameFrom.has(currentKey)) {
    const previousKey = cameFrom.get(currentKey);
    if (!previousKey) {
      break;
    }

    const [x, y] = previousKey.split(',').map(Number);
    path.push({ x, y });
    currentKey = previousKey;
  }

  return path.reverse();
}
