export type WeaponClass =
  | 'rifle'
  | 'machine_gun'
  | 'atgm'
  | 'tank_gun'
  | 'autocannon'
  | 'sam_launcher'
  | 'mortar'
  | 'aa_gun';

export interface WeaponType {
  id: string;
  name: string;
  weaponClass: WeaponClass;
  rangeMeters: number;
  rateOfFirePerMinute: number;
  baseAccuracy: number;
  ammoTypeId: string;
}

export const weaponTypes: WeaponType[] = [
  { id: 'm4_carbine', name: 'M4 Carbine', weaponClass: 'rifle', rangeMeters: 500, rateOfFirePerMinute: 700, baseAccuracy: 0.62, ammoTypeId: '5_56_nato' },
  { id: 'ak_74m', name: 'AK-74M', weaponClass: 'rifle', rangeMeters: 500, rateOfFirePerMinute: 650, baseAccuracy: 0.56, ammoTypeId: '5_45x39' },
  { id: 'pkm', name: 'PKM', weaponClass: 'machine_gun', rangeMeters: 1200, rateOfFirePerMinute: 650, baseAccuracy: 0.5, ammoTypeId: '7_62x54r' },
  { id: 'javelin', name: 'FGM-148 Javelin', weaponClass: 'atgm', rangeMeters: 2500, rateOfFirePerMinute: 2, baseAccuracy: 0.8, ammoTypeId: 'javelin_missile' },
  { id: '125mm_2a46', name: '125mm 2A46', weaponClass: 'tank_gun', rangeMeters: 3000, rateOfFirePerMinute: 7, baseAccuracy: 0.68, ammoTypeId: '125mm_apfsds' },
  { id: '120mm_l44', name: '120mm L/44', weaponClass: 'tank_gun', rangeMeters: 3500, rateOfFirePerMinute: 8, baseAccuracy: 0.76, ammoTypeId: '120mm_apfsds' },
  { id: '30mm_2a42', name: '30mm 2A42', weaponClass: 'autocannon', rangeMeters: 2000, rateOfFirePerMinute: 550, baseAccuracy: 0.58, ammoTypeId: '30mm_he' },
  { id: 'stinger_launcher', name: 'FIM-92 Stinger', weaponClass: 'sam_launcher', rangeMeters: 4800, rateOfFirePerMinute: 2, baseAccuracy: 0.71, ammoTypeId: 'stinger_missile' },
  { id: '120mm_mortar', name: '120mm Mortar', weaponClass: 'mortar', rangeMeters: 7200, rateOfFirePerMinute: 12, baseAccuracy: 0.52, ammoTypeId: '120mm_he' },
  { id: '23mm_zu23', name: '23mm ZU-23-2', weaponClass: 'aa_gun', rangeMeters: 2500, rateOfFirePerMinute: 1000, baseAccuracy: 0.44, ammoTypeId: '23mm_hei' },
];
