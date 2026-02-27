import { Username } from './Username';

describe('Username', () => {
  it('should create a valid username', () => {
    const username = Username.create('john_doe');

    expect(username.value).toBe('john_doe');
  });

  it('should throw error if value is empty', () => {
    expect(() => Username.create('')).toThrow('UsernameCannotBeEmpty');
  });

  it('should consider two usernames with same value as equal', () => {
    const username1 = Username.create('john_doe');
    const username2 = Username.create('john_doe');

    expect(username1.equals(username2)).toBe(true);
  });

  it('should consider two usernames with different values as not equal', () => {
    const username1 = Username.create('john_doe');
    const username2 = Username.create('jane_doe');

    expect(username1.equals(username2)).toBe(false);
  });
});