export type AmmoClass = 'small_arms' | 'cannon' | 'missile' | 'mortar';

export interface AmmoType {
  id: string;
  name: string;
  ammoClass: AmmoClass;
  penetrationMmRha?: number;
  blastRadiusMeters?: number;
  antiAirCapability?: number;
}

export const ammoTypes: AmmoType[] = [
  { id: '5_56_nato', name: '5.56 NATO', ammoClass: 'small_arms', penetrationMmRha: 8 },
  { id: '5_45x39', name: '5.45x39', ammoClass: 'small_arms', penetrationMmRha: 7 },
  { id: '7_62x54r', name: '7.62x54R', ammoClass: 'small_arms', penetrationMmRha: 10 },
  { id: '120mm_apfsds', name: '120mm APFSDS', ammoClass: 'cannon', penetrationMmRha: 650 },
  { id: '125mm_apfsds', name: '125mm APFSDS', ammoClass: 'cannon', penetrationMmRha: 580 },
  { id: '30mm_he', name: '30mm HE', ammoClass: 'cannon', blastRadiusMeters: 4 },
  { id: '23mm_hei', name: '23mm HEI', ammoClass: 'cannon', blastRadiusMeters: 3, antiAirCapability: 0.58 },
  { id: '120mm_he', name: '120mm HE Mortar', ammoClass: 'mortar', blastRadiusMeters: 16 },
  { id: 'javelin_missile', name: 'Javelin Missile', ammoClass: 'missile', penetrationMmRha: 750 },
  { id: 'stinger_missile', name: 'Stinger Missile', ammoClass: 'missile', antiAirCapability: 0.78 },
];
