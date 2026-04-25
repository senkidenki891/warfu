import { describe, expect, it } from 'vitest';
import { hasSupplyLine } from '../sim/supply';

describe('supply line', () => {
  it('returns false when blocked corridor cuts route', () => {
    const blocked = new Set(['1,0', '1,1', '1,2']);
    expect(hasSupplyLine({ x: 0, y: 1 }, { x: 2, y: 1 }, 3, 3, blocked)).toBe(false);
  });

  it('returns true when route is open', () => {
    expect(hasSupplyLine({ x: 0, y: 1 }, { x: 2, y: 1 }, 3, 3, new Set())).toBe(true);
  });
});
