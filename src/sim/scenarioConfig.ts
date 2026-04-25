export interface ScenarioForceConfig {
  factionId: string;
  unitTypeIds: string[];
  vehicleTypeIds: string[];
}

export interface ScenarioConfig {
  id: string;
  name: string;
  terrainTypeId: string;
  weatherTypeId: string;
  attacker: ScenarioForceConfig;
  defender: ScenarioForceConfig;
}

export const scenarioConfigs: ScenarioConfig[] = [
  {
    id: 'border_clash_01',
    name: 'Border Clash',
    terrainTypeId: 'steppe',
    weatherTypeId: 'clear_day',
    attacker: {
      factionId: 'western_coalition',
      unitTypeIds: ['western_rifle_squad', 'western_at_team'],
      vehicleTypeIds: ['m1a2_sep', 'm2_bradley', 'avenger'],
    },
    defender: {
      factionId: 'post_soviet',
      unitTypeIds: ['post_soviet_rifle_squad', 'post_soviet_mortar_team'],
      vehicleTypeIds: ['t72b3', 'bmp2', 'zsu_23_4'],
    },
  },
  {
    id: 'insurgency_raid_01',
    name: 'Insurgency Raid',
    terrainTypeId: 'mixed_forest',
    weatherTypeId: 'light_rain',
    attacker: {
      factionId: 'local_militia',
      unitTypeIds: ['militia_recon_team', 'militia_sam_team'],
      vehicleTypeIds: ['brdm2', '2s12_sani'],
    },
    defender: {
      factionId: 'western_coalition',
      unitTypeIds: ['western_rifle_squad'],
      vehicleTypeIds: ['m113', 'm2_bradley'],
    },
  },
];
