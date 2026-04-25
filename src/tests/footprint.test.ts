import { describe, expect, it } from 'vitest';
import { canPlaceFootprint } from '../sim/footprint';

describe('footprint placement', () => {
  it('accepts valid free area', () => {
    expect(canPlaceFootprint({ x: 1, y: 1 }, { width: 2, height: 2 }, 5, 5, new Set())).toBe(true);
  });

  it('rejects overlap or out of bounds', () => {
    const occupied = new Set(['2,2']);
    expect(canPlaceFootprint({ x: 1, y: 1 }, { width: 2, height: 2 }, 5, 5, occupied)).toBe(false);
    expect(canPlaceFootprint({ x: 4, y: 4 }, { width: 2, height: 2 }, 5, 5, new Set())).toBe(false);
  });
});
