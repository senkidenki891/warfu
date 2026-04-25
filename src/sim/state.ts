export type TeamId = 'red' | 'blue';

export interface UnitState {
  id: string;
  team: TeamId;
  hp: number;
}

export interface SimulationState {
  turn: number;
  activeTeam: TeamId;
  units: UnitState[];
  winner: TeamId | null;
}
