import { MatchViewModelType } from "@/app/application/matches/view-models/types";
import { StatTypeEnum } from "@/app/domain/matches/enum/Stats";

import { TeamId } from "./types";

const opponentTeamMap: Record<TeamId, TeamId> = {
  teamA: "teamB",
  teamB: "teamA",
};

export const countGoalsFromTeam = (
  team: TeamId,
  currentMatch: MatchViewModelType | null,
) => {
  if (!currentMatch) return 0;

  const goalTypes = [
    StatTypeEnum.GOAL_FROM_INSIDE_BOX,
    StatTypeEnum.GOAL_FROM_OUTSIDE_BOX,
  ];

  const playersFromTeam = currentMatch[team].players;

  const ownGoals = currentMatch.stats.filter(
    (stat) =>
      stat.type === StatTypeEnum.OWN_GOAL &&
      currentMatch[opponentTeamMap[team]].players.some(
        (player) => player.id === stat.playerId,
      ),
  ).length;

  const goals = currentMatch.stats.filter(
    (stat) =>
      goalTypes.includes(stat.type) &&
      playersFromTeam.some((player) => player.id === stat.playerId),
  ).length;

  return goals + ownGoals;
};

export const countGoalsFromPlayer = (
  playerId: string,
  currentMatch: MatchViewModelType | null,
) => {
  if (!currentMatch) return 0;

  const goalTypes = [
    StatTypeEnum.GOAL_FROM_INSIDE_BOX,
    StatTypeEnum.GOAL_FROM_OUTSIDE_BOX,
    StatTypeEnum.FREE_KICK_SCORED,
    StatTypeEnum.PENALTY_SCORED,
  ];

  const goals = currentMatch.stats.filter(
    (stat) => goalTypes.includes(stat.type) && stat.playerId === playerId,
  ).length;

  return goals;
};

export const countAssistsFromPlayer = (
  playerId: string,
  currentMatch: MatchViewModelType | null,
) => {
  if (!currentMatch) return 0;

  const assistTypes = [StatTypeEnum.ASSIST];

  const assists = currentMatch.stats.filter(
    (stat) => assistTypes.includes(stat.type) && stat.playerId === playerId,
  ).length;

  return assists;
};

export const countPreAssistsFromPlayer = (
  playerId: string,
  currentMatch: MatchViewModelType | null,
) => {
  if (!currentMatch) return 0;

  const preAssistTypes = [StatTypeEnum.PRE_ASSIST];

  const preAssists = currentMatch.stats.filter(
    (stat) => preAssistTypes.includes(stat.type) && stat.playerId === playerId,
  ).length;

  return preAssists;
};

export type PlayerStats = {
  playerId: string;
  playerName: string;
  goals: number;
  assists: number;
  tackles: number;
  dribblesAttempted: number;
  dribblesSuccessful: number;
  dribbleSuccessRate: number;
  totalRating: number;
  matchesPlayed: number;
  avgRating: number;
  goalParticipations: number;
};

export function calculatePlayerStats(
  matches: MatchViewModelType[],
): PlayerStats[] {
  const playerStatsMap = new Map<string, PlayerStats>();

  matches.forEach((match) => {
    [match.teamA, match.teamB].forEach((team) => {
      team.players.forEach((player) => {
        const playerId = player.id;

        if (!playerStatsMap.has(playerId)) {
          playerStatsMap.set(playerId, {
            playerId,
            playerName: player.name,
            goals: 0,
            assists: 0,
            tackles: 0,
            dribblesAttempted: 0,
            dribblesSuccessful: 0,
            dribbleSuccessRate: 0,
            totalRating: 0,
            matchesPlayed: 0,
            avgRating: 0,
            goalParticipations: 0,
          });
        }

        const stats = playerStatsMap.get(playerId)!;

        const playerStats = match.stats.filter((s) => s.playerId === playerId);

        playerStats.forEach((stat) => {
          switch (stat.type) {
            case StatTypeEnum.GOAL_FROM_INSIDE_BOX:
            case StatTypeEnum.GOAL_FROM_OUTSIDE_BOX:
            case StatTypeEnum.FREE_KICK_SCORED:
            case StatTypeEnum.PENALTY_SCORED:
              stats.goals += 1;
              break;

            case StatTypeEnum.ASSIST:
              stats.assists += 1;
              break;

            case StatTypeEnum.TACKLE:
            case StatTypeEnum.BALL_RECOVERY:
            case StatTypeEnum.CLEARANCE:
              stats.tackles += 1;
              break;

            case StatTypeEnum.DRIBBLE_SUCCESS:
            case StatTypeEnum.NUTMEG:
            case StatTypeEnum.LOB:
              stats.dribblesSuccessful += 1;
              stats.dribblesAttempted += 1;
              break;

            case StatTypeEnum.DRIBBLE_FAILED:
              stats.dribblesAttempted += 1;
              break;
          }
        });

        stats.totalRating +=
          typeof player.rating === "string"
            ? parseFloat(player.rating)
            : player.rating;

        stats.dribbleSuccessRate =
          stats.dribblesAttempted > 0
            ? Math.round(
                (stats.dribblesSuccessful / stats.dribblesAttempted) * 100,
              )
            : 0;
        stats.matchesPlayed += 1;
        stats.avgRating = stats.totalRating / stats.matchesPlayed;
        stats.goalParticipations = stats.goals + stats.assists;
      });
    });
  });

  return Array.from(playerStatsMap.values());
}

export function getTopScorer(playerStats: PlayerStats[]): PlayerStats | null {
  if (playerStats.length === 0) return null;
  const filtered = playerStats.filter((p) => p.goals > 0);
  if (filtered.length === 0) return null;
  return filtered.reduce((prev, current) =>
    current.goals > prev.goals ? current : prev,
  );
}

export function getTopAssister(playerStats: PlayerStats[]): PlayerStats | null {
  if (playerStats.length === 0) return null;
  const filtered = playerStats.filter((p) => p.assists > 0);
  if (filtered.length === 0) return null;
  return filtered.reduce((prev, current) =>
    current.assists > prev.assists ? current : prev,
  );
}

export function getTopDefender(playerStats: PlayerStats[]): PlayerStats | null {
  if (playerStats.length === 0) return null;
  const filtered = playerStats.filter((p) => p.tackles > 0);
  if (filtered.length === 0) return null;
  return filtered.reduce((prev, current) =>
    current.tackles > prev.tackles ? current : prev,
  );
}

export function getMostGoalParticipations(
  playerStats: PlayerStats[],
): PlayerStats | null {
  if (playerStats.length === 0) return null;
  const filtered = playerStats.filter((p) => p.goalParticipations > 0);
  if (filtered.length === 0) return null;
  return filtered.reduce((prev, current) =>
    current.goalParticipations > prev.goalParticipations ? current : prev,
  );
}

export function getTopDribbler(playerStats: PlayerStats[]): PlayerStats | null {
  if (playerStats.length === 0) return null;
  const filtered = playerStats.filter((p) => p.dribbleSuccessRate > 0);
  if (filtered.length === 0) return null;
  return filtered.reduce((prev, current) =>
    current.dribbleSuccessRate > prev.dribbleSuccessRate ? current : prev,
  );
}

export function getBestAvgRating(
  playerStats: PlayerStats[],
): PlayerStats | null {
  if (playerStats.length === 0) return null;
  return playerStats.reduce((prev, current) =>
    current.avgRating > prev.avgRating ? current : prev,
  );
}
