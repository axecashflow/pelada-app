import { eq } from "drizzle-orm";

import { db } from "@/app/infrastructure/db/connection";
import {
  memberUserLink,
  profileStats as profileStatsTable,
} from "@/app/infrastructure/db/schema";
import { ProfileStatsRepository } from "@/app/domain/users/repositories/ProfileStatsRepository";
import { ProfileStats } from "@/app/domain/users/aggregates/ProfileStats";
import { UserId } from "@/app/domain/users/values-objects/UserId";

import { ProfileStatsMapper } from "./mappers/ProfileStatsMapper";

export class DrizzleProfileStatsRepository implements ProfileStatsRepository {
  async save(profileStats: ProfileStats): Promise<void> {
    const persistence = ProfileStatsMapper.toPersistence(profileStats);

    await db
      .insert(profileStatsTable)
      .values({
        userId: persistence.userId,
        numberOfMatches: persistence.numberOfMatches,
        assists: persistence.assists,
        shotsOnTarget: persistence.shotsOnTarget,
        shotsOffTarget: persistence.shotsOffTarget,
        shotsHitPost: persistence.shotsHitPost,
        goalFromInsideBox: persistence.goalFromInsideBox,
        goalFromOutsideBox: persistence.goalFromOutsideBox,
        ownGoal: persistence.ownGoal,
        dribbleSuccess: persistence.dribbleSuccess,
        dribbleFailed: persistence.dribbleFailed,
        passCompleted: persistence.passCompleted,
        passFailed: persistence.passFailed,
        tackle: persistence.tackle,
        interception: persistence.interception,
        block: persistence.block,
        possessionLost: persistence.possessionLost,
        ballRecovery: persistence.ballRecovery,
        foulCommitted: persistence.foulCommitted,
        foulSuffered: persistence.foulSuffered,
        yellowCard: persistence.yellowCard,
        redCard: persistence.redCard,
        penaltyWon: persistence.penaltyWon,
        penaltyMissed: persistence.penaltyMissed,
        penaltyScored: persistence.penaltyScored,
        penaltyConceded: persistence.penaltyConceded,
        freeKickScored: persistence.freeKickScored,
        nutmeg: persistence.nutmeg,
        lob: persistence.lob,
        save: persistence.save,
        saveInsideBox: persistence.saveInsideBox,
        saveOutsideBox: persistence.saveOutsideBox,
        penaltySave: persistence.penaltySave,
        goalConceded: persistence.goalConceded,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: profileStatsTable.userId,
        set: {
          numberOfMatches: persistence.numberOfMatches,
          assists: persistence.assists,
          shotsOnTarget: persistence.shotsOnTarget,
          shotsOffTarget: persistence.shotsOffTarget,
          shotsHitPost: persistence.shotsHitPost,
          goalFromInsideBox: persistence.goalFromInsideBox,
          goalFromOutsideBox: persistence.goalFromOutsideBox,
          ownGoal: persistence.ownGoal,
          dribbleSuccess: persistence.dribbleSuccess,
          dribbleFailed: persistence.dribbleFailed,
          passCompleted: persistence.passCompleted,
          passFailed: persistence.passFailed,
          tackle: persistence.tackle,
          interception: persistence.interception,
          block: persistence.block,
          possessionLost: persistence.possessionLost,
          ballRecovery: persistence.ballRecovery,
          foulCommitted: persistence.foulCommitted,
          foulSuffered: persistence.foulSuffered,
          yellowCard: persistence.yellowCard,
          redCard: persistence.redCard,
          penaltyWon: persistence.penaltyWon,
          penaltyMissed: persistence.penaltyMissed,
          penaltyScored: persistence.penaltyScored,
          penaltyConceded: persistence.penaltyConceded,
          freeKickScored: persistence.freeKickScored,
          nutmeg: persistence.nutmeg,
          lob: persistence.lob,
          save: persistence.save,
          saveInsideBox: persistence.saveInsideBox,
          saveOutsideBox: persistence.saveOutsideBox,
          penaltySave: persistence.penaltySave,
          goalConceded: persistence.goalConceded,
          updatedAt: new Date(),
        },
      });
  }

  async findByUserId(userId: UserId): Promise<ProfileStats> {
    const result = await db
      .select()
      .from(profileStatsTable)
      .where(eq(profileStatsTable.userId, userId.value))
      .limit(1);

    if (result.length === 0) {
      return ProfileStats.create(userId);
    }

    return ProfileStatsMapper.toDomain(result[0] as any);
  }

  async findUserIdFromPlayer(playerId: string): Promise<UserId | null> {
    const result = await db
      .select({ userId: memberUserLink.userId })
      .from(memberUserLink)
      .where(eq(memberUserLink.memberId, playerId))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return UserId.create(result[0].userId);
  }
}
