export type AirDefenseZone = {
  id: string;
  name: string;
  center: { x: number; y: number };
  radiusKm: number;
  lethality: number; // 0..1
};

export type SortieType = "CAS" | "SEAD";

export type SortieTrack = {
  from: { x: number; y: number };
  to: { x: number; y: number };
};

export type AirDefenseReaction = {
  engaged: boolean;
  zoneId?: string;
  interceptChance: number;
  result: "none" | "suppressed" | "damaged" | "aborted";
};

export function evaluateAirDefenseReaction(params: {
  sortieType: SortieType;
  track: SortieTrack;
  zones: AirDefenseZone[];
  seadEffectiveness?: number;
  rng?: () => number;
}): AirDefenseReaction {
  const rng = params.rng ?? Math.random;
  const zone = firstIntersectingZone(params.track, params.zones);
  if (!zone) {
    return { engaged: false, interceptChance: 0, result: "none" };
  }

  const seadModifier = params.sortieType === "SEAD" ? params.seadEffectiveness ?? 0.35 : 0;
  const interceptChance = clamp(zone.lethality * (1 - seadModifier), 0, 0.95);
  const roll = rng();

  if (params.sortieType === "SEAD" && roll > interceptChance) {
    return {
      engaged: true,
      zoneId: zone.id,
      interceptChance,
      result: "suppressed",
    };
  }

  if (roll < interceptChance * 0.5) {
    return {
      engaged: true,
      zoneId: zone.id,
      interceptChance,
      result: "aborted",
    };
  }

  if (roll < interceptChance) {
    return {
      engaged: true,
      zoneId: zone.id,
      interceptChance,
      result: "damaged",
    };
  }

  return {
    engaged: true,
    zoneId: zone.id,
    interceptChance,
    result: "none",
  };
}

function firstIntersectingZone(track: SortieTrack, zones: AirDefenseZone[]): AirDefenseZone | undefined {
  return zones.find((zone) => {
    const d = distancePointToSegment(zone.center, track.from, track.to);
    return d <= zone.radiusKm;
  });
}

function distancePointToSegment(
  p: { x: number; y: number },
  v: { x: number; y: number },
  w: { x: number; y: number },
): number {
  const l2 = Math.pow(w.x - v.x, 2) + Math.pow(w.y - v.y, 2);
  if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);

  const t = clamp(((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2, 0, 1);
  const projection = { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) };

  return Math.hypot(p.x - projection.x, p.y - projection.y);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
