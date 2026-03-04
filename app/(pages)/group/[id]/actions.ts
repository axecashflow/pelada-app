"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import makeGroupService from "@/app/application/group/factories/makeGroupService";
import { GroupViewModel } from "@/app/application/group/view-models/GroupViewModel";
import makeMatchService from "@/app/application/matches/factories/makeMatchService";
import { MatchViewModel } from "@/app/application/matches/view-models/MatchViewModel";

const service = makeGroupService();
const matchService = makeMatchService();

export async function getGroupDetails(groupId: string) {
  const group = await service.getGroupDetails(groupId);

  return group ? GroupViewModel.toObject(group) : null;
}

export async function findLiveMatch(groupId: string) {
  const match = await matchService.findLiveMatch(groupId);

  return match ? MatchViewModel.toObject(match) : null;
}

export async function linkUser(memberId: string, groupId: string) {
  const session = await getServerSession(authOptions);

  await service.linkMemberToUser(session?.user.id!, memberId, groupId);
}
