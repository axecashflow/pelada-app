import { GroupRepository } from '@/app/domain/group/repositories/GroupRepository';
import { Group } from '@/app/domain/group/aggregates/Group';
import { GameMode } from '@/app/domain/group/value-objects/GameMode';
import { GameModeEnum } from '@/app/domain/group/enum/GameMode';
import { GroupId } from '@/app/domain/group/value-objects/GroupId';
import { Member } from '@/app/domain/group/entities/Member';
import { MemberId } from '@/app/domain/group/value-objects/MemberId';
import { DomainError } from '@/app/domain/shared/DomainError';

type CreateGroupInput = {
  id: string;
  name: string;
  ownerId: string;
  gameMode: {
    type: GameModeEnum;
    playersPerTeam: number;
  };
}

type AddMemberToGroupInput = {
  groupId: string;
  memberId: string;
  memberName: string;
};

export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) { }

  async createGroup(input: CreateGroupInput): Promise<void> {
    const gameMode = GameMode.create({
      type: input.gameMode.type,
      playersPerTeam: input.gameMode.playersPerTeam,
    });

    const group = Group.create({
      id: GroupId.create(input.id),
      name: input.name,
      gameMode,
      ownerId: input.ownerId,
    });

    await this.groupRepository.save(group);
  }

  async getGroupsByOwnerId(ownerId: string): Promise<Group[]> {
    const groups = await this.groupRepository.findListByOwnerId(ownerId);

    return groups;
  }

  async getGroupDetails(groupId: string): Promise<Group | null> {
    const group = await this.groupRepository.findById(groupId);

    return group;
  }

  async addMemberToGroup(input: AddMemberToGroupInput): Promise<void> {
    const group = await this.groupRepository.findById(input.groupId);

    const member = Member.create({
      id: MemberId.create(input.memberId),
      name: input.memberName
    });

    if (!group) {
      throw new DomainError('GroupIdCannotBeEmpty');
    }

    group.addMember(member);

    await this.groupRepository.save(group);
  }
}
