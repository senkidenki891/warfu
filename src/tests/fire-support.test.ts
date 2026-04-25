import { describe, expect, it } from 'vitest';
import { artilleryImpactTime, resolveAirDefenseEngagement } from '../sim/fireSupport';

describe('artillery delay', () => {
  it('adds comms and prep delays to request time', () => {
    expect(artilleryImpactTime(100, 45, 15)).toBe(160);
  });
});

describe('air defense engagement', () => {
  it('reduces delivered damage when intercepted', () => {
    expect(resolveAirDefenseEngagement(0.8, 0.5, 100)).toEqual({
      intercepted: true,
      damageDelivered: 25
    });
  });

  it('applies full damage when interception fails', () => {
    expect(resolveAirDefenseEngagement(0.2, 0.5, 100)).toEqual({
      intercepted: false,
      damageDelivered: 100
    });
  });
});
