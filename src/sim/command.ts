export type Order = {
  issuedAt: number;
  baseDelay: number;
  reliability: number;
};

export function resolveOrder(order: Order, randomRoll: number): { executedAt: number; accepted: boolean } {
  const accepted = randomRoll <= order.reliability;
  const jitter = accepted ? order.baseDelay * (0.75 + randomRoll * 0.5) : order.baseDelay * 2;
  return {
    accepted,
    executedAt: order.issuedAt + Math.round(jitter)
  };
}
