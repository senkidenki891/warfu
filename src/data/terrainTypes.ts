export type TerrainKind =
  | 'urban'
  | 'forest'
  | 'open_field'
  | 'hills'
  | 'swamp'
  | 'desert'
  | 'mountain';

export interface TerrainType {
  id: string;
  name: string;
  kind: TerrainKind;
  movementModifier: number;
  visibilityModifier: number;
  coverModifier: number;
}

export const terrainTypes: TerrainType[] = [
  { id: 'urban_dense', name: 'Dense Urban', kind: 'urban', movementModifier: 0.65, visibilityModifier: 0.55, coverModifier: 1.35 },
  { id: 'mixed_forest', name: 'Mixed Forest', kind: 'forest', movementModifier: 0.75, visibilityModifier: 0.6, coverModifier: 1.25 },
  { id: 'steppe', name: 'Open Steppe', kind: 'open_field', movementModifier: 1, visibilityModifier: 1.2, coverModifier: 0.85 },
  { id: 'broken_hills', name: 'Broken Hills', kind: 'hills', movementModifier: 0.8, visibilityModifier: 1.05, coverModifier: 1.1 },
  { id: 'marshland', name: 'Marshland', kind: 'swamp', movementModifier: 0.55, visibilityModifier: 0.7, coverModifier: 1.1 },
];
