import { describe, expect, it } from 'vitest';
import { applyHit } from '../sim/damage';

describe('vehicle hit/component damage', () => {
  it('reduces hull hp and targeted component hp', () => {
    const vehicle = {
      hp: 100,
      components: {
        engine: 40,
        optics: 20
      }
    };

    const damaged = applyHit(vehicle, 15, 'engine');
    expect(damaged.hp).toBe(85);
    expect(damaged.components.engine).toBe(25);
    expect(damaged.components.optics).toBe(20);
  });
});
