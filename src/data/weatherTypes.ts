export type WeatherKind = 'clear' | 'rain' | 'storm' | 'fog' | 'snow';

export interface WeatherType {
  id: string;
  name: string;
  kind: WeatherKind;
  visibilityModifier: number;
  airSortieModifier: number;
  mobilityModifier: number;
}

export const weatherTypes: WeatherType[] = [
  { id: 'clear_day', name: 'Clear Day', kind: 'clear', visibilityModifier: 1, airSortieModifier: 1, mobilityModifier: 1 },
  { id: 'light_rain', name: 'Light Rain', kind: 'rain', visibilityModifier: 0.85, airSortieModifier: 0.9, mobilityModifier: 0.95 },
  { id: 'heavy_fog', name: 'Heavy Fog', kind: 'fog', visibilityModifier: 0.55, airSortieModifier: 0.7, mobilityModifier: 0.9 },
  { id: 'snowfall', name: 'Snowfall', kind: 'snow', visibilityModifier: 0.8, airSortieModifier: 0.8, mobilityModifier: 0.75 },
];
