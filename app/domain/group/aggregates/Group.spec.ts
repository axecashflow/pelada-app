import { Group } from './Group';
import { GroupStatusEnum } from '../enum/Group';
import { GameMode } from '../value-objects/GameMode';
import { Member } from '../entities/Member';
import { MemberId } from '../value-objects/MemberId';
import { GroupCreatedEvent } from '../events/GroupCreatedEvent';
import { MemberAddedToGroupEvent } from '../events/MemberAddedToGroupEvent';
import { MemberRemovedFromGroupEvent } from '../events/MemberRemovedFromGroupEvent';
import { GroupId } from '../value-objects/GroupId';
import { GameModeEnum } from '../enum/GameMode';

describe('Group Aggregate', () => {
  const baseGameMode = GameMode.create({
    playersPerTeam: 11,
    type: GameModeEnum.FIXED_TEAMS
  });

  describe('creation', () => {
    it('should create a valid group', () => {
      const group = Group.create({
        id: GroupId.create('group-1'),
        name: 'Saturday Football',
        gameMode: baseGameMode,
        ownerId: 'owner-1',
      });

      expect(group.id.value).toBe('group-1');
      expect(group.name).toBe('Saturday Football');
      expect(group.status).toBe(GroupStatusEnum.ACTIVE);
      expect(group.members).toHaveLength(0);
    });

    it('should emit GroupCreatedEvent', () => {
      const group = Group.create({
        id: GroupId.create('group-2'),
        name: 'Sunday Football',
        gameMode: baseGameMode,
        ownerId: 'owner-1',
      });

      const events = group.pullDomainEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(GroupCreatedEvent);
      expect(events[0].eventName).toBe('group.created');
    });

    it('should not allow empty group name', () => {
      expect(() =>
        Group.create({
          id: GroupId.create('group-3'),
          name: '',
          gameMode: baseGameMode,
          ownerId: 'owner-1',
        })
      ).toThrow('GroupNameRequired');
    });
  });

  describe('addMember', () => {
    it('should add a member to the group', () => {
      const group = Group.create({
        id: GroupId.create('group-4'),
        name: 'Night Football',
        gameMode: baseGameMode,
        ownerId: 'owner-1',
      });

      const member = Member.create({
        id: MemberId.create('member-1'),
        name: 'John',
      });

      group.addMember(member);

      expect(group.members).toHaveLength(1);
      expect(group.members[0]).toEqual(member);
    });

    it('should emit MemberAddedToGroupEvent', () => {
      const group = Group.create({
        id: GroupId.create('group-5'),
        name: 'Morning Football',
        gameMode: baseGameMode,
        ownerId: 'owner-1',
      });

      const member = Member.create({
        id: MemberId.create('member-1'),
        name: 'Paul',
      });

      group.addMember(member);

      const events = group.pullDomainEvents();

      expect(events.some(e => e instanceof MemberAddedToGroupEvent)).toBe(true);
    });

    it('should not allow duplicate members', () => {
      const group = Group.create({
        id: GroupId.create('group-6'),
        name: 'Duplicate Test',
        gameMode: baseGameMode,
        ownerId: 'owner-1',
      });

      const member = Member.create({
        id: MemberId.create('member-1'),
        name: 'Mike',
      });

      group.addMember(member);

      expect(() => group.addMember(member)).toThrow(
        'MemberAlreadyInGroup'
      );
    });

    it('should not add members to inactive group', () => {
      const group = Group.create({
        id: GroupId.create('group-7'),
        name: 'Inactive Group',
        gameMode: baseGameMode,
        ownerId: 'owner-1',
      });

      group.deactivate();

      const member = Member.create({
        id: MemberId.create('member-2'),
        name: 'Lucas',
      });

      expect(() => group.addMember(member)).toThrow(
        'GroupInactiveCannotAddMembers'
      );
    });

    it('should not add a member who already left', () => {
      const group = Group.create({
        id: GroupId.create('group-8'),
        name: 'Left Member',
        gameMode: baseGameMode,
        ownerId: 'owner-1',
      });

      const member = Member.create({
        id: MemberId.create('member-3'),
        name: 'Andre',
      });

      member.leave();

      expect(() => group.addMember(member)).toThrow(
        'MemberLeftGroupCannotRejoin'
      );
    });
  });

  describe('removeMember', () => {
    it('should mark member as left', () => {
      const group = Group.create({
        id: GroupId.create('group-9'),
        name: 'Removal Test',
        gameMode: baseGameMode,
        ownerId: 'owner-1',
      });

      const member = Member.create({
        id: MemberId.create('member-4'),
        name: 'Carlos',
      });

      group.addMember(member);
      group.removeMember(member.id);

      expect(member.status).toBe('LEFT');
    });

    it('should emit MemberRemovedFromGroupEvent', () => {
      const group = Group.create({
        id: GroupId.create('group-10'),
        name: 'Removal Event',
        gameMode: baseGameMode,
        ownerId: 'owner-1',
      });

      const member = Member.create({
        id: MemberId.create('member-5'),
        name: 'Pedro',
      });

      group.addMember(member);
      group.pullDomainEvents(); // limpa eventos anteriores

      group.removeMember(member.id);

      const events = group.pullDomainEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(MemberRemovedFromGroupEvent);
      expect(events[0].eventName).toBe('group.member_removed');
    });

    it('should not remove non-existing member', () => {
      const group = Group.create({
        id: GroupId.create('group-11'),
        name: 'Invalid Removal',
        gameMode: baseGameMode,
        ownerId: 'owner-1',
      });

      expect(() =>
        group.removeMember(MemberId.create('non-existent-member'))
      ).toThrow('MemberNotFound');
    });
  });

  describe('status transitions', () => {
    it('should deactivate and activate group', () => {
      const group = Group.create({
        id: GroupId.create('group-12'),
        name: 'Status Test',
        gameMode: baseGameMode,
        ownerId: 'owner-1',
      });

      group.deactivate();
      expect(group.status).toBe(GroupStatusEnum.INACTIVE);

      group.activate();
      expect(group.status).toBe(GroupStatusEnum.ACTIVE);
    });
  });
});
