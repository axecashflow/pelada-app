import { DomainEventHandler } from "@/app/domain/shared/DomainEventHandler";
import { MatchStatRecordedEvent } from "@/app/domain/matches/events/MatchStatRecordedEvent";
import { ProfileStatsRepository } from "../repositories/ProfileStatsRepository";
import { ProfileStats } from "../aggregates/ProfileStats";
import { ProfileStatsEventMapper } from "../mappers/ProfileStatsEventMapper";

export class UpdateProfileStatsOnMatchStatRecordedHandler implements DomainEventHandler<MatchStatRecordedEvent> {
  readonly eventName = "MatchStatRecorded";

  constructor(private profileStatsRepository: ProfileStatsRepository) {}

  async handle(event: MatchStatRecordedEvent): Promise<void> {
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

    ProfileStatsEventMapper.mapEventToProfileStatMethod(profileStats, event);

    await this.profileStatsRepository.save(profileStats);
  }
}
