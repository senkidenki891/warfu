import { useCallback, useMemo, useState } from 'react';
import { advanceTurn, createInitialState } from './engine';
import { selectViewState } from './selectors';
import type { SimulationState } from './state';

export interface SimulationController {
  state: SimulationState;
  view: ReturnType<typeof selectViewState>;
  onNextTurn: () => void;
}

export const useSimulationController = (): SimulationController => {
  const [state, setState] = useState<SimulationState>(() => createInitialState());

  const onNextTurn = useCallback(() => {
    setState((previous) => advanceTurn(previous));
  }, []);

  const view = useMemo(() => selectViewState(state), [state]);

  return { state, view, onNextTurn };
};
