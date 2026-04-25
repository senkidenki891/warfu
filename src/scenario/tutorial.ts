export interface ScenarioDefinition {
  id: string;
  title: string;
  description: string;
}

export const tutorialScenario: ScenarioDefinition = {
  id: 'tutorial-01',
  title: 'Tutorial Skirmish',
  description: 'Minimal scenario for validating app wiring.'
};
