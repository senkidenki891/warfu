import { describe, expect, it } from 'vitest';
import { resolveOrder } from '../sim/command';

describe('command delay/order reliability', () => {
  it('accepts reliable order with bounded delay', () => {
    const result = resolveOrder({ issuedAt: 100, baseDelay: 20, reliability: 0.9 }, 0.4);
    expect(result.accepted).toBe(true);
    expect(result.executedAt).toBe(119);
  });

  it('doubles delay when order is rejected', () => {
    const result = resolveOrder({ issuedAt: 100, baseDelay: 20, reliability: 0.2 }, 0.8);
    expect(result.accepted).toBe(false);
    expect(result.executedAt).toBe(140);
  });
});
