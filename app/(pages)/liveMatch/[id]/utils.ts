import { MatchViewModelType } from "@/app/application/matches/view-models/types";

import { TeamId } from "./types";
import { StatTypeEnum } from "@/app/domain/matches/enum/Stats";

const opponentTeamMap: Record<TeamId, TeamId> = {
  teamA: 'teamB',
  teamB: 'teamA',
};

export const countGoalsFromTeam = (team: TeamId, currentMatch: MatchViewModelType | null) => {
  if (!currentMatch) return 0;

  const goalTypes = [
    StatTypeEnum.GOAL_FROM_INSIDE_BOX,
    StatTypeEnum.GOAL_FROM_OUTSIDE_BOX,
  ];

  const playersFromTeam = currentMatch[team].players;

  const ownGoals = currentMatch.stats.filter(stat =>
    stat.type === StatTypeEnum.OWN_GOAL &&
    currentMatch[opponentTeamMap[team]].players.some(player => player.id === stat.playerId)
  ).length;

  const goals = currentMatch.stats.filter(stat =>
    goalTypes.includes(stat.type) && playersFromTeam.some(player => player.id === stat.playerId)
  ).length;

  return goals + ownGoals;
};

export const getTeamPlayers = (team: TeamId, currentMatch: MatchViewModelType | null) => {
  if (!currentMatch) return [];

  return currentMatch[team].players;
};

export const getPlayerStats = (playerId: string, currentMatch: MatchViewModelType | null) => {
  if (!currentMatch) return [];

  return currentMatch.stats.filter(stat => stat.playerId === playerId);
};

export const statCategories = [
  { id: 'goal', label: '⚽ Gol' },
  { id: 'shot', label: '🥅 Finalização' },
  { id: 'pass', label: '🎯 Passe' },
  { id: 'dribble', label: '🏃 Drible' },
  { id: 'defense', label: '🛡️ Defesa' },
  // { id: 'goalkeeper', label: '🧤 Goleiro' },
] as const;

export type StatCategoryTagType = typeof statCategories[number]['id'];

