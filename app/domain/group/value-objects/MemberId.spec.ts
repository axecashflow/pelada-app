import { MemberId } from './MemberId';

describe('MemberId Value Object', () => {
  it('should create a valid member id', () => {
    const memberId = MemberId.create('member-1');

    expect(memberId.value).toBe('member-1');
  });

  it('should throw error if value is empty', () => {
    expect(() => MemberId.create('')).toThrow('MemberIdCannotBeEmpty');
  });

  it('should consider two member ids with same value as equal', () => {
    const id1 = MemberId.create('member-1');
    const id2 = MemberId.create('member-1');

    expect(id1.equals(id2)).toBe(true);
  });

  it('should consider two member ids with different values as not equal', () => {
    const id1 = MemberId.create('member-1');
    const id2 = MemberId.create('member-2');

    expect(id1.equals(id2)).toBe(false);
  });
});
