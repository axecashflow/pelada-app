import { GroupRepository } from "@/app/domain/group/repositories/GroupRepository";
import { Group } from "@/app/domain/group/aggregates/Group";

import { db } from "../db/connection";
import { groups, members, memberUserLink } from "../db/schema";
import { groupManagers } from "../db/schema";
import { eq, inArray } from "drizzle-orm";

import { GroupMapper } from "./mappers/GroupMapper";
import { GroupPersistence } from "./types/GroupPersistence";

export class DrizzleGroupRepository implements GroupRepository {
  async save(group: Group): Promise<void> {
    await db.transaction(async (tx) => {
      await tx
        .insert(groups)
        .values(GroupMapper.toPersistence(group))
        .onConflictDoUpdate({
          target: groups.id,
          set: {
            name: group.name,
            gameMode: GroupMapper.toPersistence(group).gameMode,
            status: group.status,
          },
        });

      await tx.delete(memberUserLink).where(
        inArray(
          memberUserLink.memberId,
          group.members.map((m) => m.id.value),
        ),
      );

      await tx.delete(members).where(eq(members.groupId, group.id.value));

      if (group.members.length > 0) {
        await tx.insert(members).values(
          group.members.map((member) => ({
            id: member.id.value,
            name: member.name,
            status: member.status,
            groupId: group.id.value,
          })),
        );

        const userLinksToInsert = group.members
          .filter((member) => member.userLink)
          .map((member) => ({
            memberId: member.id.value,
            userId: member.userLink!.userId.value,
          }));

        if (userLinksToInsert.length > 0) {
          await tx.insert(memberUserLink).values(userLinksToInsert);
        }
      }
    });
  }

  async findById(id: string): Promise<Group | null> {
    const groupRows = await db.select().from(groups).where(eq(groups.id, id));

    if (groupRows.length === 0) {
      return null;
    }

    const memberRows = await db
      .select()
      .from(members)
      .where(eq(members.groupId, id));

    const userLinkRows = await db
      .select()
      .from(memberUserLink)
      .where(
        inArray(
          memberUserLink.memberId,
          memberRows.map((m) => m.id),
        ),
      );

    const memberRowsWithLinks = memberRows.map((memberRow) => ({
      ...memberRow,
      userLink: userLinkRows.find((link) => link.memberId === memberRow.id),
    }));

    const persistence: GroupPersistence = {
      ...groupRows[0],
      members: memberRowsWithLinks,
    };

    return GroupMapper.toDomain(persistence);
  }

  async findListByOwnerId(ownerId: string): Promise<Group[]> {
    const groupRows = await db
      .select()
      .from(groups)
      .where(eq(groups.ownerId, ownerId));

    return groupRows.map(GroupMapper.toDomain);
  }

  async addManager(groupId: string, userId: string): Promise<void> {
    await db.insert(groupManagers).values({
      groupId,
      userId,
    });
  }

  async findGroupsByManagerId(userId: string): Promise<Group[]> {
    const groupManagerRows = await db
      .select()
      .from(groupManagers)
      .where(eq(groupManagers.userId, userId));

    const groupIds = groupManagerRows.map((row) => row.groupId);

    if (groupIds.length === 0) {
      return [];
    }

    const groupRows = await db
      .select()
      .from(groups)
      .where(inArray(groups.id, groupIds));

    return groupRows.map(GroupMapper.toDomain);
  }
}
