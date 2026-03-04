import { MatchStatRecordedEvent } from "@/app/domain/matches/events/MatchStatRecordedEvent";
import { ProfileStats } from "../aggregates/ProfileStats";
import { ProfileStatTypeEnum } from "../enum/ProfileStatType";

export class ProfileStatsEventMapper {
  static mapEventToProfileStatMethod(
    profileStats: ProfileStats,
    event: MatchStatRecordedEvent,
  ): void {
    const statType = event.payload.statType as unknown as ProfileStatTypeEnum;

    switch (statType) {
      case ProfileStatTypeEnum.ASSIST:
        profileStats.addAssist();
        break;
      case ProfileStatTypeEnum.SHOT_ON_TARGET:
        profileStats.addShotOnTarget();
        break;
      case ProfileStatTypeEnum.SHOT_OFF_TARGET:
        profileStats.addShotOffTarget();
        break;
      case ProfileStatTypeEnum.SHOT_HIT_POST:
        profileStats.addShotHitPost();
        break;
      case ProfileStatTypeEnum.GOAL_FROM_INSIDE_BOX:
        profileStats.addGoalFromInsideBox();
        break;
      case ProfileStatTypeEnum.GOAL_FROM_OUTSIDE_BOX:
        profileStats.addGoalFromOutsideBox();
        break;
      case ProfileStatTypeEnum.OWN_GOAL:
        profileStats.addOwnGoal();
        break;
      case ProfileStatTypeEnum.DRIBBLE_SUCCESS:
        profileStats.addDribbleSuccess();
        break;
      case ProfileStatTypeEnum.DRIBBLE_FAILED:
        profileStats.addDribbleFailed();
        break;
      case ProfileStatTypeEnum.PASS_COMPLETED:
        profileStats.addPassCompleted();
        break;
      case ProfileStatTypeEnum.PASS_FAILED:
        profileStats.addPassFailed();
        break;
      case ProfileStatTypeEnum.TACKLE:
        profileStats.addTackle();
        break;
      case ProfileStatTypeEnum.INTERCEPTION:
        profileStats.addInterception();
        break;
      case ProfileStatTypeEnum.BLOCK:
        profileStats.addBlock();
        break;
      case ProfileStatTypeEnum.POSSESSION_LOST:
        profileStats.addPossessionLost();
        break;
      case ProfileStatTypeEnum.BALL_RECOVERY:
        profileStats.addBallRecovery();
        break;
      case ProfileStatTypeEnum.FOUL_COMMITTED:
        profileStats.addFoulCommitted();
        break;
      case ProfileStatTypeEnum.FOUL_SUFFERED:
        profileStats.addFoulSuffered();
        break;
      case ProfileStatTypeEnum.YELLOW_CARD:
        profileStats.addYellowCard();
        break;
      case ProfileStatTypeEnum.RED_CARD:
        profileStats.addRedCard();
        break;
      case ProfileStatTypeEnum.PENALTY_WON:
        profileStats.addPenaltyWon();
        break;
      case ProfileStatTypeEnum.PENALTY_MISSED:
        profileStats.addPenaltyMissed();
        break;
      case ProfileStatTypeEnum.PENALTY_SCORED:
        profileStats.addPenaltyScored();
        break;
      case ProfileStatTypeEnum.PENALTY_CONCEDED:
        profileStats.addPenaltyConceded();
        break;
      case ProfileStatTypeEnum.FREE_KICK_SCORED:
        profileStats.addFreeKickScored();
        break;
      case ProfileStatTypeEnum.NUTMEG:
        profileStats.addNutmeg();
        break;
      case ProfileStatTypeEnum.LOB:
        profileStats.addLob();
        break;
      case ProfileStatTypeEnum.SAVE:
        profileStats.addSave();
        break;
      case ProfileStatTypeEnum.SAVE_INSIDE_BOX:
        profileStats.addSaveInsideBox();
        break;
      case ProfileStatTypeEnum.SAVE_OUTSIDE_BOX:
        profileStats.addSaveOutsideBox();
        break;
      case ProfileStatTypeEnum.PENALTY_SAVE:
        profileStats.addPenaltySave();
        break;
      case ProfileStatTypeEnum.GOAL_CONCEDED:
        profileStats.addGoalConceded();
        break;

      case ProfileStatTypeEnum.NUTMEG_RECEIVED:
      case ProfileStatTypeEnum.LOB_RECEIVED:
      case ProfileStatTypeEnum.PRE_ASSIST:
      case ProfileStatTypeEnum.BIG_CHANCE_CREATED:
      case ProfileStatTypeEnum.BIG_CHANCE_MISSED:
      case ProfileStatTypeEnum.SHOT_BLOCKED:
      case ProfileStatTypeEnum.LONG_PASS_COMPLETED:
      case ProfileStatTypeEnum.LONG_PASS_FAILED:
      case ProfileStatTypeEnum.CROSS_COMPLETED:
      case ProfileStatTypeEnum.CROSS_FAILED:
      case ProfileStatTypeEnum.KEY_PASS:
      case ProfileStatTypeEnum.PROGRESSIVE_PASS:
      case ProfileStatTypeEnum.CLEARANCE:
      case ProfileStatTypeEnum.DUEL_WON:
      case ProfileStatTypeEnum.DUEL_LOST:
      case ProfileStatTypeEnum.AERIAL_DUEL_WON:
      case ProfileStatTypeEnum.AERIAL_DUEL_LOST:
      case ProfileStatTypeEnum.ERROR_LEADING_TO_SHOT:
      case ProfileStatTypeEnum.ERROR_LEADING_TO_GOAL:
      case ProfileStatTypeEnum.SECOND_YELLOW_CARD:
        break;
    }
  }
}
