export type UnitRole =
  | 'rifle_squad'
  | 'at_team'
  | 'mortar_team'
  | 'recon_team'
  | 'engineer_team'
  | 'sam_team';

export interface UnitType {
  id: string;
  name: string;
  role: UnitRole;
  preferredFactionIds: string[];
  personnel: number;
  primaryWeaponId: string;
  movementSpeedKph: number;
  spottingRangeMeters: number;
}

export const unitTypes: UnitType[] = [
  {
    id: 'western_rifle_squad',
    name: 'Western Rifle Squad',
    role: 'rifle_squad',
    preferredFactionIds: ['western_coalition'],
    personnel: 9,
    primaryWeaponId: 'm4_carbine',
    movementSpeedKph: 6,
    spottingRangeMeters: 900,
  },
  {
    id: 'post_soviet_rifle_squad',
    name: 'Post-Soviet Motor Rifle Squad',
    role: 'rifle_squad',
    preferredFactionIds: ['post_soviet'],
    personnel: 8,
    primaryWeaponId: 'ak_74m',
    movementSpeedKph: 5.5,
    spottingRangeMeters: 850,
  },
  {
    id: 'militia_recon_team',
    name: 'Militia Recon Team',
    role: 'recon_team',
    preferredFactionIds: ['local_militia'],
    personnel: 4,
    primaryWeaponId: 'ak_74m',
    movementSpeedKph: 6.5,
    spottingRangeMeters: 1200,
  },
  {
    id: 'western_at_team',
    name: 'Western AT Team',
    role: 'at_team',
    preferredFactionIds: ['western_coalition'],
    personnel: 2,
    primaryWeaponId: 'javelin',
    movementSpeedKph: 5,
    spottingRangeMeters: 1000,
  },
  {
    id: 'post_soviet_mortar_team',
    name: 'Post-Soviet Mortar Team',
    role: 'mortar_team',
    preferredFactionIds: ['post_soviet'],
    personnel: 5,
    primaryWeaponId: '120mm_mortar',
    movementSpeedKph: 4.5,
    spottingRangeMeters: 700,
  },
  {
    id: 'militia_sam_team',
    name: 'Militia MANPADS Team',
    role: 'sam_team',
    preferredFactionIds: ['local_militia'],
    personnel: 2,
    primaryWeaponId: 'stinger_launcher',
    movementSpeedKph: 5,
    spottingRangeMeters: 1100,
  },
];
