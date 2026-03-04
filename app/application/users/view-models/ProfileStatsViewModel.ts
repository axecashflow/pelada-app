import { ProfileStats } from "@/app/domain/users/aggregates/ProfileStats";
import { ProfileStatsProps } from "@/app/domain/users/values-objects/OutfieldPlayerStats";

export class ProfileStatsViewModel {
  static toObject(profileStats: ProfileStats): ProfileStatsProps {
    return {
      numberOfMatches: profileStats.stats.numberOfMatches,
      assists: profileStats.stats.assists,
      ballRecovery: profileStats.stats.ballRecovery,
      block: profileStats.stats.block,
      dribbleFailed: profileStats.stats.dribbleFailed,
      dribbleSuccess: profileStats.stats.dribbleSuccess,
      foulCommitted: profileStats.stats.foulCommitted,
      foulSuffered: profileStats.stats.foulSuffered,
      freeKickScored: profileStats.stats.freeKickScored,
      goalConceded: profileStats.stats.goalConceded,
      goalFromInsideBox: profileStats.stats.goalFromInsideBox,
      goalFromOutsideBox: profileStats.stats.goalFromOutsideBox,
      interception: profileStats.stats.interception,
      lob: profileStats.stats.lob,
      nutmeg: profileStats.stats.nutmeg,
      ownGoal: profileStats.stats.ownGoal,
      passCompleted: profileStats.stats.passCompleted,
      passFailed: profileStats.stats.passFailed,
      penaltyConceded: profileStats.stats.penaltyConceded,
      penaltyMissed: profileStats.stats.penaltyMissed,
      penaltySave: profileStats.stats.penaltySave,
      penaltyScored: profileStats.stats.penaltyScored,
      penaltyWon: profileStats.stats.penaltyWon,
      possessionLost: profileStats.stats.possessionLost,
      redCard: profileStats.stats.redCard,
      save: profileStats.stats.save,
      saveInsideBox: profileStats.stats.saveInsideBox,
      shotsHitPost: profileStats.stats.shotsHitPost,
      saveOutsideBox: profileStats.stats.saveOutsideBox,
      shotsOffTarget: profileStats.stats.shotsOffTarget,
      shotsOnTarget: profileStats.stats.shotsOnTarget,
      tackle: profileStats.stats.tackle,
      yellowCard: profileStats.stats.yellowCard
    }
  }
}