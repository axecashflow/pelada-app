import { DomainEvent } from "@/app/domain/shared/DomainEvent";
import { StatTypeEnum } from "@/app/domain/matches/enum/Stats";

export interface MatchStatRecordedEventPayload {
  matchId: string;
  groupId: string;
  playerId: string;
  statType: StatTypeEnum;
}

export class MatchStatRecordedEvent implements DomainEvent {
  readonly eventName = "MatchStatRecorded";
  readonly occurredOn = new Date();

  private constructor(readonly payload: MatchStatRecordedEventPayload) {}

  static create(
    matchId: string,
    groupId: string,
    playerId: string,
    statType: StatTypeEnum,
  ): MatchStatRecordedEvent {
    return new MatchStatRecordedEvent({
      matchId,
      groupId,
      playerId,
      statType,
    });
  }
}
