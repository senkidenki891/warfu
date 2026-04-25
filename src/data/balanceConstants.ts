export const balanceConstants = {
  baseHitChance: 0.5,
  suppressionPerCasualty: 0.08,
  moraleRecoveryPerTick: 0.03,
  fuelConsumptionPerKm: {
    mbt: 4.8,
    ifv: 2.6,
    apc: 1.9,
    spaag: 2.4,
    sam: 1.6,
    mortar_carrier: 2.1,
    recon: 1.4,
  },
  resupply: {
    ammoPerCycle: 0.15,
    fuelPerCycle: 0.2,
    repairPerCycle: 0.1,
  },
} as const;

export type BalanceConstants = typeof balanceConstants;
