import { Group } from "@/app/domain/group/aggregates/Group";
import { Member } from "@/app/domain/group/entities/Member";
import { MemberId } from "@/app/domain/group/value-objects/MemberId";
import { GameModeMapper } from "./GameModeMapper";
import { GroupPersistence } from "../types/GroupPersistence";
import { GroupId } from "@/app/domain/group/value-objects/GroupId";
import { MemberStatusEnum } from "@/app/domain/group/enum/Member";
import { MemberUserLink } from "@/app/domain/group/value-objects/MemberUserLink";
import { UserId } from "@/app/domain/group/value-objects/UserId";
import { m } from "framer-motion";

export class GroupMapper {
  static toPersistence(group: Group) {
    return {
      id: group.id.value,
      name: group.name,
      gameMode: GameModeMapper.toPersistence(group.gameMode),
      status: group.status,
      ownerId: group.ownerId,
      createdAt: group.createdAt,
      members: group.members.map(m => ({
        id: m.id.value,
        name: m.name,
        status: m.status
      }))
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
        let userLink: MemberUserLink | undefined;

        if (m.userLink && m.userLink.userId) {
          userLink = MemberUserLink.create(
            UserId.create(m.userLink.userId),
            MemberId.create(m.id)
          );
        }

        const member = Member.create({
          id: MemberId.create(m.id),
          name: m.name,
          userLink,
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
