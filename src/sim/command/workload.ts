export interface HQWorkloadInput {
  id: string;
  staffCapacity: number;
  activeOrders: number;
  pendingReports: number;
  radioChannelsInUse: number;
  radioChannelCapacity: number;
  suppression?: number;
  fatigue?: number;
}

export interface StaffWorkloadResult {
  hqId: string;
  workloadRatio: number;
  radioLoadRatio: number;
  suppression: number;
  fatigue: number;
  delayMultiplier: number;
  reliabilityPenalty: number;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

/**
 * Aggregates HQ burden into two knobs used by comms:
 * - delayMultiplier: stretches transmission and processing times.
 * - reliabilityPenalty: subtracts from base reliability.
 */
export function calculateStaffWorkload(hq: HQWorkloadInput): StaffWorkloadResult {
  const baseWorkItems = hq.activeOrders + hq.pendingReports * 0.8;
  const workloadRatio =
    hq.staffCapacity <= 0 ? 1 : clamp(baseWorkItems / hq.staffCapacity, 0, 3);

  const radioLoadRatio =
    hq.radioChannelCapacity <= 0
      ? 1
      : clamp(hq.radioChannelsInUse / hq.radioChannelCapacity, 0, 3);

  const suppression = clamp(hq.suppression ?? 0, 0, 1);
  const fatigue = clamp(hq.fatigue ?? 0, 0, 1);

  const delayMultiplier =
    1 + workloadRatio * 0.45 + radioLoadRatio * 0.35 + suppression * 0.5 + fatigue * 0.25;

  const reliabilityPenalty = clamp(
    workloadRatio * 0.14 + radioLoadRatio * 0.11 + suppression * 0.22 + fatigue * 0.08,
    0,
    0.75,
  );

  return {
    hqId: hq.id,
    workloadRatio,
    radioLoadRatio,
    suppression,
    fatigue,
    delayMultiplier,
    reliabilityPenalty,
  };
}
