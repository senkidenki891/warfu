export type VehicleRole = 'mbt' | 'ifv' | 'apc' | 'spaag' | 'sam' | 'mortar_carrier' | 'recon';

export interface VehicleType {
  id: string;
  name: string;
  role: VehicleRole;
  preferredFactionIds: string[];
  crew: number;
  armorFrontMmRha: number;
  maxSpeedKph: number;
  primaryWeaponId: string;
  secondaryWeaponId?: string;
}

export const vehicleTypes: VehicleType[] = [
  {
    id: 'm1a2_sep',
    name: 'M1A2 SEP',
    role: 'mbt',
    preferredFactionIds: ['western_coalition'],
    crew: 4,
    armorFrontMmRha: 900,
    maxSpeedKph: 67,
    primaryWeaponId: '120mm_l44',
    secondaryWeaponId: 'm4_carbine',
  },
  {
    id: 't72b3',
    name: 'T-72B3',
    role: 'mbt',
    preferredFactionIds: ['post_soviet'],
    crew: 3,
    armorFrontMmRha: 720,
    maxSpeedKph: 60,
    primaryWeaponId: '125mm_2a46',
    secondaryWeaponId: 'pkm',
  },
  {
    id: 'm2_bradley',
    name: 'M2 Bradley',
    role: 'ifv',
    preferredFactionIds: ['western_coalition'],
    crew: 3,
    armorFrontMmRha: 300,
    maxSpeedKph: 56,
    primaryWeaponId: '30mm_2a42',
    secondaryWeaponId: 'javelin',
  },
  {
    id: 'bmp2',
    name: 'BMP-2',
    role: 'ifv',
    preferredFactionIds: ['post_soviet'],
    crew: 3,
    armorFrontMmRha: 180,
    maxSpeedKph: 65,
    primaryWeaponId: '30mm_2a42',
    secondaryWeaponId: 'pkm',
  },
  {
    id: 'm113',
    name: 'M113 APC',
    role: 'apc',
    preferredFactionIds: ['western_coalition', 'local_militia'],
    crew: 2,
    armorFrontMmRha: 38,
    maxSpeedKph: 64,
    primaryWeaponId: 'pkm',
  },
  {
    id: 'btr80',
    name: 'BTR-80',
    role: 'apc',
    preferredFactionIds: ['post_soviet'],
    crew: 3,
    armorFrontMmRha: 24,
    maxSpeedKph: 80,
    primaryWeaponId: '23mm_zu23',
  },
  {
    id: 'zsu_23_4',
    name: 'ZSU-23-4 Shilka',
    role: 'spaag',
    preferredFactionIds: ['post_soviet'],
    crew: 4,
    armorFrontMmRha: 15,
    maxSpeedKph: 50,
    primaryWeaponId: '23mm_zu23',
  },
  {
    id: 'avenger',
    name: 'AN/TWQ-1 Avenger',
    role: 'sam',
    preferredFactionIds: ['western_coalition'],
    crew: 2,
    armorFrontMmRha: 8,
    maxSpeedKph: 90,
    primaryWeaponId: 'stinger_launcher',
  },
  {
    id: '2s12_sani',
    name: '2S12 Sani Carrier',
    role: 'mortar_carrier',
    preferredFactionIds: ['post_soviet', 'local_militia'],
    crew: 5,
    armorFrontMmRha: 10,
    maxSpeedKph: 75,
    primaryWeaponId: '120mm_mortar',
  },
  {
    id: 'brdm2',
    name: 'BRDM-2',
    role: 'recon',
    preferredFactionIds: ['post_soviet', 'local_militia'],
    crew: 4,
    armorFrontMmRha: 14,
    maxSpeedKph: 100,
    primaryWeaponId: 'pkm',
  },
];
