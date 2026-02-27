import { MatchStat } from './MatchStat';
import { PlayerId } from './PlayerId';
import { StatWeight } from './StatWeight';
import { StatTypeEnum, ImpactEnum } from '../enum/Stats';

describe('MatchStat Value Object', () => {
  const playerId = PlayerId.create('player-1');

  it('should create a valid match stat', () => {
    const stat = MatchStat.create({
      playerId,
      type: StatTypeEnum.GOAL_FROM_INSIDE_BOX,
      value: 1,
      weight: StatWeight.create(2.5),
      impact: ImpactEnum.POSITIVE,
    });

    expect(stat.playerId).toBe(playerId);
    expect(stat.type).toBe(StatTypeEnum.GOAL_FROM_INSIDE_BOX);
  });

  it('should throw error if value is zero', () => {
    expect(() =>
      MatchStat.create({
        playerId,
        type: StatTypeEnum.ASSIST,
        value: 0,
        weight: StatWeight.create(1.5),
        impact: ImpactEnum.POSITIVE,
      })
    ).toThrow('StatValueMustBePositive');
  });

  it('should throw error if value is negative', () => {
    expect(() =>
      MatchStat.create({
        playerId,
        type: StatTypeEnum.ASSIST,
        value: -1,
        weight: StatWeight.create(1.5),
        impact: ImpactEnum.POSITIVE,
      })
    ).toThrow('StatValueMustBePositive');
  });

  it('should throw error if weight is zero', () => {
    expect(() =>
      MatchStat.create({
        playerId,
        type: StatTypeEnum.ASSIST,
        value: 1,
        weight: StatWeight.create(0),
        impact: ImpactEnum.POSITIVE,
      })
    ).toThrow('WeightMustBePositive');
  });

  it('should throw error if weight is negative', () => {
    expect(() =>
      MatchStat.create({
        playerId,
        type: StatTypeEnum.ASSIST,
        value: 1,
        weight: StatWeight.create(-1),
        impact: ImpactEnum.POSITIVE,
      })
    ).toThrow('WeightMustBePositive');
  });

  it('should calculate positive impact correctly', () => {
    const stat = MatchStat.create({
      playerId,
      type: StatTypeEnum.GOAL_FROM_INSIDE_BOX,
      value: 2,
      weight: StatWeight.create(3),
      impact: ImpactEnum.POSITIVE,
    });

    expect(stat.calculateImpact()).toBe(6); // 2 * 3 * 1
  });

  it('should calculate negative impact correctly', () => {
    const stat = MatchStat.create({
      playerId,
      type: StatTypeEnum.FOUL_COMMITTED,
      value: 3,
      weight: StatWeight.create(0.5),
      impact: ImpactEnum.NEGATIVE,
    });

    expect(stat.calculateImpact()).toBe(-1.5); // 3 * 0.5 * -1
  });

  it('should calculate impact with decimal values', () => {
    const stat = MatchStat.create({
      playerId,
      type: StatTypeEnum.ASSIST,
      value: 1.5,
      weight: StatWeight.create(2.5),
      impact: ImpactEnum.POSITIVE,
    });

    expect(stat.calculateImpact()).toBe(3.75); // 1.5 * 2.5 * 1
  });

  it('should consider two stats with same values as equal', () => {
    const stat1 = MatchStat.create({
      playerId,
      type: StatTypeEnum.ASSIST,
      value: 1,
      weight: StatWeight.create(2),
      impact: ImpactEnum.POSITIVE,
    });

    const stat2 = MatchStat.create({
      playerId,
      type: StatTypeEnum.ASSIST,
      value: 1,
      weight: StatWeight.create(2),
      impact: ImpactEnum.POSITIVE,
    });

    expect(stat1.equals(stat2)).toBe(true);
  });

  it('should consider two stats with different values as not equal', () => {
    const stat1 = MatchStat.create({
      playerId,
      type: StatTypeEnum.ASSIST,
      value: 1,
      weight: StatWeight.create(2),
      impact: ImpactEnum.POSITIVE,
    });

    const stat2 = MatchStat.create({
      playerId,
      type: StatTypeEnum.GOAL_FROM_INSIDE_BOX,
      value: 1,
      weight: StatWeight.create(2),
      impact: ImpactEnum.POSITIVE,
    });

    expect(stat1.equals(stat2)).toBe(false);
  });
});
