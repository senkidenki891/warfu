import { describe, expect, it } from 'vitest';
import { selectViewState } from '@sim/selectors';
import type { SimulationState } from '@sim/state';

describe('selectors', () => {
  it('creates user-facing labels from state', () => {
    const state: SimulationState = {
      turn: 3,
      activeTeam: 'blue',
      units: [],
      winner: null
    };

    expect(selectViewState(state)).toEqual({
      turnLabel: 'Turn 3',
      activeTeamLabel: 'Active team: blue',
      winnerLabel: 'No winner yet'
    });
  });
});
