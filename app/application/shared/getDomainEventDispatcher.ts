import { DomainEventDispatcher } from "@/app/domain/shared/DomainEventDispatcher";
import { DrizzleProfileStatsRepository } from "@/app/infrastructure/repositories/DrizzleProfileStatsRepository";
import { makeUpdateProfileStatsOnMatchStatRecordedHandler } from "@/app/domain/users/handlers/factories/makeUpdateProfileStatsOnMatchStatRecordedHandler";
import { makeUpdateProfileStatsOnMatchPlayedRecordedHandler } from "@/app/domain/users/handlers/factories/makeUpdateProfileStatsOnMatchPlayedRecordedHandler";

function initializeDomainEventDispatcher(): DomainEventDispatcher {
  const dispatcher = new DomainEventDispatcher();
  
  const profileStatsRepository = new DrizzleProfileStatsRepository();
  const updateProfileStatsHandler = makeUpdateProfileStatsOnMatchStatRecordedHandler(
    profileStatsRepository
  );

  const updateProfileMatchesPlayedHandler = makeUpdateProfileStatsOnMatchPlayedRecordedHandler(
    profileStatsRepository
  );
  
  dispatcher.register(updateProfileStatsHandler);
  dispatcher.register(updateProfileMatchesPlayedHandler);
  
  return dispatcher;
}

export const domainEventDispatcher = initializeDomainEventDispatcher();
