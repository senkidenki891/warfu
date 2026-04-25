import type { SimulationState, TeamId } from './state';

const MAX_TURNS = 20;

export const createInitialState = (): SimulationState => ({
  turn: 1,
  activeTeam: 'red',
  units: [
    { id: 'r-1', team: 'red', hp: 10 },
    { id: 'b-1', team: 'blue', hp: 10 }
  ],
  winner: null
});

export const advanceTurn = (state: SimulationState): SimulationState => {
  if (state.winner !== null) {
    return state;
  }

  const nextTurn = state.turn + 1;
  const nextTeam: TeamId = state.activeTeam === 'red' ? 'blue' : 'red';

  return {
    ...state,
    turn: nextTurn,
    activeTeam: nextTeam,
    winner: nextTurn >= MAX_TURNS ? nextTeam : null
  };
};
