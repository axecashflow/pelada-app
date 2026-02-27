import { StatTypeEnum } from "@/app/domain/matches/enum/Stats";
import { DefaultPolicy } from "./DefaultPolicy";

export class GoalkeeperPolicy {
  static getWeight(stat: StatTypeEnum): number {
    const weights: Partial<Record<StatTypeEnum, number>> = {
      // 🧤 Goalkeeper - Increased importance
      [StatTypeEnum.SAVE]: 0.6,
      [StatTypeEnum.SAVE_INSIDE_BOX]: 0.9,
      [StatTypeEnum.SAVE_OUTSIDE_BOX]: 0.5,
      [StatTypeEnum.PENALTY_SAVE]: 1.8,
      [StatTypeEnum.GOAL_CONCEDED]: 1.2,

      // 🎯 Passing - Goalkeeper distribution
      [StatTypeEnum.PASS_COMPLETED]: 0.08,
      [StatTypeEnum.PASS_FAILED]: 0.1,
      [StatTypeEnum.LONG_PASS_COMPLETED]: 0.25,
      [StatTypeEnum.LONG_PASS_FAILED]: 0.2,

      // 🛡 Defensive
      [StatTypeEnum.CLEARANCE]: 0.3,
      [StatTypeEnum.INTERCEPTION]: 0.5,

      // 🏃 Advanced
      [StatTypeEnum.ERROR_LEADING_TO_SHOT]: 0.8,
      [StatTypeEnum.ERROR_LEADING_TO_GOAL]: 1.5,
    };

    return weights[stat] ?? DefaultPolicy.getWeight(stat);
  }
}
