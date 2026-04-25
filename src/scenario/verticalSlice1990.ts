import { AirMission } from "../sim/airSupport/airMissions";
import { FireMission } from "../sim/artillery/artilleryMissions";
import { SupplyState } from "../sim/supply/supplySystem";

export type Side = "player" | "ai";

export type ScenarioForce = {
  id: string;
  side: Side;
  name: string;
  role: "armor" | "mechanized" | "artillery" | "airDefense" | "air";
  strength: number;
};

export type VictoryObjective = {
  id: string;
  name: string;
  vpPerMinute: number;
  heldBy: Side | "contested";
};

export type ScenarioVictoryRules = {
  durationMin: number;
  vpToWin: number;
  holdObjectiveId: string;
  holdUntilMin: number;
};

export type VerticalSliceScenario = {
  id: string;
  title: string;
  startTimestamp: string;
  durationMin: number;
  playerForces: ScenarioForce[];
  aiForces: ScenarioForce[];
  initialSupply: Record<string, SupplyState>;
  plannedAirMissions: AirMission[];
  plannedFireMissions: FireMission[];
  objectives: VictoryObjective[];
  victory: ScenarioVictoryRules;
};

export const verticalSlice1990: VerticalSliceScenario = {
  id: "vs-1990-fulda-01",
  title: "Vertical Slice 1990: Fulda Gap Counterattack",
  startTimestamp: "1990-08-04T05:30:00Z",
  durationMin: 18,
  playerForces: [
    { id: "P-1", side: "player", name: "1-11 ACR", role: "armor", strength: 92 },
    {
      id: "P-2",
      side: "player",
      name: "2-68 Armor Coy",
      role: "mechanized",
      strength: 86,
    },
    { id: "P-3", side: "player", name: "A/41 FA", role: "artillery", strength: 100 },
    {
      id: "P-4",
      side: "player",
      name: "Wild Weasel Pair",
      role: "air",
      strength: 100,
    },
  ],
  aiForces: [
    { id: "E-1", side: "ai", name: "27th Guards Tank", role: "armor", strength: 95 },
    {
      id: "E-2",
      side: "ai",
      name: "Motor Rifle Battalion",
      role: "mechanized",
      strength: 88,
    },
    { id: "E-3", side: "ai", name: "SA-11 Battery", role: "airDefense", strength: 72 },
    { id: "E-4", side: "ai", name: "2S3 Battalion", role: "artillery", strength: 80 },
  ],
  initialSupply: {
    "P-1": "supplied",
    "P-2": "supplied",
    "P-3": "supplied",
    "E-1": "supplied",
    "E-2": "low",
    "E-3": "supplied",
  },
  plannedAirMissions: [],
  plannedFireMissions: [],
  objectives: [
    { id: "OBJ-ALPHA", name: "Hill 402", vpPerMinute: 3, heldBy: "contested" },
    { id: "OBJ-BRAVO", name: "Autobahn Junction", vpPerMinute: 4, heldBy: "ai" },
    { id: "OBJ-CHARLIE", name: "Rail Yard", vpPerMinute: 2, heldBy: "player" },
  ],
  victory: {
    durationMin: 18,
    vpToWin: 45,
    holdObjectiveId: "OBJ-ALPHA",
    holdUntilMin: 16,
  },
};

export function evaluateVictory(params: {
  vpPlayer: number;
  vpAi: number;
  heldObjectiveIds: string[];
  elapsedMin: number;
}): "player" | "ai" | "none" {
  const { vpPlayer, vpAi, heldObjectiveIds, elapsedMin } = params;

  const playerHasRequiredHold =
    heldObjectiveIds.includes(verticalSlice1990.victory.holdObjectiveId) &&
    elapsedMin >= verticalSlice1990.victory.holdUntilMin;

  if (vpPlayer >= verticalSlice1990.victory.vpToWin && playerHasRequiredHold) {
    return "player";
  }

  if (vpAi > vpPlayer && elapsedMin >= verticalSlice1990.durationMin) {
    return "ai";
  }

  return "none";
}
