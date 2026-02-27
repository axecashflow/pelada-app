import { UserId } from './UserId';

describe('UserId', () => {
  it('should create a UserId with a valid value', () => {
    const userId = UserId.create('12345');
    expect(userId.value).toBe('12345');
  });

  it('should throw an error when creating a UserId with an empty value', () => {
    expect(() => UserId.create('')).toThrow('UserIdCannotBeEmpty');
  });
});