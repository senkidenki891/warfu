import { describe, expect, it } from 'vitest';
import { degradeContact } from '../sim/detection';

describe('detection/contact degradation', () => {
  it('degrades confidence over time and concealment', () => {
    const next = degradeContact({ confidence: 90, lastSeenAt: 10, concealment: 20 }, 20, 2);
    expect(next.confidence).toBe(60);
  });
});
