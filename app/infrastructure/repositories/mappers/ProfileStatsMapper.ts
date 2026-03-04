import { ProfileStats } from "@/app/domain/users/aggregates/ProfileStats";
import { UserId } from "@/app/domain/users/values-objects/UserId";
import { OutfieldPlayerStats } from "@/app/domain/users/values-objects/OutfieldPlayerStats";
import { ProfileStatsPersistence } from "../types/ProfileStatsPersistence";

export class ProfileStatsMapper {
  static toDomain(persistence: ProfileStatsPersistence): ProfileStats {
    const userId = UserId.create(persistence.userId);
    const stats = OutfieldPlayerStats.create({
      numberOfMatches: parseInt(persistence.numberOfMatches, 10),
      assists: parseInt(persistence.assists, 10),
      shotsOnTarget: parseInt(persistence.shotsOnTarget, 10),
      shotsOffTarget: parseInt(persistence.shotsOffTarget, 10),
      shotsHitPost: parseInt(persistence.shotsHitPost, 10),
      goalFromInsideBox: parseInt(persistence.goalFromInsideBox, 10),
      goalFromOutsideBox: parseInt(persistence.goalFromOutsideBox, 10),
      ownGoal: parseInt(persistence.ownGoal, 10),
      dribbleSuccess: parseInt(persistence.dribbleSuccess, 10),
      dribbleFailed: parseInt(persistence.dribbleFailed, 10),
      passCompleted: parseInt(persistence.passCompleted, 10),
      passFailed: parseInt(persistence.passFailed, 10),
      tackle: parseInt(persistence.tackle, 10),
      interception: parseInt(persistence.interception, 10),
      block: parseInt(persistence.block, 10),
      possessionLost: parseInt(persistence.possessionLost, 10),
      ballRecovery: parseInt(persistence.ballRecovery, 10),
      foulCommitted: parseInt(persistence.foulCommitted, 10),
      foulSuffered: parseInt(persistence.foulSuffered, 10),
      yellowCard: parseInt(persistence.yellowCard, 10),
      redCard: parseInt(persistence.redCard, 10),
      penaltyWon: parseInt(persistence.penaltyWon, 10),
      penaltyMissed: parseInt(persistence.penaltyMissed, 10),
      penaltyScored: parseInt(persistence.penaltyScored, 10),
      penaltyConceded: parseInt(persistence.penaltyConceded, 10),
      freeKickScored: parseInt(persistence.freeKickScored, 10),
      nutmeg: parseInt(persistence.nutmeg, 10),
      lob: parseInt(persistence.lob, 10),
      save: parseInt(persistence.save, 10),
      saveInsideBox: parseInt(persistence.saveInsideBox, 10),
      saveOutsideBox: parseInt(persistence.saveOutsideBox, 10),
      penaltySave: parseInt(persistence.penaltySave, 10),
      goalConceded: parseInt(persistence.goalConceded, 10),
    });

    return ProfileStats.restore(userId, stats);
  }

  static toPersistence(profileStats: ProfileStats): ProfileStatsPersistence {
    return {
      userId: profileStats.userId.value,
      numberOfMatches: profileStats.stats.numberOfMatches.toString(),
      assists: profileStats.stats.assists.toString(),
      shotsOnTarget: profileStats.stats.shotsOnTarget.toString(),
      shotsOffTarget: profileStats.stats.shotsOffTarget.toString(),
      shotsHitPost: profileStats.stats.shotsHitPost.toString(),
      goalFromInsideBox: profileStats.stats.goalFromInsideBox.toString(),
      goalFromOutsideBox: profileStats.stats.goalFromOutsideBox.toString(),
      ownGoal: profileStats.stats.ownGoal.toString(),
      dribbleSuccess: profileStats.stats.dribbleSuccess.toString(),
      dribbleFailed: profileStats.stats.dribbleFailed.toString(),
      passCompleted: profileStats.stats.passCompleted.toString(),
      passFailed: profileStats.stats.passFailed.toString(),
      tackle: profileStats.stats.tackle.toString(),
      interception: profileStats.stats.interception.toString(),
      block: profileStats.stats.block.toString(),
      possessionLost: profileStats.stats.possessionLost.toString(),
      ballRecovery: profileStats.stats.ballRecovery.toString(),
      foulCommitted: profileStats.stats.foulCommitted.toString(),
      foulSuffered: profileStats.stats.foulSuffered.toString(),
      yellowCard: profileStats.stats.yellowCard.toString(),
      redCard: profileStats.stats.redCard.toString(),
      penaltyWon: profileStats.stats.penaltyWon.toString(),
      penaltyMissed: profileStats.stats.penaltyMissed.toString(),
      penaltyScored: profileStats.stats.penaltyScored.toString(),
      penaltyConceded: profileStats.stats.penaltyConceded.toString(),
      freeKickScored: profileStats.stats.freeKickScored.toString(),
      nutmeg: profileStats.stats.nutmeg.toString(),
      lob: profileStats.stats.lob.toString(),
      save: profileStats.stats.save.toString(),
      saveInsideBox: profileStats.stats.saveInsideBox.toString(),
      saveOutsideBox: profileStats.stats.saveOutsideBox.toString(),
      penaltySave: profileStats.stats.penaltySave.toString(),
      goalConceded: profileStats.stats.goalConceded.toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
