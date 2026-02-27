import { MatchId } from './MatchId';

describe('MatchId Value Object', () => {
  it('should create a valid match id', () => {
    const matchId = MatchId.create('match-1');

    expect(matchId.value).toBe('match-1');
  });

  it('should throw error if value is empty', () => {
    expect(() => MatchId.create('')).toThrow('MatchIdCannotBeEmpty');
  });

  it('should consider two match ids with same value as equal', () => {
    const id1 = MatchId.create('match-1');
    const id2 = MatchId.create('match-1');

    expect(id1.equals(id2)).toBe(true);
  });

  it('should consider two match ids with different values as not equal', () => {
    const id1 = MatchId.create('match-1');
    const id2 = MatchId.create('match-2');

    expect(id1.equals(id2)).toBe(false);
  });
});