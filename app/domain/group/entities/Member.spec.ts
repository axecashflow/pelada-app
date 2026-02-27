import { Member } from './Member';
import { MemberId } from '@/app/domain/group/value-objects/MemberId';
import { MemberStatusEnum } from '@/app/domain/group/enum/Member';

describe('Member Entity', () => {
  describe('creation', () => {
    it('should create a valid member', () => {
      const member = Member.create({
        id: MemberId.create('member-1'),
        name: 'John Doe',
      });

      expect(member.id.value).toBe('member-1');
      expect(member.name).toBe('John Doe');
      expect(member.status).toBe(MemberStatusEnum.ACTIVE);
    });

    it('should throw error if name is empty', () => {
      expect(() =>
        Member.create({
          id: MemberId.create('member-1'),
          name: '',
        }),
      ).toThrow('MemberNameRequired');
    });
  });

  describe('identity and equality', () => {
    it('should consider two members with same id as equal', () => {
      const id = MemberId.create('member-1');

      const member1 = Member.create({ id, name: 'John' });
      const member2 = Member.create({ id, name: 'Another Name' });

      expect(member1.equals(member2)).toBe(true);
    });

    it('should consider two members with different ids as not equal', () => {
      const member1 = Member.create({
        id: MemberId.create('member-1'),
        name: 'John',
      });

      const member2 = Member.create({
        id: MemberId.create('member-2'),
        name: 'John',
      });

      expect(member1.equals(member2)).toBe(false);
    });
  });

  describe('state transitions', () => {
    it('should suspend an active member', () => {
      const member = Member.create({
        id: MemberId.create('member-1'),
        name: 'John',
      });

      member.suspend();

      expect(member.status).toBe(MemberStatusEnum.SUSPENDED);
    });

    it('should not suspend a non-active member', () => {
      const member = Member.create({
        id: MemberId.create('member-1'),
        name: 'John',
      });

      member.deactivate();

      expect(() => member.suspend()).toThrow(
        'OnlyActiveMembersCanBeSuspended',
      );
    });

    it('should deactivate an active member', () => {
      const member = Member.create({
        id: MemberId.create('member-1'),
        name: 'John',
      });

      member.deactivate();

      expect(member.status).toBe(MemberStatusEnum.INACTIVE);
    });

    it('should not deactivate a non-active member', () => {
      const member = Member.create({
        id: MemberId.create('member-1'),
        name: 'John',
      });

      member.suspend();

      expect(() => member.deactivate()).toThrow(
        'CannotDeactivateMembersNotActive',
      );
    });

    it('should activate a suspended member', () => {
      const member = Member.create({
        id: MemberId.create('member-1'),
        name: 'John',
      });

      member.suspend();
      member.activate();

      expect(member.status).toBe(MemberStatusEnum.ACTIVE);
    });

    it('should not activate a member who left', () => {
      const member = Member.create({
        id: MemberId.create('member-1'),
        name: 'John',
      });

      member.leave();

      expect(() => member.activate()).toThrow(
        'CannotActivateMemberThatLeftGroup',
      );
    });

    it('should allow a member to leave', () => {
      const member = Member.create({
        id: MemberId.create('member-1'),
        name: 'John',
      });

      member.leave();

      expect(member.status).toBe(MemberStatusEnum.LEFT);
    });
  });
});
