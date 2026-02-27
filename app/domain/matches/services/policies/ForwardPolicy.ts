import { StatTypeEnum } from "@/app/domain/matches/enum/Stats";
import { DefaultPolicy } from "./DefaultPolicy";

export class ForwardPolicy {
  static getWeight(stat: StatTypeEnum): number {
    const weights: Partial<Record<StatTypeEnum, number>> = {
      // ⚽ Attacking - Primary role
      [StatTypeEnum.GOAL_FROM_INSIDE_BOX]: 1.5,
      [StatTypeEnum.GOAL_FROM_OUTSIDE_BOX]: 1.8,

      [StatTypeEnum.ASSIST]: 1.0,
      [StatTypeEnum.PRE_ASSIST]: 0.5,

      [StatTypeEnum.SHOT_ON_TARGET]: 0.35,
      [StatTypeEnum.SHOT_OFF_TARGET]: 0.15,
      [StatTypeEnum.SHOT_HIT_POST]: 0.3,

      [StatTypeEnum.BIG_CHANCE_CREATED]: 0.6,
      [StatTypeEnum.BIG_CHANCE_MISSED]: 0.6,

      [StatTypeEnum.DRIBBLE_SUCCESS]: 0.5,
      [StatTypeEnum.DRIBBLE_FAILED]: 0.2,

      // 🎯 Passing - Link-up play
      [StatTypeEnum.KEY_PASS]: 0.5,
      [StatTypeEnum.PASS_COMPLETED]: 0.05,

      // 🛡 Defensive - Pressing contribution
      [StatTypeEnum.BALL_RECOVERY]: 0.25,
      [StatTypeEnum.TACKLE]: 0.25,

      [StatTypeEnum.POSSESSION_LOST]: 0.2,

      // 🏃 Advanced
      [StatTypeEnum.PENALTY_SCORED]: 1.4,
      [StatTypeEnum.PENALTY_MISSED]: 1.2,
      [StatTypeEnum.PENALTY_WON]: 0.9,
    };

    return weights[stat] ?? DefaultPolicy.getWeight(stat);
  }
}
