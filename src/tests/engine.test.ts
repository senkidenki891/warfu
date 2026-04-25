import { describe, expect, it } from 'vitest';
import { advanceTurn, createInitialState } from '@sim/engine';

describe('engine', () => {
  it('advances turn and switches active team', () => {
    const initial = createInitialState();

    const next = advanceTurn(initial);

    expect(next.turn).toBe(2);
    expect(next.activeTeam).toBe('blue');
  });
});
