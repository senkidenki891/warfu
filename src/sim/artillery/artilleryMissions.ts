export type MissionPhase =
  | "request"
  | "transmit"
  | "aim"
  | "flight"
  | "impact"
  | "correction"
  | "complete";

export type GridPoint = {
  x: number;
  y: number;
};

export type FireMissionRequest = {
  id: string;
  callerUnitId: string;
  batteryId: string;
  target: GridPoint;
  shellCount: number;
  shellType: "HE" | "SMOKE" | "ILLUM";
  requestedAtSec: number;
  priority: 1 | 2 | 3;
};

export type FireCorrection = {
  rangeDelta: number;
  lateralDelta: number;
  addRounds?: number;
};

export type FireMission = {
  request: FireMissionRequest;
  phase: MissionPhase;
  phaseStartedAtSec: number;
  etaImpactSec?: number;
  roundsFired: number;
  correctionsApplied: number;
  log: string[];
};

export type ArtilleryTimings = {
  transmitSec: number;
  aimSec: number;
  flightSec: number;
  correctionLoopSec: number;
};

const DEFAULT_TIMINGS: ArtilleryTimings = {
  transmitSec: 30,
  aimSec: 45,
  flightSec: 35,
  correctionLoopSec: 25,
};

export function createFireMission(
  request: FireMissionRequest,
  nowSec: number,
): FireMission {
  return {
    request,
    phase: "request",
    phaseStartedAtSec: nowSec,
    roundsFired: 0,
    correctionsApplied: 0,
    log: [`${nowSec}s: Mission ${request.id} requested by ${request.callerUnitId}`],
  };
}

export function advanceFireMission(
  mission: FireMission,
  nowSec: number,
  timings: ArtilleryTimings = DEFAULT_TIMINGS,
): FireMission {
  const elapsed = nowSec - mission.phaseStartedAtSec;

  switch (mission.phase) {
    case "request": {
      if (elapsed < 0) return mission;
      return transition(mission, "transmit", nowSec, `${nowSec}s: Request accepted by FDC`);
    }
    case "transmit": {
      if (elapsed < timings.transmitSec) return mission;
      return transition(mission, "aim", nowSec, `${nowSec}s: Fire order transmitted to battery`);
    }
    case "aim": {
      if (elapsed < timings.aimSec) return mission;
      const next = transition(mission, "flight", nowSec, `${nowSec}s: Guns laid and fired`);
      next.roundsFired += mission.request.shellCount;
      next.etaImpactSec = nowSec + timings.flightSec;
      return next;
    }
    case "flight": {
      if (elapsed < timings.flightSec) return mission;
      return transition(mission, "impact", nowSec, `${nowSec}s: Rounds impacting target grid`);
    }
    case "impact": {
      return transition(mission, "complete", nowSec, `${nowSec}s: Fire mission complete`);
    }
    case "correction": {
      if (elapsed < timings.correctionLoopSec) return mission;
      const next = transition(mission, "flight", nowSec, `${nowSec}s: Corrected salvo in flight`);
      next.roundsFired += mission.request.shellCount;
      next.etaImpactSec = nowSec + timings.flightSec;
      return next;
    }
    case "complete":
      return mission;
    default:
      return mission;
  }
}

export function applyCorrection(
  mission: FireMission,
  correction: FireCorrection,
  nowSec: number,
): FireMission {
  if (mission.phase !== "impact") {
    return mission;
  }

  const corrected = transition(
    mission,
    "correction",
    nowSec,
    `${nowSec}s: Correction applied ΔR=${correction.rangeDelta}, ΔL=${correction.lateralDelta}`,
  );
  corrected.correctionsApplied += 1;
  if (correction.addRounds && correction.addRounds > 0) {
    corrected.request = {
      ...corrected.request,
      shellCount: corrected.request.shellCount + correction.addRounds,
    };
  }

  return corrected;
}

function transition(
  mission: FireMission,
  phase: MissionPhase,
  nowSec: number,
  message: string,
): FireMission {
  return {
    ...mission,
    phase,
    phaseStartedAtSec: nowSec,
    log: [...mission.log, message],
  };
}
