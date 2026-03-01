import { StatTypeEnum } from "@/app/domain/matches/enum/Stats";

export class DefaultPolicy {
  static getWeight(stat: StatTypeEnum): number {
    const weights: Partial<Record<StatTypeEnum, number>> = {
      // ⚽ Attacking
      [StatTypeEnum.ASSIST]: 0.8,
      [StatTypeEnum.PRE_ASSIST]: 0.4,
      [StatTypeEnum.BIG_CHANCE_CREATED]: 0.5,
      [StatTypeEnum.BIG_CHANCE_MISSED]: 0.4,

      [StatTypeEnum.SHOT_ON_TARGET]: 0.2,
      [StatTypeEnum.SHOT_OFF_TARGET]: 0.1,
      [StatTypeEnum.SHOT_BLOCKED]: 0.05,
      [StatTypeEnum.SHOT_HIT_POST]: 0.2,

      [StatTypeEnum.GOAL_FROM_INSIDE_BOX]: 1.2,
      [StatTypeEnum.GOAL_FROM_OUTSIDE_BOX]: 1.5,

      [StatTypeEnum.DRIBBLE_SUCCESS]: 0.3,
      [StatTypeEnum.DRIBBLE_FAILED]: 0.15,

      // 🎯 Passing
      [StatTypeEnum.PASS_COMPLETED]: 0.05,
      [StatTypeEnum.PASS_FAILED]: 0.05,

      [StatTypeEnum.LONG_PASS_COMPLETED]: 0.15,
      [StatTypeEnum.LONG_PASS_FAILED]: 0.15,

      [StatTypeEnum.CROSS_COMPLETED]: 0.2,
      [StatTypeEnum.CROSS_FAILED]: 0.1,

      [StatTypeEnum.KEY_PASS]: 0.4,
      [StatTypeEnum.PROGRESSIVE_PASS]: 0.2,

      // 🛡 Defensive
      [StatTypeEnum.TACKLE]: 0.4,
      [StatTypeEnum.INTERCEPTION]: 0.4,
      [StatTypeEnum.BLOCK]: 0.3,
      [StatTypeEnum.CLEARANCE]: 0.2,

      [StatTypeEnum.DUEL_WON]: 0.15,
      [StatTypeEnum.DUEL_LOST]: 0.15,

      [StatTypeEnum.AERIAL_DUEL_WON]: 0.2,
      [StatTypeEnum.AERIAL_DUEL_LOST]: 0.15,

      [StatTypeEnum.POSSESSION_LOST]: 0.25,
      [StatTypeEnum.BALL_RECOVERY]: 0.3,

      // 🧤 Goalkeeper
      [StatTypeEnum.SAVE]: 1,
      [StatTypeEnum.SAVE_INSIDE_BOX]: 0.6,
      [StatTypeEnum.SAVE_OUTSIDE_BOX]: 0.3,
      [StatTypeEnum.PENALTY_SAVE]: 1.2,
      [StatTypeEnum.GOAL_CONCEDED]: 0.8,

      // ⚖ Discipline
      [StatTypeEnum.FOUL_COMMITTED]: 0.15,
      [StatTypeEnum.FOUL_SUFFERED]: 0.1,

      [StatTypeEnum.YELLOW_CARD]: 0.5,
      [StatTypeEnum.SECOND_YELLOW_CARD]: 1.0,
      [StatTypeEnum.RED_CARD]: 1.5,

      // 🏃 Advanced
      [StatTypeEnum.ERROR_LEADING_TO_SHOT]: 0.5,
      [StatTypeEnum.ERROR_LEADING_TO_GOAL]: 1.0,

      [StatTypeEnum.PENALTY_WON]: 0.7,
      [StatTypeEnum.PENALTY_MISSED]: 1.0,
      [StatTypeEnum.PENALTY_SCORED]: 1.2,
      [StatTypeEnum.FREE_KICK_SCORED]: 1.4,
      [StatTypeEnum.PENALTY_CONCEDED]: 0.8,
      [StatTypeEnum.OWN_GOAL]: 1.0,
      // Skill / flair: nutmeg and lob
      [StatTypeEnum.NUTMEG]: 0.6,
      [StatTypeEnum.NUTMEG_RECEIVED]: 0.25,
      [StatTypeEnum.LOB]: 0.8,
      [StatTypeEnum.LOB_RECEIVED]: 0.4,
    };

    return weights[stat] ?? 0;
  }
}
