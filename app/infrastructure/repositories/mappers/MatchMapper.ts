import { Match } from "@/app/domain/matches/aggregates/Match";
import { Team } from "@/app/domain/matches/aggregates/Team";
import { Player } from "@/app/domain/matches/entities/Player";
import { MatchId } from "@/app/domain/matches/value-objects/MatchId";
import { TeamId } from "@/app/domain/matches/value-objects/TeamId";
import { PlayerId } from "@/app/domain/matches/value-objects/PlayerId";
import { PlayerScore } from "@/app/domain/matches/value-objects/PlayerScore";
import { MatchStat } from "@/app/domain/matches/value-objects/MatchStat";
import { StatWeight } from "@/app/domain/matches/value-objects/StatWeight";
import { GroupId } from "@/app/domain/group/value-objects/GroupId";
import { PlayerPosition, PlayerPresenceInMatch } from "@/app/domain/matches/enum/Player";
import { StatTypeEnum, ImpactEnum } from "@/app/domain/matches/enum/Stats";
import { MatchPersistence, TeamPersistence, MatchPlayerPersistence, MatchStatPersistence } from "../types/MatchPersistence";

export class MatchMapper {
  static toDomain(persistence: MatchPersistence): Match {
    const groupId = GroupId.create(persistence.groupId);
    const matchId = MatchId.create(persistence.id);

    const teamAData = persistence.teams.find(t => t.teamType === 'A');
    const teamBData = persistence.teams.find(t => t.teamType === 'B');

    if (!teamAData || !teamBData) {
      throw new Error('Invalid match data: missing teams');
    }

    const teamA = MatchMapper.teamToDomain(teamAData);
    const teamB = MatchMapper.teamToDomain(teamBData);

    const match = Match.create(matchId, groupId, teamA, teamB);

    persistence.stats.forEach(statData => {
      const stat = MatchStat.create({
        playerId: PlayerId.create(statData.playerId),
        type: statData.type as StatTypeEnum,
        value: parseFloat(statData.value),
        weight: StatWeight.create(parseFloat(statData.weight)),
        impact: parseInt(statData.impact) as ImpactEnum,
      });
      match['props'].stats.push(stat);
    });

    return match;
  }

  private static teamToDomain(teamData: TeamPersistence): Team {
    const team = Team.create(TeamId.create(teamData.id));

    teamData.players.forEach(playerData => {
      const player = Player.create(
        PlayerId.create(playerData.playerId),
        playerData.name,
        playerData.position ? (playerData.position as PlayerPosition) : undefined
      );

      player.updateScore(PlayerScore.create(parseFloat(playerData.rating)));
      player.changePresence(playerData.presence as PlayerPresenceInMatch);

      team.addPlayer(player);
    });

    return team;
  }

  static toPersistence(match: Match): {
    match: { id: string; groupId: string; matchDate: Date; createdAt: Date };
    teams: Array<{ id: string; matchId: string; teamType: string }>;
    players: MatchPlayerPersistence[];
    stats: MatchStatPersistence[];
  } {
    const matchDate = new Date();

    const teams = [
      { id: match.teamA.id.value, matchId: match.id.value, teamType: 'A' },
      { id: match.teamB.id.value, matchId: match.id.value, teamType: 'B' },
    ];

    const players: MatchPlayerPersistence[] = [
      ...match.teamA.players.map((player, index) => ({
        id: crypto.randomUUID(),
        playerId: player.id.value,
        teamId: match.teamA.id.value,
        name: player.name,
        position: player.position || null,
        presence: player.presence,
        rating: player.rating.score.toString(),
      })),
      ...match.teamB.players.map((player, index) => ({
        id: crypto.randomUUID(),
        playerId: player.id.value,
        teamId: match.teamB.id.value,
        name: player.name,
        position: player.position || null,
        presence: player.presence,
        rating: player.rating.score.toString(),
      })),
    ];

    const stats: MatchStatPersistence[] = match.stats.map((stat, index) => ({
      id: `${match.id.value}-stat-${index}`,
      matchId: match.id.value,
      playerId: stat.playerId.value,
      type: stat.type,
      value: '1',
      weight: stat['props'].weight.value.toString(),
      impact: stat['props'].impact.toString(),
    }));

    return {
      match: {
        id: match.id.value,
        groupId: match.groupId.value,
        matchDate,
        createdAt: new Date(),
      },
      teams,
      players,
      stats,
    };
  }
}
