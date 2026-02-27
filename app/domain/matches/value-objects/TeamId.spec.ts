import { TeamId } from './TeamId';

describe('TeamId Value Object', () => {
  it('should create a valid team id', () => {
    const teamId = TeamId.create('team-1');

    expect(teamId.value).toBe('team-1');
  });

  it('should throw error if value is empty', () => {
    expect(() => TeamId.create('')).toThrow('TeamIdCannotBeEmpty');
  });

  it('should consider two team ids with same value as equal', () => {
    const id1 = TeamId.create('team-1');
    const id2 = TeamId.create('team-1');

    expect(id1.equals(id2)).toBe(true);
  });

  it('should consider two team ids with different values as not equal', () => {
    const id1 = TeamId.create('team-1');
    const id2 = TeamId.create('team-2');

    expect(id1.equals(id2)).toBe(false);
  });
});
