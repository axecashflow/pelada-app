"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import makeGroupService from "@/app/application/group/factories/makeGroupService";
import { GroupViewModel } from "@/app/application/group/view-models/GroupViewModel";
import { getServerSession } from "next-auth";

const service = makeGroupService();

export async function getGroupDetails(groupId: string) {
  const group = await service.getGroupDetails(groupId);

  return group ? GroupViewModel.toObject(group) : null;
}

export async function inviteManager(groupId: string) {
  const session = await getServerSession(authOptions);

  const userId = session?.user.id!;

  await service.inviteManager(groupId, userId);
}
