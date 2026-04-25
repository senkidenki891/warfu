import { describe, expect, it } from 'vitest';
import { gridDistance, gridNeighbors } from '../sim/grid';

describe('grid distance/neighbors', () => {
  it('computes Manhattan distance', () => {
    expect(gridDistance({ x: 1, y: 1 }, { x: 4, y: 5 })).toBe(7);
  });

  it('returns bounded orthogonal neighbors', () => {
    expect(gridNeighbors({ x: 0, y: 0 }, 3, 3)).toEqual([
      { x: 1, y: 0 },
      { x: 0, y: 1 }
    ]);
  });
});
