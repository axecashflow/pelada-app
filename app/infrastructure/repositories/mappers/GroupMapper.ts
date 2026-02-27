import { Group } from "@/app/domain/group/aggregates/Group";
import { Member } from "@/app/domain/group/entities/Member";
import { MemberId } from "@/app/domain/group/value-objects/MemberId";
import { GameModeMapper } from "./GameModeMapper";
import { GroupPersistence } from "../types/GroupPersistence";
import { GroupId } from "@/app/domain/group/value-objects/GroupId";
import { MemberStatusEnum } from "@/app/domain/group/enum/Member";

export class GroupMapper {
  static toPersistence(group: Group) {
    return {
      id: group.id.value,
      name: group.name,
      gameMode: GameModeMapper.toPersistence(group.gameMode),
      status: group.status,
      ownerId: group.ownerId,
      createdAt: group['props'].createdAt,
    };
  }

  static toDomain(raw: GroupPersistence): Group {
    const group = Group.create({
      id: GroupId.create(raw.id),
      name: raw.name,
      gameMode: GameModeMapper.toDomain(raw.gameMode),
      ownerId: raw.ownerId,
      createdAt: raw.createdAt,
    });

    if (raw.members) {
      raw.members.forEach(m => {
        const member = Member.create({
          id: MemberId.create(m.id),
          name: m.name,
        });

        if (m.status === MemberStatusEnum.INACTIVE) {
          member.deactivate();
        }

        if (m.status === MemberStatusEnum.SUSPENDED) {
          member.suspend();
        }

        if (m.status === MemberStatusEnum.LEFT) {
          member.leave();
        }

        group.addMember(member);
      });
    }

    return group;
  }
}
