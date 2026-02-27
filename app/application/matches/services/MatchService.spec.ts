import { MatchService } from './MatchService';
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

describe('MatchService', () => {
  let matchService: MatchService;
  let mockMatchRepository: jest.Mocked<MatchRepository>;

  beforeEach(() => {
    mockMatchRepository = {
      save: jest.fn(),
      findByDate: jest.fn(),
      findById: jest.fn(),
    } as any;

    matchService = new MatchService(mockMatchRepository);
  });

  describe('createMatch', () => {
    it('should create and save a match with both teams and players', async () => {
      const input = {
        id: 'match-1',
        groupId: 'group-1',
        teamA: {
          id: 'team-a',
          players: [
            { id: 'player-1', name: 'Player 1' },
            { id: 'player-2', name: 'Player 2' },
          ],
        },
        teamB: {
          id: 'team-b',
          players: [
            { id: 'player-3', name: 'Player 3' },
            { id: 'player-4', name: 'Player 4' },
          ],
        },
      };

      await matchService.createMatch(input);

      expect(mockMatchRepository.save).toHaveBeenCalledTimes(1);
      const savedMatch = mockMatchRepository.save.mock.calls[0][0];
      expect(savedMatch).toBeInstanceOf(Match);
      expect(savedMatch.id.value).toBe(input.id);
      expect(savedMatch.groupId.value).toBe(input.groupId);
      expect(savedMatch.teamA.id.value).toBe(input.teamA.id);
      expect(savedMatch.teamB.id.value).toBe(input.teamB.id);
      expect(savedMatch.teamA.players).toHaveLength(2);
      expect(savedMatch.teamB.players).toHaveLength(2);
      expect(savedMatch.teamA.players[0].name).toBe('Player 1');
      expect(savedMatch.teamB.players[0].name).toBe('Player 3');
    });

    it('should create match with empty teams', async () => {
      const input = {
        id: 'match-1',
        groupId: 'group-1',
        teamA: {
          id: 'team-a',
          players: [],
        },
        teamB: {
          id: 'team-b',
          players: [],
        },
      };

      await matchService.createMatch(input);

      expect(mockMatchRepository.save).toHaveBeenCalledTimes(1);
      const savedMatch = mockMatchRepository.save.mock.calls[0][0];
      expect(savedMatch.teamA.players).toHaveLength(0);
      expect(savedMatch.teamB.players).toHaveLength(0);
    });

    it('should create match with different number of players per team', async () => {
      const input = {
        id: 'match-1',
        groupId: 'group-1',
        teamA: {
          id: 'team-a',
          players: [
            { id: 'player-1', name: 'Player 1' },
          ],
        },
        teamB: {
          id: 'team-b',
          players: [
            { id: 'player-2', name: 'Player 2' },
            { id: 'player-3', name: 'Player 3' },
            { id: 'player-4', name: 'Player 4' },
          ],
        },
      };

      await matchService.createMatch(input);

      expect(mockMatchRepository.save).toHaveBeenCalledTimes(1);
      const savedMatch = mockMatchRepository.save.mock.calls[0][0];
      expect(savedMatch.teamA.players).toHaveLength(1);
      expect(savedMatch.teamB.players).toHaveLength(3);
    });

    it('should create match with single player in each team', async () => {
      const input = {
        id: 'match-1',
        groupId: 'group-1',
        teamA: {
          id: 'team-a',
          players: [{ id: 'player-1', name: 'Solo Player A' }],
        },
        teamB: {
          id: 'team-b',
          players: [{ id: 'player-2', name: 'Solo Player B' }],
        },
      };

      await matchService.createMatch(input);

      expect(mockMatchRepository.save).toHaveBeenCalledTimes(1);
      const savedMatch = mockMatchRepository.save.mock.calls[0][0];
      expect(savedMatch.teamA.players[0].name).toBe('Solo Player A');
      expect(savedMatch.teamB.players[0].name).toBe('Solo Player B');
    });

    it('should initialize match with empty stats array', async () => {
      const input = {
        id: 'match-1',
        groupId: 'group-1',
        teamA: {
          id: 'team-a',
          players: [{ id: 'player-1', name: 'Player 1' }],
        },
        teamB: {
          id: 'team-b',
          players: [{ id: 'player-2', name: 'Player 2' }],
        },
      };

      await matchService.createMatch(input);

      const savedMatch = mockMatchRepository.save.mock.calls[0][0];
      expect(savedMatch.stats).toHaveLength(0);
    });

    it('should preserve player IDs when creating match', async () => {
      const input = {
        id: 'match-1',
        groupId: 'group-1',
        teamA: {
          id: 'team-a',
          players: [
            { id: 'custom-id-1', name: 'Player 1' },
            { id: 'custom-id-2', name: 'Player 2' },
          ],
        },
        teamB: {
          id: 'team-b',
          players: [
            { id: 'custom-id-3', name: 'Player 3' },
          ],
        },
      };

      await matchService.createMatch(input);

      const savedMatch = mockMatchRepository.save.mock.calls[0][0];
      expect(savedMatch.teamA.players[0].id.value).toBe('custom-id-1');
      expect(savedMatch.teamA.players[1].id.value).toBe('custom-id-2');
      expect(savedMatch.teamB.players[0].id.value).toBe('custom-id-3');
    });
  });

  describe('recordEvent', () => {
    it('should record a goal event successfully', async () => {
      const teamA = Team.create(TeamId.create('team-a'));
      const player1 = Player.create(PlayerId.create('player-1'), 'Player 1');
      teamA.addPlayer(player1);

      const teamB = Team.create(TeamId.create('team-b'));
      const player2 = Player.create(PlayerId.create('player-2'), 'Player 2');
      teamB.addPlayer(player2);

      const mockMatch = Match.create(
        MatchId.create('match-1'),
        GroupId.create('group-1'),
        teamA,
        teamB
      );

      mockMatchRepository.findById.mockResolvedValue(mockMatch);

      await matchService.recordEvent({
        matchId: 'match-1',
        playerId: 'player-1',
        statType: StatTypeEnum.GOAL_FROM_INSIDE_BOX,
        playerPosition: PlayerPosition.FORWARD,
      });

      expect(mockMatchRepository.findById).toHaveBeenCalledWith('match-1');
      expect(mockMatchRepository.save).toHaveBeenCalledTimes(1);
      expect(mockMatchRepository.save).toHaveBeenCalledWith(mockMatch);
    });

    it('should record an assist with scorer', async () => {
      const teamA = Team.create(TeamId.create('team-a'));
      const scorer = Player.create(PlayerId.create('player-1'), 'Scorer');
      const assister = Player.create(PlayerId.create('player-2'), 'Assister');
      teamA.addPlayer(scorer);
      teamA.addPlayer(assister);

      const teamB = Team.create(TeamId.create('team-b'));
      const opponent = Player.create(PlayerId.create('player-3'), 'Opponent');
      teamB.addPlayer(opponent);

      const mockMatch = Match.create(
        MatchId.create('match-1'),
        GroupId.create('group-1'),
        teamA,
        teamB
      );

      mockMatchRepository.findById.mockResolvedValue(mockMatch);

      await matchService.recordEvent({
        matchId: 'match-1',
        playerId: 'player-2',
        statType: StatTypeEnum.ASSIST,
        opponentPlayerId: 'player-1',
        playerPosition: PlayerPosition.MIDFIELDER,
      });

      expect(mockMatchRepository.findById).toHaveBeenCalledWith('match-1');
      expect(mockMatchRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should record a tackle event', async () => {
      const teamA = Team.create(TeamId.create('team-a'));
      const defender = Player.create(PlayerId.create('player-1'), 'Defender');
      teamA.addPlayer(defender);

      const teamB = Team.create(TeamId.create('team-b'));
      const attacker = Player.create(PlayerId.create('player-2'), 'Attacker');
      teamB.addPlayer(attacker);

      const mockMatch = Match.create(
        MatchId.create('match-1'),
        GroupId.create('group-1'),
        teamA,
        teamB
      );

      mockMatchRepository.findById.mockResolvedValue(mockMatch);

      await matchService.recordEvent({
        matchId: 'match-1',
        playerId: 'player-1',
        statType: StatTypeEnum.TACKLE,
        opponentPlayerId: 'player-2',
        playerPosition: PlayerPosition.DEFENDER,
      });

      expect(mockMatchRepository.findById).toHaveBeenCalledWith('match-1');
      expect(mockMatchRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should record a save event for goalkeeper', async () => {
      const teamA = Team.create(TeamId.create('team-a'));
      const goalkeeper = Player.create(PlayerId.create('player-1'), 'Goalkeeper');
      teamA.addPlayer(goalkeeper);

      const teamB = Team.create(TeamId.create('team-b'));
      const shooter = Player.create(PlayerId.create('player-2'), 'Shooter');
      teamB.addPlayer(shooter);

      const mockMatch = Match.create(
        MatchId.create('match-1'),
        GroupId.create('group-1'),
        teamA,
        teamB
      );

      mockMatchRepository.findById.mockResolvedValue(mockMatch);

      await matchService.recordEvent({
        matchId: 'match-1',
        playerId: 'player-1',
        statType: StatTypeEnum.SAVE,
        opponentPlayerId: 'player-2',
        playerPosition: PlayerPosition.GOALKEEPER,
      });

      expect(mockMatchRepository.findById).toHaveBeenCalledWith('match-1');
      expect(mockMatchRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw error when match is not found', async () => {
      mockMatchRepository.findById.mockResolvedValue(null);

      await expect(
        matchService.recordEvent({
          matchId: 'non-existent',
          playerId: 'player-1',
          statType: StatTypeEnum.GOAL_FROM_INSIDE_BOX,
          playerPosition: PlayerPosition.FORWARD,
        })
      ).rejects.toThrow(DomainError);

      await expect(
        matchService.recordEvent({
          matchId: 'non-existent',
          playerId: 'player-1',
          statType: StatTypeEnum.GOAL_FROM_INSIDE_BOX,
          playerPosition: PlayerPosition.FORWARD,
        })
      ).rejects.toThrow('MatchNotFound');

      expect(mockMatchRepository.save).not.toHaveBeenCalled();
    });

    it('should record event without opponent player', async () => {
      const teamA = Team.create(TeamId.create('team-a'));
      const player1 = Player.create(PlayerId.create('player-1'), 'Player 1');
      teamA.addPlayer(player1);

      const teamB = Team.create(TeamId.create('team-b'));
      const player2 = Player.create(PlayerId.create('player-2'), 'Player 2');
      teamB.addPlayer(player2);

      const mockMatch = Match.create(
        MatchId.create('match-1'),
        GroupId.create('group-1'),
        teamA,
        teamB
      );

      mockMatchRepository.findById.mockResolvedValue(mockMatch);

      await matchService.recordEvent({
        matchId: 'match-1',
        playerId: 'player-1',
        statType: StatTypeEnum.PASS_COMPLETED,
        playerPosition: PlayerPosition.MIDFIELDER,
      });

      expect(mockMatchRepository.findById).toHaveBeenCalledWith('match-1');
      expect(mockMatchRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should record event without player position', async () => {
      const teamA = Team.create(TeamId.create('team-a'));
      const player1 = Player.create(PlayerId.create('player-1'), 'Player 1');
      teamA.addPlayer(player1);

      const teamB = Team.create(TeamId.create('team-b'));
      const player2 = Player.create(PlayerId.create('player-2'), 'Player 2');
      teamB.addPlayer(player2);

      const mockMatch = Match.create(
        MatchId.create('match-1'),
        GroupId.create('group-1'),
        teamA,
        teamB
      );

      mockMatchRepository.findById.mockResolvedValue(mockMatch);

      await matchService.recordEvent({
        matchId: 'match-1',
        playerId: 'player-1',
        statType: StatTypeEnum.GOAL_FROM_INSIDE_BOX,
      });

      expect(mockMatchRepository.findById).toHaveBeenCalledWith('match-1');
      expect(mockMatchRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should record own goal event', async () => {
      const teamA = Team.create(TeamId.create('team-a'));
      const player1 = Player.create(PlayerId.create('player-1'), 'Player 1');
      teamA.addPlayer(player1);

      const teamB = Team.create(TeamId.create('team-b'));
      const player2 = Player.create(PlayerId.create('player-2'), 'Player 2');
      teamB.addPlayer(player2);

      const mockMatch = Match.create(
        MatchId.create('match-1'),
        GroupId.create('group-1'),
        teamA,
        teamB
      );

      mockMatchRepository.findById.mockResolvedValue(mockMatch);

      await matchService.recordEvent({
        matchId: 'match-1',
        playerId: 'player-1',
        statType: StatTypeEnum.OWN_GOAL,
        playerPosition: PlayerPosition.DEFENDER,
      });

      expect(mockMatchRepository.findById).toHaveBeenCalledWith('match-1');
      expect(mockMatchRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('recordEvents', () => {
    it('should record multiple events in a single batch', async () => {
      const teamA = Team.create(TeamId.create('team-a'));
      const scorer = Player.create(PlayerId.create('player-1'), 'Scorer');
      const assister = Player.create(PlayerId.create('player-2'), 'Assister');
      teamA.addPlayer(scorer);
      teamA.addPlayer(assister);

      const teamB = Team.create(TeamId.create('team-b'));
      const opponent = Player.create(PlayerId.create('player-3'), 'Opponent');
      teamB.addPlayer(opponent);

      const mockMatch = Match.create(
        MatchId.create('match-1'),
        GroupId.create('group-1'),
        teamA,
        teamB
      );

      mockMatchRepository.findById.mockResolvedValue(mockMatch);

      await matchService.recordEvents([
        {
          matchId: 'match-1',
          playerId: 'player-1',
          statType: StatTypeEnum.GOAL_FROM_INSIDE_BOX,
          playerPosition: PlayerPosition.FORWARD,
        },
        {
          matchId: 'match-1',
          playerId: 'player-2',
          statType: StatTypeEnum.ASSIST,
          opponentPlayerId: 'player-1',
          playerPosition: PlayerPosition.MIDFIELDER,
        },
      ]);

      expect(mockMatchRepository.findById).toHaveBeenCalledWith('match-1');
      expect(mockMatchRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockMatchRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should handle empty array without errors', async () => {
      await matchService.recordEvents([]);

      expect(mockMatchRepository.findById).not.toHaveBeenCalled();
      expect(mockMatchRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when match is not found for batch events', async () => {
      mockMatchRepository.findById.mockResolvedValue(null);

      await expect(
        matchService.recordEvents([
          {
            matchId: 'non-existent',
            playerId: 'player-1',
            statType: StatTypeEnum.GOAL_FROM_INSIDE_BOX,
            playerPosition: PlayerPosition.FORWARD,
          },
        ])
      ).rejects.toThrow(DomainError);

      expect(mockMatchRepository.save).not.toHaveBeenCalled();
    });

    it('should record goal with assist and pre-assist', async () => {
      const teamA = Team.create(TeamId.create('team-a'));
      const scorer = Player.create(PlayerId.create('player-1'), 'Scorer');
      const assister = Player.create(PlayerId.create('player-2'), 'Assister');
      const preAssister = Player.create(PlayerId.create('player-3'), 'Pre-Assister');
      teamA.addPlayer(scorer);
      teamA.addPlayer(assister);
      teamA.addPlayer(preAssister);

      const teamB = Team.create(TeamId.create('team-b'));
      const opponent = Player.create(PlayerId.create('player-4'), 'Opponent');
      teamB.addPlayer(opponent);

      const mockMatch = Match.create(
        MatchId.create('match-1'),
        GroupId.create('group-1'),
        teamA,
        teamB
      );

      mockMatchRepository.findById.mockResolvedValue(mockMatch);

      await matchService.recordEvents([
        {
          matchId: 'match-1',
          playerId: 'player-1',
          statType: StatTypeEnum.GOAL_FROM_OUTSIDE_BOX,
          playerPosition: PlayerPosition.FORWARD,
        },
        {
          matchId: 'match-1',
          playerId: 'player-2',
          statType: StatTypeEnum.ASSIST,
          opponentPlayerId: 'player-1',
          playerPosition: PlayerPosition.MIDFIELDER,
        },
        {
          matchId: 'match-1',
          playerId: 'player-3',
          statType: StatTypeEnum.PRE_ASSIST,
          opponentPlayerId: 'player-2',
          playerPosition: PlayerPosition.MIDFIELDER,
        },
      ]);

      expect(mockMatchRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockMatchRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should record multiple different event types', async () => {
      const teamA = Team.create(TeamId.create('team-a'));
      const player1 = Player.create(PlayerId.create('player-1'), 'Player 1');
      const player2 = Player.create(PlayerId.create('player-2'), 'Player 2');
      teamA.addPlayer(player1);
      teamA.addPlayer(player2);

      const teamB = Team.create(TeamId.create('team-b'));
      const player3 = Player.create(PlayerId.create('player-3'), 'Player 3');
      teamB.addPlayer(player3);

      const mockMatch = Match.create(
        MatchId.create('match-1'),
        GroupId.create('group-1'),
        teamA,
        teamB
      );

      mockMatchRepository.findById.mockResolvedValue(mockMatch);

      await matchService.recordEvents([
        {
          matchId: 'match-1',
          playerId: 'player-1',
          statType: StatTypeEnum.GOAL_FROM_INSIDE_BOX,
          playerPosition: PlayerPosition.FORWARD,
        },
        {
          matchId: 'match-1',
          playerId: 'player-2',
          statType: StatTypeEnum.TACKLE,
          opponentPlayerId: 'player-3',
          playerPosition: PlayerPosition.DEFENDER,
        },
        {
          matchId: 'match-1',
          playerId: 'player-1',
          statType: StatTypeEnum.PASS_COMPLETED,
          playerPosition: PlayerPosition.FORWARD,
        },
      ]);

      expect(mockMatchRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockMatchRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});
