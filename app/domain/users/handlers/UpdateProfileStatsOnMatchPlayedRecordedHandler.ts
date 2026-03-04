import { DomainEventHandler } from "@/app/domain/shared/DomainEventHandler";
import { ProfileStatsRepository } from "../repositories/ProfileStatsRepository";
import { ProfileStats } from "../aggregates/ProfileStats";
import { MatchPlayedRecordedEvent } from "../../matches/events/MatchPlayedRecordedEvent";

export class UpdateProfileStatsOnMatchPlayedRecordedHandler implements DomainEventHandler<MatchPlayedRecordedEvent> {
  readonly eventName = "MatchPlayedRecorded";

  constructor(private profileStatsRepository: ProfileStatsRepository) {}

  async handle(event: MatchPlayedRecordedEvent): Promise<void> {
    const userId = await this.profileStatsRepository.findUserIdFromPlayer(
      event.payload.playerId,
    );

    if (!userId) {
      return;
    }

    let profileStats = await this.profileStatsRepository.findByUserId(userId);

    if (!profileStats) {
      profileStats = ProfileStats.create(userId);
    }

    profileStats.addMatchPlayed();

    await this.profileStatsRepository.save(profileStats);
  }
}
