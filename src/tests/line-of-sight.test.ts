import { describe, expect, it } from 'vitest';
import { hasLineOfSight } from '../sim/lineOfSight';

describe('line of sight', () => {
  it('is blocked when obstacle intersects ray', () => {
    expect(hasLineOfSight({ x: 0, y: 0 }, { x: 4, y: 4 }, new Set(['2,2']))).toBe(false);
  });

  it('is clear with no blockers', () => {
    expect(hasLineOfSight({ x: 0, y: 0 }, { x: 4, y: 4 }, new Set())).toBe(true);
  });
});
