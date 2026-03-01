import { GroupMapper } from './GroupMapper';
import { Group } from '@/app/domain/group/aggregates/Group';
import { GroupId } from '@/app/domain/group/value-objects/GroupId';
import { GameMode } from '@/app/domain/group/value-objects/GameMode';
import { GameModeEnum } from '@/app/domain/group/enum/GameMode';
import { Member } from '@/app/domain/group/entities/Member';
import { MemberId } from '@/app/domain/group/value-objects/MemberId';

describe('GroupMapper', () => {
  it('should map group domain to persistence and back', () => {
    const gameMode = GameMode.create({ type: GameModeEnum.ROTATION, playersPerTeam: 5 });
    const group = Group.create({
      id: GroupId.create('g1'),
      name: 'Test',
      gameMode,
      ownerId: 'owner-1',
    });
    const member = Member.create({ id: MemberId.create('m1'), name: 'mem' });
    group.addMember(member);

    const persistence = GroupMapper.toPersistence(group);
    expect(persistence.id).toBe('g1');
    expect(persistence.members.length).toBe(1);

    const back = GroupMapper.toDomain(persistence);
    expect(back.id.value).toBe('g1');
    expect(back.members).toHaveLength(1);
  });
});
