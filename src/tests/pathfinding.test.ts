import { describe, expect, it } from 'vitest';
import { findPath, movementCost } from '../sim/pathfinding';

describe('pathfinding/movement cost', () => {
  it('finds the cheapest path around blocked cells and computes cost', () => {
    const map = [
      [1, 1, 1],
      [Infinity, Infinity, 1],
      [1, 1, 1]
    ];

    const path = findPath({ x: 0, y: 0 }, { x: 2, y: 2 }, map);
    expect(path).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 }
    ]);
    expect(movementCost(path, map)).toBe(4);
  });
});
