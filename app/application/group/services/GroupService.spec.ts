import { GroupService } from './GroupService';
import { GroupRepository } from '@/app/domain/group/repositories/GroupRepository';
import { Group } from '@/app/domain/group/aggregates/Group';
import { GameModeEnum } from '@/app/domain/group/enum/GameMode';
import { GroupId } from '@/app/domain/group/value-objects/GroupId';
import { GameMode } from '@/app/domain/group/value-objects/GameMode';

describe('GroupService', () => {
  let groupService: GroupService;
  let mockGroupRepository: jest.Mocked<GroupRepository>;

  beforeEach(() => {
    mockGroupRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findListByOwnerId: jest.fn(),
    } as any;

    groupService = new GroupService(mockGroupRepository);
  });

  describe('createGroup', () => {
    it('should create and save a new group', async () => {
      const input = {
        id: 'group-1',
        name: 'Test Group',
        ownerId: 'owner-1',
        gameMode: {
          type: GameModeEnum.FIXED_TEAMS,
          playersPerTeam: 5,
        },
      };

      await groupService.createGroup(input);

      expect(mockGroupRepository.save).toHaveBeenCalledTimes(1);
      const savedGroup = mockGroupRepository.save.mock.calls[0][0];
      expect(savedGroup).toBeInstanceOf(Group);
      expect(savedGroup.id.value).toBe(input.id);
      expect(savedGroup.name).toBe(input.name);
    });

    it('should throw error for invalid game mode', async () => {
      const input = {
        id: 'group-1',
        name: 'Test Group',
        ownerId: 'owner-1',
        gameMode: {
          type: GameModeEnum.FIXED_TEAMS,
          playersPerTeam: 0,
        },
      };

      await expect(groupService.createGroup(input)).rejects.toThrow();
    });

    it('should throw error for empty group name', async () => {
      const input = {
        id: 'group-1',
        name: '',
        ownerId: 'owner-1',
        gameMode: {
          type: GameModeEnum.FIXED_TEAMS,
          playersPerTeam: 5,
        },
      };

      await expect(groupService.createGroup(input)).rejects.toThrow();
    });
  });

  describe('getGroupsByOwnerId', () => {
    it('should return groups for a specific owner', async () => {
      const ownerId = 'owner-1';
      const groups = [
        Group.create({
          id: GroupId.create('group-1'),
          name: 'Group 1',
          gameMode: GameMode.create({
            type: GameModeEnum.FIXED_TEAMS,
            playersPerTeam: 5,
          }),
          ownerId,
        }),
        Group.create({
          id: GroupId.create('group-2'),
          name: 'Group 2',
          gameMode: GameMode.create({
            type: GameModeEnum.FIXED_TEAMS,
            playersPerTeam: 5,
          }),
          ownerId,
        }),
      ];

      mockGroupRepository.findListByOwnerId.mockResolvedValue(groups);

      const result = await groupService.getGroupsByOwnerId(ownerId);

      expect(result).toEqual(groups);
      expect(mockGroupRepository.findListByOwnerId).toHaveBeenCalledWith(ownerId);
    });

    it('should return empty array when no groups found', async () => {
      const ownerId = 'owner-1';
      mockGroupRepository.findListByOwnerId.mockResolvedValue([]);

      const result = await groupService.getGroupsByOwnerId(ownerId);

      expect(result).toEqual([]);
      expect(mockGroupRepository.findListByOwnerId).toHaveBeenCalledWith(ownerId);
    });
  });

  describe('getGroupDetails', () => {
    it('should return a group by id', async () => {
      const groupId = 'group-1';
      const group = Group.create({
        id: GroupId.create(groupId),
        name: 'Test Group',
        gameMode: GameMode.create({
          type: GameModeEnum.FIXED_TEAMS,
          playersPerTeam: 5,
        }),
        ownerId: 'owner-1',
      });

      mockGroupRepository.findById.mockResolvedValue(group);

      const result = await groupService.getGroupDetails(groupId);

      expect(result).toBe(group);
      expect(mockGroupRepository.findById).toHaveBeenCalledWith(groupId);
    });

    it('should return null when group not found', async () => {
      const groupId = 'nonexistent';
      mockGroupRepository.findById.mockResolvedValue(null);

      const result = await groupService.getGroupDetails(groupId);

      expect(result).toBeNull();
    });
  });

  describe('addMemberToGroup', () => {
    it('should add member to group and save', async () => {
      const input = {
        groupId: 'group-1',
        memberId: 'member-1',
        memberName: 'John Doe',
      };

      const group = Group.create({
        id: GroupId.create(input.groupId),
        name: 'Test Group',
        gameMode: GameMode.create({
          type: GameModeEnum.FIXED_TEAMS,
          playersPerTeam: 5,
        }),
        ownerId: 'owner-1',
      });

      mockGroupRepository.findById.mockResolvedValue(group);

      await groupService.addMemberToGroup(input);

      expect(mockGroupRepository.findById).toHaveBeenCalledWith(input.groupId);
      expect(mockGroupRepository.save).toHaveBeenCalledWith(group);
      expect(group.members).toHaveLength(1);
      expect(group.members[0].name).toBe(input.memberName);
    });

    it('should throw error when group not found', async () => {
      const input = {
        groupId: 'nonexistent',
        memberId: 'member-1',
        memberName: 'John Doe',
      };

      mockGroupRepository.findById.mockResolvedValue(null);

      await expect(groupService.addMemberToGroup(input)).rejects.toThrow(
        'GroupIdCannotBeEmpty'
      );
    });
  });
});
