import { StatTypeEnum } from "@/app/domain/matches/enum/Stats";
import { DefaultPolicy } from "./DefaultPolicy";

export class MidfielderPolicy {
  static getWeight(stat: StatTypeEnum): number {
    const weights: Partial<Record<StatTypeEnum, number>> = {
      // 🎯 Passing - Core of midfielder role
      [StatTypeEnum.PASS_COMPLETED]: 0.08,
      [StatTypeEnum.PASS_FAILED]: 0.08,
      [StatTypeEnum.KEY_PASS]: 0.6,
      [StatTypeEnum.PROGRESSIVE_PASS]: 0.35,
      [StatTypeEnum.LONG_PASS_COMPLETED]: 0.25,

      // ⚽ Attacking - Creating chances
      [StatTypeEnum.ASSIST]: 1.0,
      [StatTypeEnum.PRE_ASSIST]: 0.6,
      [StatTypeEnum.BIG_CHANCE_CREATED]: 0.7,

      [StatTypeEnum.GOAL_FROM_INSIDE_BOX]: 1.3,
      [StatTypeEnum.GOAL_FROM_OUTSIDE_BOX]: 1.6,

      [StatTypeEnum.SHOT_ON_TARGET]: 0.3,
      [StatTypeEnum.DRIBBLE_SUCCESS]: 0.4,

      // 🛡 Defensive - Box-to-box contribution
      [StatTypeEnum.TACKLE]: 0.45,
      [StatTypeEnum.INTERCEPTION]: 0.45,
      [StatTypeEnum.BALL_RECOVERY]: 0.35,
      [StatTypeEnum.DUEL_WON]: 0.2,

      [StatTypeEnum.POSSESSION_LOST]: 0.3,

      // 🏃 Advanced
      [StatTypeEnum.ERROR_LEADING_TO_SHOT]: 0.6,
      [StatTypeEnum.ERROR_LEADING_TO_GOAL]: 1.1,
    };

    return weights[stat] ?? DefaultPolicy.getWeight(stat);
  }
}
