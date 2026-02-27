import { AggregateRoot } from '@/app/domain/shared/AggregateRoot';
import { Member } from '../entities/Member';
import { MemberId } from '../value-objects/MemberId';
import { GameMode } from '../value-objects/GameMode';
import { GroupStatusEnum } from '../enum/Group';
import { GroupCreatedEvent } from '../events/GroupCreatedEvent';
import { MemberAddedToGroupEvent } from '../events/MemberAddedToGroupEvent';
import { MemberRemovedFromGroupEvent } from '../events/MemberRemovedFromGroupEvent';
import { GroupId } from '../value-objects/GroupId';
import { DomainError } from '../../shared/DomainError';

interface GroupProps {
  ownerId: string;
  name: string;
  gameMode: GameMode;
  members: Member[];
  status: GroupStatusEnum;
  createdAt: Date;
}

export class Group extends AggregateRoot<GroupId> {
  private props: GroupProps;

  private constructor(id: GroupId, props: GroupProps) {
    super(id);
    this.validate(props);
    this.props = props;
  }

  static create(params: {
    id: GroupId;
    name: string;
    gameMode: GameMode;
    ownerId: string;
    createdAt?: Date;
  }): Group {
    const group = new Group(params.id, {
      name: params.name,
      gameMode: params.gameMode,
      members: [],
      status: GroupStatusEnum.ACTIVE,
      createdAt: params.createdAt ?? new Date(),
      ownerId: params.ownerId,
    });

    group.addDomainEvent(new GroupCreatedEvent(group.id));

    return group;
  }

  private validate(props: GroupProps): void {
    if (!props.name || props.name.trim().length === 0) {
      throw new DomainError('GroupNameRequired');
    }

    if (!props.ownerId) {
      throw new DomainError('GroupOwnerIdRequired');
    }
  }

  get name(): string {
    return this.props.name;
  }

  get gameMode(): GameMode {
    return this.props.gameMode;
  }

  get members(): Member[] {
    return this.props.members;
  }

  get status(): GroupStatusEnum {
    return this.props.status;
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  addMember(member: Member): void {
    if (this.props.status !== GroupStatusEnum.ACTIVE) {
      throw new DomainError('GroupInactiveCannotAddMembers');
    }

    if (this.props.members.some(m => m.equals(member))) {
      throw new DomainError('MemberAlreadyInGroup');
    }

    if (member.status === 'LEFT') {
      throw new DomainError('MemberLeftGroupCannotRejoin');
    }

    this.props.members.push(member);

    this.addDomainEvent(new MemberAddedToGroupEvent(this.id, member.id));
  }

  removeMember(memberId: MemberId): void {
    const member = this.props.members.find(m => m.id.equals(memberId));

    if (!member) {
      throw new DomainError('MemberNotFound');
    }

    member.leave();

    this.addDomainEvent(new MemberRemovedFromGroupEvent(this.id, member.id));
  }

  deactivate(): void {
    this.props.status = GroupStatusEnum.INACTIVE;
  }

  activate(): void {
    this.props.status = GroupStatusEnum.ACTIVE;
  }
}
