import { DomainEvent } from "@/app/domain/shared/DomainEvent";
import { GroupId } from "../value-objects/GroupId";

export class GroupCreatedEvent implements DomainEvent {
  public readonly eventName = "group.created";
  public readonly occurredOn: Date;

  constructor(
    public readonly groupId: GroupId
  ) {
    this.occurredOn = new Date();
  }
}