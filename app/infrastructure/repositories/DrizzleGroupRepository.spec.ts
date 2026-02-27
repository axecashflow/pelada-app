import { Group } from '@/app/domain/group/aggregates/Group';
import { DrizzleGroupRepository } from './DrizzleGroupRepository';
import { GroupMapper } from './mappers/GroupMapper';
import { db } from '@/app/infrastructure/db/connection';
import { GameMode } from '@/app/domain/group/value-objects/GameMode';
import { GroupId } from '@/app/domain/group/value-objects/GroupId';
import { GameModeEnum } from '@/app/domain/group/enum/GameMode';

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

jest.mock('./mappers/GroupMapper', () => ({
  GroupMapper: {
    toPersistence: jest.fn(),
    toDomain: jest.fn(),
  },
}));

describe('DrizzleGroupRepository (unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (db.transaction as jest.Mock).mockImplementation(
      async (cb) => cb(txMock),
    );

    (db.select as jest.Mock).mockReturnValue(selectMock);
  });

  it('should save a group using transaction', async () => {
    const repository = new DrizzleGroupRepository();
    const id = GroupId.create('group-1');

    const group = Group.create({
      id,
      name: 'Test Group',
      gameMode: GameMode.create({
        playersPerTeam: 5,
        type: GameModeEnum.FIXED_TEAMS
      }),
      ownerId: 'owner-1',
    });

    (GroupMapper.toPersistence as jest.Mock).mockReturnValue({
      id: id.value,
      name: 'Test Group',
      gameMode: {},
      status: 'ACTIVE',
      createdAt: new Date(),
    });

    await repository.save(group);

    expect(db.transaction).toHaveBeenCalledTimes(1);
    expect(txMock.insert).toHaveBeenCalled();
    expect(txMock.delete).toHaveBeenCalled();
  });

  it('should return null when group is not found', async () => {
    selectMock.where.mockResolvedValueOnce([]);

    const repository = new DrizzleGroupRepository();
    const result = await repository.findById('unknown');

    expect(result).toBeNull();
  });

  it('should map persistence to domain when group is found', async () => {
    selectMock.where
      .mockResolvedValueOnce([
        {
          id: 'group-1',
          name: 'Group',
          gameMode: {},
          status: 'ACTIVE',
          createdAt: new Date(),
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 'member-1',
          name: 'John',
          status: 'ACTIVE',
          groupId: 'group-1',
        },
      ]);

    const domainGroup = { id: 'group-1' };

    (GroupMapper.toDomain as jest.Mock).mockReturnValue(domainGroup);

    const repository = new DrizzleGroupRepository();
    const result = await repository.findById('group-1');

    expect(GroupMapper.toDomain).toHaveBeenCalledTimes(1);
    expect(result).toBe(domainGroup);
  });

  it('should return list of groups mapped to domain when found by ownerId', async () => {
    (db.select as jest.Mock).mockReturnValueOnce({
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValueOnce([
        {
          id: 'group-1',
          name: 'Group 1',
          gameMode: {},
          status: 'ACTIVE',
          createdAt: new Date(),
          ownerId: 'owner-1',
        },
        {
          id: 'group-2',
          name: 'Group 2',
          gameMode: {},
          status: 'ACTIVE',
          createdAt: new Date(),
          ownerId: 'owner-1',
        },
      ]),
    });

    const domainGroup = { id: 'mapped-group' };

    (GroupMapper.toDomain as jest.Mock)
      .mockReturnValue(domainGroup);

    const repository = new DrizzleGroupRepository();

    const result = await repository.findListByOwnerId('owner-1');

    expect(db.select).toHaveBeenCalledTimes(1);
    expect(GroupMapper.toDomain).toHaveBeenCalledTimes(2);
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(domainGroup);
  });

  it('should return empty array when owner has no groups', async () => {
    (db.select as jest.Mock).mockReturnValueOnce({
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValueOnce([]),
    });

    const repository = new DrizzleGroupRepository();

    const result = await repository.findListByOwnerId('owner-1');

    expect(result).toEqual([]);
    expect(GroupMapper.toDomain).not.toHaveBeenCalled();
  });
});
