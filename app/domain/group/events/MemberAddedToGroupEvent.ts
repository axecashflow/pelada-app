import { DomainEvent } from "@/app/domain/shared/DomainEvent";
import { GroupId } from "../value-objects/GroupId";
import { MemberId } from "../value-objects/MemberId";

export class MemberAddedToGroupEvent implements DomainEvent {
  public readonly eventName = "group.member_added";
  public readonly occurredOn: Date;

  constructor(
    public readonly groupId: GroupId,
    public readonly memberId: MemberId,
  ) {
    this.occurredOn = new Date();
  }
}
