import { ImpactEnum, StatTypeEnum } from "../enum/Stats";

interface StatEventRule {
  primary: {
    type: StatTypeEnum;
    impact: ImpactEnum;
  };
  counterpart?: {
    type: StatTypeEnum;
    impact: ImpactEnum;
  };
}

export class MatchEventRules {
  private static readonly rules: Record<StatTypeEnum, StatEventRule> = {
    // ⚽ Attacking
    [StatTypeEnum.ASSIST]: {
      primary: { type: StatTypeEnum.ASSIST, impact: ImpactEnum.POSITIVE },
    },
    [StatTypeEnum.PRE_ASSIST]: {
      primary: { type: StatTypeEnum.PRE_ASSIST, impact: ImpactEnum.POSITIVE },
    },
    [StatTypeEnum.BIG_CHANCE_CREATED]: {
      primary: { type: StatTypeEnum.BIG_CHANCE_CREATED, impact: ImpactEnum.POSITIVE },
    },
    [StatTypeEnum.BIG_CHANCE_MISSED]: {
      primary: { type: StatTypeEnum.BIG_CHANCE_MISSED, impact: ImpactEnum.NEGATIVE },
    },

    [StatTypeEnum.SHOT_ON_TARGET]: {
      primary: { type: StatTypeEnum.SHOT_ON_TARGET, impact: ImpactEnum.POSITIVE },
    },
    [StatTypeEnum.SHOT_OFF_TARGET]: {
      primary: { type: StatTypeEnum.SHOT_OFF_TARGET, impact: ImpactEnum.NEGATIVE },
    },
    [StatTypeEnum.SHOT_BLOCKED]: {
      primary: { type: StatTypeEnum.SHOT_BLOCKED, impact: ImpactEnum.NEGATIVE },
      counterpart: { type: StatTypeEnum.BLOCK, impact: ImpactEnum.POSITIVE },
    },
    [StatTypeEnum.SHOT_HIT_POST]: {
      primary: { type: StatTypeEnum.SHOT_HIT_POST, impact: ImpactEnum.POSITIVE },
    },

    [StatTypeEnum.GOAL_FROM_INSIDE_BOX]: {
      primary: { type: StatTypeEnum.GOAL_FROM_INSIDE_BOX, impact: ImpactEnum.POSITIVE },
      counterpart: { type: StatTypeEnum.GOAL_CONCEDED, impact: ImpactEnum.NEGATIVE },
    },
    [StatTypeEnum.GOAL_FROM_OUTSIDE_BOX]: {
      primary: { type: StatTypeEnum.GOAL_FROM_OUTSIDE_BOX, impact: ImpactEnum.POSITIVE },
      counterpart: { type: StatTypeEnum.GOAL_CONCEDED, impact: ImpactEnum.NEGATIVE },
    },

    [StatTypeEnum.DRIBBLE_SUCCESS]: {
      primary: { type: StatTypeEnum.DRIBBLE_SUCCESS, impact: ImpactEnum.POSITIVE },
    },
    [StatTypeEnum.DRIBBLE_FAILED]: {
      primary: { type: StatTypeEnum.DRIBBLE_FAILED, impact: ImpactEnum.NEGATIVE },
      counterpart: { type: StatTypeEnum.BALL_RECOVERY, impact: ImpactEnum.POSITIVE },
    },

    // 🎯 Passing
    [StatTypeEnum.PASS_COMPLETED]: {
      primary: { type: StatTypeEnum.PASS_COMPLETED, impact: ImpactEnum.POSITIVE },
    },
    [StatTypeEnum.PASS_FAILED]: {
      primary: { type: StatTypeEnum.PASS_FAILED, impact: ImpactEnum.NEGATIVE },
      counterpart: { type: StatTypeEnum.INTERCEPTION, impact: ImpactEnum.POSITIVE },
    },

    [StatTypeEnum.LONG_PASS_COMPLETED]: {
      primary: { type: StatTypeEnum.LONG_PASS_COMPLETED, impact: ImpactEnum.POSITIVE },
    },
    [StatTypeEnum.LONG_PASS_FAILED]: {
      primary: { type: StatTypeEnum.LONG_PASS_FAILED, impact: ImpactEnum.NEGATIVE },
      counterpart: { type: StatTypeEnum.INTERCEPTION, impact: ImpactEnum.POSITIVE },
    },

    [StatTypeEnum.CROSS_COMPLETED]: {
      primary: { type: StatTypeEnum.CROSS_COMPLETED, impact: ImpactEnum.POSITIVE },
    },
    [StatTypeEnum.CROSS_FAILED]: {
      primary: { type: StatTypeEnum.CROSS_FAILED, impact: ImpactEnum.NEGATIVE },
      counterpart: { type: StatTypeEnum.CLEARANCE, impact: ImpactEnum.POSITIVE },
    },

    [StatTypeEnum.KEY_PASS]: {
      primary: { type: StatTypeEnum.KEY_PASS, impact: ImpactEnum.POSITIVE },
    },
    [StatTypeEnum.PROGRESSIVE_PASS]: {
      primary: { type: StatTypeEnum.PROGRESSIVE_PASS, impact: ImpactEnum.POSITIVE },
    },

    // 🛡 Defensive
    [StatTypeEnum.TACKLE]: {
      primary: { type: StatTypeEnum.TACKLE, impact: ImpactEnum.POSITIVE },
      counterpart: { type: StatTypeEnum.POSSESSION_LOST, impact: ImpactEnum.NEGATIVE },
    },
    [StatTypeEnum.INTERCEPTION]: {
      primary: { type: StatTypeEnum.INTERCEPTION, impact: ImpactEnum.POSITIVE },
      counterpart: { type: StatTypeEnum.POSSESSION_LOST, impact: ImpactEnum.NEGATIVE },
    },
    [StatTypeEnum.BLOCK]: {
      primary: { type: StatTypeEnum.BLOCK, impact: ImpactEnum.POSITIVE },
    },
    [StatTypeEnum.CLEARANCE]: {
      primary: { type: StatTypeEnum.CLEARANCE, impact: ImpactEnum.POSITIVE },
    },

    [StatTypeEnum.DUEL_WON]: {
      primary: { type: StatTypeEnum.DUEL_WON, impact: ImpactEnum.POSITIVE },
      counterpart: { type: StatTypeEnum.DUEL_LOST, impact: ImpactEnum.NEGATIVE },
    },
    [StatTypeEnum.DUEL_LOST]: {
      primary: { type: StatTypeEnum.DUEL_LOST, impact: ImpactEnum.NEGATIVE },
      counterpart: { type: StatTypeEnum.DUEL_WON, impact: ImpactEnum.POSITIVE },
    },

    [StatTypeEnum.AERIAL_DUEL_WON]: {
      primary: { type: StatTypeEnum.AERIAL_DUEL_WON, impact: ImpactEnum.POSITIVE },
      counterpart: { type: StatTypeEnum.AERIAL_DUEL_LOST, impact: ImpactEnum.NEGATIVE },
    },
    [StatTypeEnum.AERIAL_DUEL_LOST]: {
      primary: { type: StatTypeEnum.AERIAL_DUEL_LOST, impact: ImpactEnum.NEGATIVE },
      counterpart: { type: StatTypeEnum.AERIAL_DUEL_WON, impact: ImpactEnum.POSITIVE },
    },

    [StatTypeEnum.POSSESSION_LOST]: {
      primary: { type: StatTypeEnum.POSSESSION_LOST, impact: ImpactEnum.NEGATIVE },
      counterpart: { type: StatTypeEnum.BALL_RECOVERY, impact: ImpactEnum.POSITIVE },
    },
    [StatTypeEnum.BALL_RECOVERY]: {
      primary: { type: StatTypeEnum.BALL_RECOVERY, impact: ImpactEnum.POSITIVE },
      counterpart: { type: StatTypeEnum.POSSESSION_LOST, impact: ImpactEnum.NEGATIVE },
    },

    // 🧤 Goalkeeper
    [StatTypeEnum.SAVE]: {
      primary: { type: StatTypeEnum.SAVE, impact: ImpactEnum.POSITIVE },
      counterpart: {type: StatTypeEnum.SHOT_ON_TARGET, impact: ImpactEnum.POSITIVE },
    },
    [StatTypeEnum.SAVE_INSIDE_BOX]: {
      primary: { type: StatTypeEnum.SAVE_INSIDE_BOX, impact: ImpactEnum.POSITIVE },
      counterpart: {type: StatTypeEnum.SHOT_ON_TARGET, impact: ImpactEnum.POSITIVE },
    },
    [StatTypeEnum.SAVE_OUTSIDE_BOX]: {
      primary: { type: StatTypeEnum.SAVE_OUTSIDE_BOX, impact: ImpactEnum.POSITIVE },
      counterpart: {type: StatTypeEnum.SHOT_ON_TARGET, impact: ImpactEnum.POSITIVE },
    },
    [StatTypeEnum.PENALTY_SAVE]: {
      primary: { type: StatTypeEnum.PENALTY_SAVE, impact: ImpactEnum.POSITIVE },
      counterpart: { type: StatTypeEnum.PENALTY_MISSED, impact: ImpactEnum.NEGATIVE },
    },
    [StatTypeEnum.GOAL_CONCEDED]: {
      primary: { type: StatTypeEnum.GOAL_CONCEDED, impact: ImpactEnum.NEGATIVE },
    },

    // ⚖ Discipline
    [StatTypeEnum.FOUL_COMMITTED]: {
      primary: { type: StatTypeEnum.FOUL_COMMITTED, impact: ImpactEnum.NEGATIVE },
      counterpart: { type: StatTypeEnum.FOUL_SUFFERED, impact: ImpactEnum.POSITIVE },
    },
    [StatTypeEnum.FOUL_SUFFERED]: {
      primary: { type: StatTypeEnum.FOUL_SUFFERED, impact: ImpactEnum.POSITIVE },
      counterpart: { type: StatTypeEnum.FOUL_COMMITTED, impact: ImpactEnum.NEGATIVE },
    },

    [StatTypeEnum.YELLOW_CARD]: {
      primary: { type: StatTypeEnum.YELLOW_CARD, impact: ImpactEnum.NEGATIVE },
    },
    [StatTypeEnum.SECOND_YELLOW_CARD]: {
      primary: { type: StatTypeEnum.SECOND_YELLOW_CARD, impact: ImpactEnum.NEGATIVE },
    },
    [StatTypeEnum.RED_CARD]: {
      primary: { type: StatTypeEnum.RED_CARD, impact: ImpactEnum.NEGATIVE },
    },

    // 🏃 Advanced
    [StatTypeEnum.ERROR_LEADING_TO_SHOT]: {
      primary: { type: StatTypeEnum.ERROR_LEADING_TO_SHOT, impact: ImpactEnum.NEGATIVE },
    },
    [StatTypeEnum.ERROR_LEADING_TO_GOAL]: {
      primary: { type: StatTypeEnum.ERROR_LEADING_TO_GOAL, impact: ImpactEnum.NEGATIVE },
    },

    [StatTypeEnum.PENALTY_WON]: {
      primary: { type: StatTypeEnum.PENALTY_WON, impact: ImpactEnum.POSITIVE },
      counterpart: { type: StatTypeEnum.PENALTY_CONCEDED, impact: ImpactEnum.NEGATIVE },
    },
    [StatTypeEnum.PENALTY_MISSED]: {
      primary: { type: StatTypeEnum.PENALTY_MISSED, impact: ImpactEnum.NEGATIVE },
    },
    [StatTypeEnum.PENALTY_SCORED]: {
      primary: { type: StatTypeEnum.PENALTY_SCORED, impact: ImpactEnum.POSITIVE },
    },
    [StatTypeEnum.FREE_KICK_SCORED]: {
      primary: { type: StatTypeEnum.FREE_KICK_SCORED, impact: ImpactEnum.POSITIVE },
    },
    [StatTypeEnum.PENALTY_CONCEDED]: {
      primary: { type: StatTypeEnum.PENALTY_CONCEDED, impact: ImpactEnum.NEGATIVE },
      counterpart: { type: StatTypeEnum.PENALTY_WON, impact: ImpactEnum.POSITIVE },
    },
    [StatTypeEnum.OWN_GOAL]: {
      primary: { type: StatTypeEnum.OWN_GOAL, impact: ImpactEnum.NEGATIVE },
    },
    // Skill moves
    [StatTypeEnum.NUTMEG]: {
      primary: { type: StatTypeEnum.NUTMEG, impact: ImpactEnum.POSITIVE },
      counterpart: { type: StatTypeEnum.NUTMEG_RECEIVED, impact: ImpactEnum.NEGATIVE },
    },
    [StatTypeEnum.NUTMEG_RECEIVED]: {
      primary: { type: StatTypeEnum.NUTMEG_RECEIVED, impact: ImpactEnum.NEGATIVE },
      counterpart: { type: StatTypeEnum.NUTMEG, impact: ImpactEnum.POSITIVE },
    },

    [StatTypeEnum.LOB]: {
      primary: { type: StatTypeEnum.LOB, impact: ImpactEnum.POSITIVE },
      counterpart: { type: StatTypeEnum.LOB_RECEIVED, impact: ImpactEnum.NEGATIVE },
    },
    [StatTypeEnum.LOB_RECEIVED]: {
      primary: { type: StatTypeEnum.LOB_RECEIVED, impact: ImpactEnum.NEGATIVE },
      counterpart: { type: StatTypeEnum.LOB, impact: ImpactEnum.POSITIVE },
    },
  };

  static getEventRule(statType: StatTypeEnum): StatEventRule {
    return this.rules[statType];
  }
}
