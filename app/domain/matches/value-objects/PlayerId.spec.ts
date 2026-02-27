import { PlayerId } from './PlayerId';

describe('PlayerId Value Object', () => {
  it('should create a valid player id', () => {
    const playerId = PlayerId.create('player-1');

    expect(playerId.value).toBe('player-1');
  });

  it('should throw error if value is empty', () => {
    expect(() => PlayerId.create('')).toThrow('PlayerIdCannotBeEmpty');
  });

  it('should consider two player ids with same value as equal', () => {
    const id1 = PlayerId.create('player-1');
    const id2 = PlayerId.create('player-1');

    expect(id1.equals(id2)).toBe(true);
  });

  it('should consider two player ids with different values as not equal', () => {
    const id1 = PlayerId.create('player-1');
    const id2 = PlayerId.create('player-2');

    expect(id1.equals(id2)).toBe(false);
  });
});