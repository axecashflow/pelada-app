import { DrizzleMatchRepository } from './DrizzleMatchRepository';
import { Match } from '@/app/domain/matches/aggregates/Match';
import { Team } from '@/app/domain/matches/aggregates/Team';
import { Player } from '@/app/domain/matches/entities/Player';
import { MatchId } from '@/app/domain/matches/value-objects/MatchId';
import { TeamId } from '@/app/domain/matches/value-objects/TeamId';
import { PlayerId } from '@/app/domain/matches/value-objects/PlayerId';
import { GroupId } from '@/app/domain/group/value-objects/GroupId';
import { MatchMapper } from './mappers/MatchMapper';
import { db } from '@/app/infrastructure/db/connection';

const txMock = {
  insert: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  onConflictDoUpdate: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
};

const selectMock = {
  from: jest.fn().mockReturnThis(),
  where: jest.fn(),
};

jest.mock('@/app/infrastructure/db/connection', () => ({
  db: {
    transaction: jest.fn(),
    select: jest.fn(),
  },
}));

jest.mock('./mappers/MatchMapper', () => ({
  MatchMapper: {
    toPersistence: jest.fn(),
    toDomain: jest.fn(),
  },
}));

describe('DrizzleMatchRepository (unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (db.transaction as jest.Mock).mockImplementation(async (cb) => cb(txMock));
    (db.select as jest.Mock).mockReturnValue(selectMock);
  });

  describe('save', () => {
    it('should save a match using transaction', async () => {
      const repository = new DrizzleMatchRepository();
      const matchId = MatchId.create('match-1');
      const groupId = GroupId.create('group-1');
      const teamA = Team.create(TeamId.create('team-a'));
      const teamB = Team.create(TeamId.create('team-b'));
      const match = Match.create(matchId, groupId, teamA, teamB);

      const persistenceMock = {
        match: {
          id: 'match-1',
          groupId: 'group-1',
          matchDate: new Date(),
          createdAt: new Date(),
        },
        teams: [
          { id: 'team-a', matchId: 'match-1', teamType: 'A' },
          { id: 'team-b', matchId: 'match-1', teamType: 'B' },
        ],
        players: [],
        stats: [],
      };

      (MatchMapper.toPersistence as jest.Mock).mockReturnValue(persistenceMock);

      await repository.save(match);

      expect(db.transaction).toHaveBeenCalledTimes(1);
      expect(MatchMapper.toPersistence).toHaveBeenCalledWith(match);
      expect(txMock.insert).toHaveBeenCalled();
      expect(txMock.delete).toHaveBeenCalled();
    });

    it('should save match with players and stats', async () => {
      const repository = new DrizzleMatchRepository();
      const matchId = MatchId.create('match-1');
      const groupId = GroupId.create('group-1');
      const teamA = Team.create(TeamId.create('team-a'));
      const teamB = Team.create(TeamId.create('team-b'));
      
      const player1 = Player.create(PlayerId.create('player-1'), 'Player 1');
      teamA.addPlayer(player1);

      const match = Match.create(matchId, groupId, teamA, teamB);

      const persistenceMock = {
        match: {
          id: 'match-1',
          groupId: 'group-1',
          matchDate: new Date(),
          createdAt: new Date(),
        },
        teams: [
          { id: 'team-a', matchId: 'match-1', teamType: 'A' },
          { id: 'team-b', matchId: 'match-1', teamType: 'B' },
        ],
        players: [
          {
            id: 'player-1',
            teamId: 'team-a',
            name: 'Player 1',
            position: null,
            presence: 'STARTER',
            rating: '6',
          },
        ],
        stats: [],
      };

      (MatchMapper.toPersistence as jest.Mock).mockReturnValue(persistenceMock);

      await repository.save(match);

      expect(db.transaction).toHaveBeenCalledTimes(1);
      expect(txMock.insert).toHaveBeenCalled();
    });
  });

  describe('findByDate', () => {
    it('should return empty array when no matches found', async () => {
      const repository = new DrizzleMatchRepository();
      const date = new Date('2026-02-25');
      const groupId = 'group-1';

      selectMock.where.mockResolvedValue([]);

      const result = await repository.findByDate(date, groupId);

      expect(result).toEqual([]);
      expect(db.select).toHaveBeenCalled();
    });

    it('should return matches for a specific date', async () => {
      const repository = new DrizzleMatchRepository();
      const date = new Date('2026-02-25');
      const groupId = 'group-1';

      const matchRows = [
        {
          id: 'match-1',
          groupId: 'group-1',
          matchDate: new Date('2026-02-25T10:00:00'),
          createdAt: new Date(),
        },
      ];

      const teamRows = [
        { id: 'team-a', matchId: 'match-1', teamType: 'A' },
        { id: 'team-b', matchId: 'match-1', teamType: 'B' },
      ];

      const playerRows: any[] = [];
      const statRows: any[] = [];

      selectMock.where
        .mockResolvedValueOnce(matchRows)
        .mockResolvedValueOnce(teamRows)
        .mockResolvedValueOnce(playerRows)
        .mockResolvedValueOnce(statRows);

      const matchMock = {} as Match;
      (MatchMapper.toDomain as jest.Mock).mockReturnValue(matchMock);

      const result = await repository.findByDate(date, groupId);

      expect(result).toHaveLength(1);
      expect(db.select).toHaveBeenCalled();
      expect(MatchMapper.toDomain).toHaveBeenCalled();
    });

    it('should filter matches by date range', async () => {
      const repository = new DrizzleMatchRepository();
      const date = new Date('2026-02-25');
      const groupId = 'group-1';

      selectMock.where.mockResolvedValue([]);

      await repository.findByDate(date, groupId);

      expect(selectMock.where).toHaveBeenCalled();
    });
  });
});
