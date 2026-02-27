import { GroupId } from './GroupId';

describe('GroupId Value Object', () => {
  it('should create a valid member id', () => {
    const groupId = GroupId.create('member-1');

    expect(groupId.value).toBe('member-1');
  });

  it('should throw error if value is empty', () => {
    expect(() => GroupId.create('')).toThrow('GroupIdCannotBeEmpty');
  });

  it('should consider two member ids with same value as equal', () => {
    const id1 = GroupId.create('member-1');
    const id2 = GroupId.create('member-1');

    expect(id1.equals(id2)).toBe(true);
  });

  it('should consider two member ids with different values as not equal', () => {
    const id1 = GroupId.create('member-1');
    const id2 = GroupId.create('member-2');

    expect(id1.equals(id2)).toBe(false);
  });
});
