export type SupplyState = "supplied" | "low" | "out" | "isolated";

export type NodeId = string;

export type SupplyNode = {
  id: NodeId;
  neighbors: NodeId[];
  enemyZoc: boolean;
  source?: boolean;
};

export type UnitSupplyStatus = {
  unitId: string;
  nodeId: NodeId;
  stock: number; // 0..100
  state: SupplyState;
};

export type SupplyNetwork = {
  nodes: Record<NodeId, SupplyNode>;
};

export function isNodeBlockedByEnemyZoc(node: SupplyNode): boolean {
  return node.enemyZoc;
}

export function canTraceSupply(network: SupplyNetwork, fromNode: NodeId): boolean {
  const start = network.nodes[fromNode];
  if (!start || start.enemyZoc) return false;

  const visited = new Set<NodeId>();
  const queue: NodeId[] = [fromNode];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const current = network.nodes[currentId];
    if (!current || isNodeBlockedByEnemyZoc(current)) continue;
    if (current.source) return true;

    for (const neighbor of current.neighbors) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }

  return false;
}

export function evaluateSupplyState(stock: number, isolated: boolean): SupplyState {
  if (isolated) return "isolated";
  if (stock <= 0) return "out";
  if (stock <= 30) return "low";
  return "supplied";
}

export function tickSupplyForUnit(
  network: SupplyNetwork,
  unit: UnitSupplyStatus,
  consumption: number,
  resupplyPerTick = 15,
): UnitSupplyStatus {
  const hasLine = canTraceSupply(network, unit.nodeId);
  let nextStock = unit.stock;

  if (hasLine) {
    nextStock = Math.min(100, unit.stock - consumption + resupplyPerTick);
  } else {
    nextStock = Math.max(0, unit.stock - consumption);
  }

  return {
    ...unit,
    stock: nextStock,
    state: evaluateSupplyState(nextStock, !hasLine),
  };
}
