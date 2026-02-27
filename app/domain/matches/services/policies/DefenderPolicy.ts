import { StatTypeEnum } from "@/app/domain/matches/enum/Stats";
import { DefaultPolicy } from "./DefaultPolicy";

export class DefenderPolicy {
  static getWeight(stat: StatTypeEnum): number {
    const weights: Partial<Record<StatTypeEnum, number>> = {
      // 🛡 Defensive - Increased importance
      [StatTypeEnum.TACKLE]: 0.6,
      [StatTypeEnum.INTERCEPTION]: 0.6,
      [StatTypeEnum.BLOCK]: 0.5,
      [StatTypeEnum.CLEARANCE]: 0.4,

      [StatTypeEnum.DUEL_WON]: 0.25,
      [StatTypeEnum.DUEL_LOST]: 0.25,

      [StatTypeEnum.AERIAL_DUEL_WON]: 0.35,
      [StatTypeEnum.AERIAL_DUEL_LOST]: 0.25,

      [StatTypeEnum.BALL_RECOVERY]: 0.4,
      [StatTypeEnum.POSSESSION_LOST]: 0.35,

      // 🎯 Passing - Defenders need good distribution
      [StatTypeEnum.PASS_COMPLETED]: 0.08,
      [StatTypeEnum.PASS_FAILED]: 0.1,
      [StatTypeEnum.LONG_PASS_COMPLETED]: 0.25,
      [StatTypeEnum.PROGRESSIVE_PASS]: 0.3,

      // ⚽ Attacking - Goals from defenders are valuable
      [StatTypeEnum.GOAL_FROM_INSIDE_BOX]: 1.5,
      [StatTypeEnum.GOAL_FROM_OUTSIDE_BOX]: 1.8,

      // 🏃 Advanced
      [StatTypeEnum.ERROR_LEADING_TO_SHOT]: 0.7,
      [StatTypeEnum.ERROR_LEADING_TO_GOAL]: 1.3,
    };

    return weights[stat] ?? DefaultPolicy.getWeight(stat);
  }
}
