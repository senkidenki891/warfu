export interface Point2D {
  x: number;
  y: number;
  elevation?: number;
}

export interface ObstacleSegment {
  from: Point2D;
  to: Point2D;
  height: number;
  opacity?: number;
}

export interface LineOfSightInput {
  observer: Point2D;
  target: Point2D;
  obstacles: ObstacleSegment[];
  observerHeight?: number;
  targetHeight?: number;
}

export interface LineOfSightResult {
  hasLineOfSight: boolean;
  visibilityFactor: number;
  blockers: ObstacleSegment[];
}

function ccw(a: Point2D, b: Point2D, c: Point2D): boolean {
  return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
}

function segmentsIntersect(a: Point2D, b: Point2D, c: Point2D, d: Point2D): boolean {
  return ccw(a, c, d) !== ccw(b, c, d) && ccw(a, b, c) !== ccw(a, b, d);
}

export function calculateLineOfSight({
  observer,
  target,
  obstacles,
  observerHeight = 1.8,
  targetHeight = 1.8,
}: LineOfSightInput): LineOfSightResult {
  const eyeLevel = (observer.elevation ?? 0) + observerHeight;
  const targetLevel = (target.elevation ?? 0) + targetHeight;

  const blockers = obstacles.filter((obstacle) => {
    const intersects = segmentsIntersect(observer, target, obstacle.from, obstacle.to);
    if (!intersects) {
      return false;
    }

    const avgObstacleHeight = (obstacle.height ?? 0) + ((obstacle.from.elevation ?? 0) + (obstacle.to.elevation ?? 0)) / 2;
    const minRayHeight = Math.min(eyeLevel, targetLevel);

    return avgObstacleHeight > minRayHeight;
  });

  const totalOpacity = blockers.reduce((sum, blocker) => sum + (blocker.opacity ?? 1), 0);
  const visibilityFactor = Math.max(0, 1 - totalOpacity * 0.25);

  return {
    hasLineOfSight: blockers.length === 0,
    visibilityFactor,
    blockers,
  };
}
