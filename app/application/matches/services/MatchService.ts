import { MatchRepository } from "@/app/domain/matches/repositories/MatchRepository";
import { Match } from "@/app/domain/matches/aggregates/Match";
import { Team } from "@/app/domain/matches/aggregates/Team";
import { Player } from "@/app/domain/matches/entities/Player";
import { MatchId } from "@/app/domain/matches/value-objects/MatchId";
import { TeamId } from "@/app/domain/matches/value-objects/TeamId";
import { PlayerId } from "@/app/domain/matches/value-objects/PlayerId";
import { GroupId } from "@/app/domain/group/value-objects/GroupId";
import { StatTypeEnum } from "@/app/domain/matches/enum/Stats";
import { PlayerPosition } from "@/app/domain/matches/enum/Player";
import { DomainError } from "@/app/domain/shared/DomainError";
import { PlayerViewModelType } from "../view-models/types";
import { MatchStatusEnum } from "@/app/domain/matches/enum/Match";
import { DomainEventDispatcher } from "@/app/domain/shared/DomainEventDispatcher";

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
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly domainEventDispatcher: DomainEventDispatcher,
  ) {}

  async createMatch(input: CreateMatchInput): Promise<void> {
    const existingLive = await this.matchRepository.findLiveMatch(
      input.groupId,
    );

    if (existingLive) {
      existingLive.changeStatus(MatchStatusEnum.FINISHED);
      await this.matchRepository.save(existingLive);
    }

    const teamA = Team.create(TeamId.create(input.teamA.id));
    const teamB = Team.create(TeamId.create(input.teamB.id));

    const match = Match.create(
      MatchId.create(input.id),
      GroupId.create(input.groupId),
      teamA,
      teamB,
    );

    input.teamA.players.forEach((playerData) => {
      const player = Player.create(
        PlayerId.create(playerData.id),
        playerData.name,
      );

      match.addPlayerToTeamA(player);
    });

    input.teamB.players.forEach((playerData) => {
      const player = Player.create(
        PlayerId.create(playerData.id),
        playerData.name,
      );

      match.addPlayerToTeamB(player);
    });

    await this.matchRepository.save(match);

    const domainEvents = match.pullDomainEvents();
    await this.domainEventDispatcher.dispatch(domainEvents);
  }

  async getMatchById(id: string): Promise<Match | null> {
    return await this.matchRepository.findById(id);
  }

  async getMatchesFromDate(groupId: string, date: Date): Promise<Match[]> {
    return await this.matchRepository.findByDate(date, groupId);
  }

  async updateMatchStatus(
    matchId: string,
    newStatus: MatchStatusEnum,
  ): Promise<void> {
    const match = await this.matchRepository.findById(matchId);

    if (!match) {
      throw new DomainError("MatchNotFound");
    }

    match.changeStatus(newStatus);
    await this.matchRepository.save(match);
  }

  async recordEvent(input: RecordEventInput): Promise<void> {
    const match = await this.matchRepository.findById(input.matchId);

    if (!match) {
      throw new DomainError("MatchNotFound");
    }

    const playerId = PlayerId.create(input.playerId);
    const opponentPlayerId = input.opponentPlayerId
      ? PlayerId.create(input.opponentPlayerId)
      : undefined;

    match.recordEvent(
      playerId,
      input.statType,
      opponentPlayerId,
      input.playerPosition,
    );

    await this.matchRepository.save(match);

    const domainEvents = match.pullDomainEvents();
    await this.domainEventDispatcher.dispatch(domainEvents);
  }

  async recordEvents(events: RecordEventInput[]): Promise<void> {
    if (events.length === 0) {
      return;
    }

    const matchId = events[0].matchId;
    const match = await this.matchRepository.findById(matchId);

    if (!match) {
      throw new DomainError("MatchNotFound");
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
        event.playerPosition,
      );
    }

    await this.matchRepository.save(match);

    const domainEvents = match.pullDomainEvents();
    await this.domainEventDispatcher.dispatch(domainEvents);
  }

  async substitutePlayer(
    matchId: string,
    teamId: string,
    playerOut: PlayerViewModelType,
    playerIn: PlayerViewModelType,
  ): Promise<void> {
    const match = await this.matchRepository.findById(matchId);

    if (!match) {
      throw new DomainError("MatchNotFound");
    }

    const playerInEntity = Player.create(
      PlayerId.create(playerIn.id),
      playerIn.name,
    );

    const playerOutEntity = Player.create(
      PlayerId.create(playerOut.id),
      playerOut.name,
    );

    if (!playerOutEntity || !playerInEntity) {
      throw new DomainError("PlayerNotFoundInTeam");
    }

    if (teamId === "teamA") {
      match.substitutePlayerInTeamA(playerOutEntity, playerInEntity);
    } else {
      match.substitutePlayerInTeamB(playerOutEntity, playerInEntity);
    }

    await this.matchRepository.save(match);

    const domainEvents = match.pullDomainEvents();
    await this.domainEventDispatcher.dispatch(domainEvents);
  }

  async findLiveMatch(groupId: string): Promise<Match | null> {
    return await this.matchRepository.findLiveMatch(groupId);
  }
}
