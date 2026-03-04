import { UpdateProfileStatsOnMatchPlayedRecordedHandler } from "@/app/domain/users/handlers/UpdateProfileStatsOnMatchPlayedRecordedHandler";
import { ProfileStatsRepository } from "@/app/domain/users/repositories/ProfileStatsRepository";

export function makeUpdateProfileStatsOnMatchPlayedRecordedHandler(
  profileStatsRepository: ProfileStatsRepository,
): UpdateProfileStatsOnMatchPlayedRecordedHandler {
  return new UpdateProfileStatsOnMatchPlayedRecordedHandler(
    profileStatsRepository,
  );
}
