import { Entity } from "@/app/domain/shared/Entity";
import { MemberId } from "../value-objects/MemberId";
import { MemberStatusEnum } from "../enum/Member";
import { DomainError } from "../../shared/DomainError";

import { MemberUserLink } from "../value-objects/MemberUserLink";
import { UserId } from "../value-objects/UserId";

interface MemberProps {
  name: string;
  status: MemberStatusEnum;
  userLink?: MemberUserLink;
}

export class Member extends Entity<MemberId> {
  private props: MemberProps;

  private constructor(id: MemberId, props: MemberProps) {
    super(id);
    this.validate(props);
    this.props = props;
  }

  static create(params: {
    id: MemberId;
    name: string;
    userLink?: MemberUserLink;
  }): Member {
    return new Member(params.id, {
      name: params.name,
      status: MemberStatusEnum.ACTIVE,
      userLink: params.userLink,
    });
  }
  get userLink(): MemberUserLink | undefined {
    return this.props.userLink;
  }

  private validate(props: MemberProps): void {
    if (!props.name || props.name.trim().length === 0) {
      throw new DomainError("MemberNameRequired");
    }
  }

  get name(): string {
    return this.props.name;
  }

  get status(): MemberStatusEnum {
    return this.props.status;
  }

  changeName(newName: string): void {
    this.validate({ ...this.props, name: newName });

    this.props.name = newName;
  }

  linkUser(userId: UserId): void {
    if (this.props.userLink) {
      throw new DomainError("MemberAlreadyInGroup");
    }

    this.props.userLink = MemberUserLink.create(userId, this.id);
  }

  unlinkUser(): void {
    this.props.userLink = undefined;
  }

  suspend(): void {
    if (this.props.status !== MemberStatusEnum.ACTIVE) {
      throw new DomainError("OnlyActiveMembersCanBeSuspended");
    }

    this.props.status = MemberStatusEnum.SUSPENDED;
  }

  activate(): void {
    if (this.props.status === MemberStatusEnum.LEFT) {
      throw new DomainError("CannotActivateMemberThatLeftGroup");
    }

    this.props.status = MemberStatusEnum.ACTIVE;
  }

  deactivate(): void {
    if (this.props.status !== MemberStatusEnum.ACTIVE) {
      throw new DomainError("CannotDeactivateMembersNotActive");
    }

    this.props.status = MemberStatusEnum.INACTIVE;
  }

  leave(): void {
    this.props.status = MemberStatusEnum.LEFT;
  }
}
