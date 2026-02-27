import { PlayerScore } from './PlayerScore';

describe('PlayerScore Value Object', () => {
  it('should create initial score with value 6', () => {
    const score = PlayerScore.initial();

    expect(score.score).toBe(6);
  });

  it('should create a valid score', () => {
    const score = PlayerScore.create(7.5);

    expect(score.score).toBe(7.5);
  });

  it('should round score to 2 decimal places', () => {
    const score = PlayerScore.create(7.123456);

    expect(score.score).toBe(7.12);
  });

  it('should throw error if score is less than 0', () => {
    expect(() => PlayerScore.create(-1)).toThrow('Score must be between 0 and 10');
  });

  it('should throw error if score is greater than 10', () => {
    expect(() => PlayerScore.create(11)).toThrow('Score must be between 0 and 10');
  });

  it('should accept score of 0', () => {
    const score = PlayerScore.create(0);

    expect(score.score).toBe(0);
  });

  it('should accept score of 10', () => {
    const score = PlayerScore.create(10);

    expect(score.score).toBe(10);
  });

  it('should add positive delta to score', () => {
    const score = PlayerScore.create(5);
    const updated = score.add(2);

    expect(updated.score).toBe(7);
  });

  it('should add negative delta to score', () => {
    const score = PlayerScore.create(8);
    const updated = score.add(-3);

    expect(updated.score).toBe(5);
  });

  it('should clamp score at maximum of 10 when adding', () => {
    const score = PlayerScore.create(9);
    const updated = score.add(5);

    expect(updated.score).toBe(10);
  });

  it('should clamp score at minimum of 0 when adding', () => {
    const score = PlayerScore.create(2);
    const updated = score.add(-5);

    expect(updated.score).toBe(0);
  });

  it('should consider two scores with same value as equal', () => {
    const score1 = PlayerScore.create(7.5);
    const score2 = PlayerScore.create(7.5);

    expect(score1.equals(score2)).toBe(true);
  });

  it('should consider two scores with different values as not equal', () => {
    const score1 = PlayerScore.create(7.5);
    const score2 = PlayerScore.create(8.0);

    expect(score1.equals(score2)).toBe(false);
  });
});
