import { StatScorePolicy } from './StatScorePolicy';
import { StatTypeEnum } from '../enum/Stats';
import { PlayerPosition } from '../enum/Player';

describe('StatScorePolicy', () => {
  it('should return default weight when position is undefined', () => {
    const weight = StatScorePolicy.getWeight(StatTypeEnum.GOAL_FROM_INSIDE_BOX);
    expect(weight).toBe(1.2); // default policy weight
  });

  it('should return forward weight when position is FORWARD', () => {
    const weight = StatScorePolicy.getWeight(StatTypeEnum.GOAL_FROM_INSIDE_BOX, PlayerPosition.FORWARD);
    expect(weight).toBeGreaterThan(1.2); // forward policy increases weight
  });
});
