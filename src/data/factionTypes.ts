export type FactionDoctrine = 'combined_arms' | 'maneuver_warfare' | 'mass_fire' | 'irregular';

export interface FactionType {
  id: string;
  name: string;
  doctrine: FactionDoctrine;
  trainingLevel: number;
  logisticsLevel: number;
  electronicWarfare: number;
}

export const factionTypes: FactionType[] = [
  {
    id: 'western_coalition',
    name: 'Western Coalition',
    doctrine: 'combined_arms',
    trainingLevel: 1.2,
    logisticsLevel: 1.25,
    electronicWarfare: 1.15,
  },
  {
    id: 'post_soviet',
    name: 'Post-Soviet',
    doctrine: 'mass_fire',
    trainingLevel: 1,
    logisticsLevel: 0.95,
    electronicWarfare: 0.9,
  },
  {
    id: 'local_militia',
    name: 'Local Militia',
    doctrine: 'irregular',
    trainingLevel: 0.7,
    logisticsLevel: 0.65,
    electronicWarfare: 0.45,
  },
];
