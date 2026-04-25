import { useSimulationController } from '@sim/controller';

export const App = (): JSX.Element => {
  const { view, state, onNextTurn } = useSimulationController();

  return (
    <main>
      <h1>Warfu simulation shell</h1>
      <p>{view.turnLabel}</p>
      <p>{view.activeTeamLabel}</p>
      <p>{view.winnerLabel}</p>
      <p>Units: {state.units.length}</p>
      <button type="button" onClick={onNextTurn} disabled={state.winner !== null}>
        Next turn
      </button>
    </main>
  );
};
