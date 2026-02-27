'use server';

import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import makeGroupService from "@/app/application/group/factories/makeGroupService";
import { GroupViewModel } from "@/app/application/group/view-models/GroupViewModel";

const service = makeGroupService();

export async function getGroups() {
  const user = await getServerSession(authOptions);

  const ownerId = user?.user.id!;

  const groups = await service.getGroupsByOwnerId(ownerId);

  return groups.map(GroupViewModel.toObject);
}
