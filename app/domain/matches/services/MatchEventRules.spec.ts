import { MatchEventRules } from './MatchEventRules';
import { StatTypeEnum } from '../enum/Stats';

describe('MatchEventRules', () => {
  it('should return a rule with primary only', () => {
    const rule = MatchEventRules.getEventRule(StatTypeEnum.ASSIST);
    expect(rule.primary.type).toBe(StatTypeEnum.ASSIST);
    expect(rule.primary.impact).toBeDefined();
    expect(rule.counterpart).toBeUndefined();
  });

  it('should return a rule with counterpart for tackle', () => {
    const rule = MatchEventRules.getEventRule(StatTypeEnum.TACKLE);
    expect(rule.primary.type).toBe(StatTypeEnum.TACKLE);
    expect(rule.counterpart).toBeDefined();
    expect(rule.counterpart?.type).toBe(StatTypeEnum.POSSESSION_LOST);
  });

  it('should return a rule with reciprocal relationship for duel won', () => {
    const duelWon = MatchEventRules.getEventRule(StatTypeEnum.DUEL_WON);
    const duelLost = MatchEventRules.getEventRule(StatTypeEnum.DUEL_LOST);
    expect(duelWon.counterpart?.type).toBe(StatTypeEnum.DUEL_LOST);
    expect(duelLost.counterpart?.type).toBe(StatTypeEnum.DUEL_WON);
  });
});
