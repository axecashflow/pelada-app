import { MatchRepository } from '@/app/domain/matches/repositories/MatchRepository';
import { Match } from '@/app/domain/matches/aggregates/Match';
import { Team } from '@/app/domain/matches/aggregates/Team';
import { Player } from '@/app/domain/matches/entities/Player';
import { MatchId } from '@/app/domain/matches/value-objects/MatchId';
import { TeamId } from '@/app/domain/matches/value-objects/TeamId';
import { PlayerId } from '@/app/domain/matches/value-objects/PlayerId';
import { GroupId } from '@/app/domain/group/value-objects/GroupId';
import { StatTypeEnum } from '@/app/domain/matches/enum/Stats';
import { PlayerPosition } from '@/app/domain/matches/enum/Player';
import { DomainError } from '@/app/domain/shared/DomainError';

type PlayerInput = {
  id: string;
  name: string;
};

type CreateMatchInput = {
  id: string;
  groupId: string;
  teamA: {
    id: string;
    players: PlayerInput[];
  };
  teamB: {
    id: string;
    players: PlayerInput[];
  };
};

type RecordEventInput = {
  matchId: string;
  playerId: string;
  statType: StatTypeEnum;
  opponentPlayerId?: string;
  playerPosition?: PlayerPosition;
};

export class MatchService {
  constructor(private readonly matchRepository: MatchRepository) { }

  async createMatch(input: CreateMatchInput): Promise<void> {
    const teamA = Team.create(TeamId.create(input.teamA.id));
    const teamB = Team.create(TeamId.create(input.teamB.id));

    input.teamA.players.forEach((playerData) => {
      const player = Player.create(
        PlayerId.create(playerData.id),
        playerData.name
      );
      teamA.addPlayer(player);
    });

    input.teamB.players.forEach((playerData) => {
      const player = Player.create(
        PlayerId.create(playerData.id),
        playerData.name
      );
      teamB.addPlayer(player);
    });

    const match = Match.create(
      MatchId.create(input.id),
      GroupId.create(input.groupId),
      teamA,
      teamB
    );

    await this.matchRepository.save(match);
  }

  async getMatchById(id: string): Promise<Match | null> {
    return await this.matchRepository.findById(id);
  }

  async getMatchesFromDate(groupId: string, date: Date): Promise<Match[]> {
    return await this.matchRepository.findByDate(date, groupId);
  }

  async recordEvent(input: RecordEventInput): Promise<void> {
    const match = await this.matchRepository.findById(input.matchId);

    if (!match) {
      throw new DomainError('MatchNotFound');
    }

    const playerId = PlayerId.create(input.playerId);
    const opponentPlayerId = input.opponentPlayerId
      ? PlayerId.create(input.opponentPlayerId)
      : undefined;

    match.recordEvent(
      playerId,
      input.statType,
      opponentPlayerId,
      input.playerPosition
    );

    await this.matchRepository.save(match);
  }

  async recordEvents(events: RecordEventInput[]): Promise<void> {
    if (events.length === 0) {
      return;
    }

    const matchId = events[0].matchId;
    const match = await this.matchRepository.findById(matchId);

    if (!match) {
      throw new DomainError('MatchNotFound');
    }

    for (const event of events) {
      const playerId = PlayerId.create(event.playerId);
      const opponentPlayerId = event.opponentPlayerId
        ? PlayerId.create(event.opponentPlayerId)
        : undefined;

      match.recordEvent(
        playerId,
        event.statType,
        opponentPlayerId,
        event.playerPosition
      );
    }

    await this.matchRepository.save(match);
  }
}
