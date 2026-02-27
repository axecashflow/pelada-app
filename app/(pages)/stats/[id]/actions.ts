'use server';

import makeMatchService from "@/app/application/matches/factories/makeMatchService";
import { MatchViewModel } from "@/app/application/matches/view-models/MatchViewModel";

const matchService = makeMatchService();

export async function getDayMatches(groupsId: string, date: Date) {
  const matches = await matchService.getMatchesFromDate(groupsId, date);

  return matches.map(MatchViewModel.toObject);
} 
