import { DomainEvent } from "@/app/domain/shared/DomainEvent";

export interface MatchPlayedRecordedEventPayload {
  matchId: string;
  groupId: string;
  playerId: string;
}

export class MatchPlayedRecordedEvent implements DomainEvent {
  readonly eventName = "MatchPlayedRecorded";
  readonly occurredOn = new Date();

  private constructor(readonly payload: MatchPlayedRecordedEventPayload) {}

  static create(
    matchId: string,
    groupId: string,
    playerId: string,
  ): MatchPlayedRecordedEvent {
    return new MatchPlayedRecordedEvent({
      matchId,
      groupId,
      playerId,
    });
  }
}
