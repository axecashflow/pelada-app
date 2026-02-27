'use server';

import makeGroupService from "@/app/application/group/factories/makeGroupService";
import { AddMemberToGroupFormType } from "./types";

const service = makeGroupService();

export async function addMemberToGroup(payload: AddMemberToGroupFormType) {
  const memberId = crypto.randomUUID();

  await service.addMemberToGroup({
    groupId: payload.groupId,
    memberId,
    memberName: payload.memberName,
  });
}