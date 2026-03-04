import { ValueObject } from "@/app/domain/shared/ValueObject";

import { MemberId } from "./MemberId";
import { UserId } from "./UserId";

export class MemberUserLink extends ValueObject<UserId> {
  private constructor(
    public readonly userId: UserId,
    public readonly memberId: MemberId,
  ) {
    super(userId);
  }

  static create(userId: UserId, memberId: MemberId): MemberUserLink {
    return new MemberUserLink(userId, memberId);
  }
}
