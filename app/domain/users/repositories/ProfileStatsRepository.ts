import { ProfileStats } from "../aggregates/ProfileStats";
import { UserId } from "../values-objects/UserId";

export interface ProfileStatsRepository {
  save(profileStats: ProfileStats): Promise<void>;
  findByUserId(userId: UserId): Promise<ProfileStats>;
  findUserIdFromPlayer(playerId: string): Promise<UserId | null>;
}
