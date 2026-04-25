export type Vehicle = {
  hp: number;
  components: Record<string, number>;
};

export function applyHit(vehicle: Vehicle, damage: number, targetComponent: string): Vehicle {
  const next = {
    hp: Math.max(0, vehicle.hp - damage),
    components: { ...vehicle.components }
  };

  if (next.components[targetComponent] !== undefined) {
    next.components[targetComponent] = Math.max(0, next.components[targetComponent] - damage);
  }

  return next;
}
