import { UpdateProfileStatsOnMatchStatRecordedHandler } from "@/app/domain/users/handlers/UpdateProfileStatsOnMatchStatRecordedHandler";
import { ProfileStatsRepository } from "@/app/domain/users/repositories/ProfileStatsRepository";

export function makeUpdateProfileStatsOnMatchStatRecordedHandler(
  profileStatsRepository: ProfileStatsRepository,
): UpdateProfileStatsOnMatchStatRecordedHandler {
  return new UpdateProfileStatsOnMatchStatRecordedHandler(
    profileStatsRepository,
  );
}
