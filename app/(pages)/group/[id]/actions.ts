'use server';

import makeGroupService from "@/app/application/group/factories/makeGroupService";
import { GroupViewModel } from "@/app/application/group/view-models/GroupViewModel";

const service = makeGroupService();

export async function getGroupDetails(groupId: string) {
  const group = await service.getGroupDetails(groupId);

  return group ? GroupViewModel.toObject(group) : null;
}