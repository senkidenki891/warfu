import type { SimulationState } from './state';

export interface ViewState {
  turnLabel: string;
  activeTeamLabel: string;
  winnerLabel: string;
}

export const selectViewState = (state: SimulationState): ViewState => ({
  turnLabel: `Turn ${state.turn}`,
  activeTeamLabel: `Active team: ${state.activeTeam}`,
  winnerLabel: state.winner === null ? 'No winner yet' : `Winner: ${state.winner}`
});
