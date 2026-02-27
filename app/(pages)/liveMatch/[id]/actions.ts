"use server";

import makeMatchService from "@/app/application/matches/factories/makeMatchService";
import { MatchViewModel } from "@/app/application/matches/view-models/MatchViewModel";
import makeGroupService from "@/app/application/group/factories/makeGroupService";
import { GroupViewModel } from "@/app/application/group/view-models/GroupViewModel";

import { RecordEventInputType, SubstitutionFormType } from "./types";

const matchService = makeMatchService();
const groupService = makeGroupService();

export async function getGroupDetails(groupId: string) {
  const group = await groupService.getGroupDetails(groupId);

  return group ? GroupViewModel.toObject(group) : null;
}

export async function getMatchById(id: string) {
  const match = await matchService.getMatchById(id);

  return match ? MatchViewModel.toObject(match) : null;
}

export async function recordMatchEvents(events: RecordEventInputType[]) {
  await matchService.recordEvents(events);
}

export async function substitutePlayer(
  matchId: string,
  input: SubstitutionFormType,
) {
  await matchService.substitutePlayer(
    matchId,
    input.team,
    input.playerOut,
    input.playerIn,
  );
}
