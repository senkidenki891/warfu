import { describe, expect, it } from 'vitest';
import { evaluateMorale } from '../sim/morale';

describe('morale/suppression', () => {
  it('maps effective morale to suppression state', () => {
    expect(evaluateMorale(60, 5)).toBe('steady');
    expect(evaluateMorale(60, 20)).toBe('shaken');
    expect(evaluateMorale(60, 40)).toBe('suppressed');
    expect(evaluateMorale(60, 55)).toBe('routed');
  });
});
