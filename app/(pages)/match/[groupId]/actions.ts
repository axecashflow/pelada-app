'use server';

import makeGroupService from "@/app/application/group/factories/makeGroupService";
import { GroupViewModel } from "@/app/application/group/view-models/GroupViewModel";
import makeMatchService from "@/app/application/matches/factories/makeMatchService";
import { ColumnId, PlayerItem } from "./types";

const groupService = makeGroupService();
const matchService = makeMatchService();

export async function getGroupDetails(groupId: string) {
  const group = await groupService.getGroupDetails(groupId);

  return group ? GroupViewModel.toObject(group) : null;
}

export async function createMatch(groupId: string, columns: Record<ColumnId, PlayerItem[]>) {
  const matchId = crypto.randomUUID();

  const teamAId = crypto.randomUUID();
  const teamBId = crypto.randomUUID();

  await matchService.createMatch({
    id: matchId,
    groupId,
    teamA: {
      id: teamAId,
      players: columns.teamA,
    },
    teamB: {
      id: teamBId,
      players: columns.teamB,
    }
  });

  return matchId;
}