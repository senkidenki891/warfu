import {
  AirDefenseReaction,
  AirDefenseZone,
  SortieTrack,
  SortieType,
  evaluateAirDefenseReaction,
} from "../airDefense/airDefense";

export type TargetState = "unknown" | "confirmed" | "destroyed" | "moved";
export type AirMissionState = "queued" | "enroute" | "onStation" | "aborted" | "resolved";

export type AirMission = {
  id: string;
  type: SortieType;
  launchAtSec: number;
  etaSec: number;
  targetId: string;
  targetStateAtRequest: TargetState;
  state: AirMissionState;
  origin: { x: number; y: number };
  target: { x: number; y: number };
  reaction?: AirDefenseReaction;
  notes: string[];
};

export function createAirMission(input: Omit<AirMission, "state" | "notes" | "reaction">): AirMission {
  return {
    ...input,
    state: "queued",
    notes: [`${input.launchAtSec}s: ${input.type} mission queued for ${input.targetId}`],
  };
}

export function tickAirMission(params: {
  mission: AirMission;
  nowSec: number;
  currentTargetState: TargetState;
  zones: AirDefenseZone[];
  rng?: () => number;
}): AirMission {
  const { mission, nowSec, currentTargetState, zones, rng } = params;

  if (mission.state === "resolved" || mission.state === "aborted") {
    return mission;
  }

  if (nowSec < mission.launchAtSec) {
    return mission;
  }

  if (mission.state === "queued") {
    return {
      ...mission,
      state: "enroute",
      notes: [...mission.notes, `${nowSec}s: Package airborne`],
    };
  }

  if (mission.state === "enroute" && nowSec >= mission.etaSec) {
    // Validate target state on arrival: dead/moved target invalidates strike.
    if (currentTargetState === "destroyed" || currentTargetState === "moved") {
      return {
        ...mission,
        state: "aborted",
        notes: [
          ...mission.notes,
          `${nowSec}s: Strike aborted, target state changed to ${currentTargetState}`,
        ],
      };
    }

    const track: SortieTrack = { from: mission.origin, to: mission.target };
    const reaction = evaluateAirDefenseReaction({
      sortieType: mission.type,
      track,
      zones,
      rng,
    });

    if (reaction.result === "aborted") {
      return {
        ...mission,
        reaction,
        state: "aborted",
        notes: [...mission.notes, `${nowSec}s: Aborted by enemy AD in zone ${reaction.zoneId}`],
      };
    }

    const onStation: AirMission = {
      ...mission,
      reaction,
      state: "onStation",
      notes: [...mission.notes, `${nowSec}s: On station; AD reaction=${reaction.result}`],
    };

    return resolveOnStation(onStation, nowSec);
  }

  return mission;
}

function resolveOnStation(mission: AirMission, nowSec: number): AirMission {
  const resultText =
    mission.type === "SEAD"
      ? "SEAD attack executed against radar/SAM emitters"
      : "CAS run executed against ground target";

  return {
    ...mission,
    state: "resolved",
    notes: [...mission.notes, `${nowSec}s: ${resultText}`],
  };
}
