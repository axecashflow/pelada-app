'use server';

import makeMatchService from "@/app/application/matches/factories/makeMatchService";
import { MatchViewModel } from "@/app/application/matches/view-models/MatchViewModel";
import { RecordEventInputType } from "./types";

const matchService = makeMatchService();

export async function getMatchById(id: string) {
  const match = await matchService.getMatchById(id);

  return match ? MatchViewModel.toObject(match) : null;
}

export async function recordMatchEvents(events: RecordEventInputType[]) {
  await matchService.recordEvents(events);
}
