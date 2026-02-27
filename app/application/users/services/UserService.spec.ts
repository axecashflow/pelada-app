import { UserService } from './UserService';
import { UserRepository } from '@/app/domain/users/repositories/UserRepository';
import { Hasher } from '@/app/domain/shared/Hasher';
import { User } from '@/app/domain/users/aggregates/User';
import { UserId } from '@/app/domain/users/values-objects/UserId';
import { Email } from '@/app/domain/users/values-objects/Email';
import { Username } from '@/app/domain/users/values-objects/Username';

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockHasher: jest.Mocked<Hasher>;

  beforeEach(() => {
    mockUserRepository = {
      save: jest.fn(),
      findByUsername: jest.fn(),
      findByEmail: jest.fn(),
      getPasswordHash: jest.fn(),
    } as any;

    mockHasher = {
      hash: jest.fn(),
      compare: jest.fn(),
    } as any;

    userService = new UserService(mockUserRepository, mockHasher);
  });

  describe('createUser', () => {
    it('should create and save a new user', async () => {
      const input = {
        id: 'user-1',
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password@123',
      };

      await userService.createUser(input);

      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
      const savedUser = mockUserRepository.save.mock.calls[0][0];
      expect(savedUser).toBeInstanceOf(User);
      expect(savedUser.id.value).toBe(input.id);
      expect(savedUser.email.value).toBe(input.email);
      expect(savedUser.username.value).toBe(input.username);
    });

    it('should throw error for invalid email', async () => {
      const input = {
        id: 'user-1',
        email: 'invalid-email',
        username: 'testuser',
        password: 'Password@123',
      };

      await expect(userService.createUser(input)).rejects.toThrow();
    });

    it('should throw error for invalid username', async () => {
      const input = {
        id: 'user-1',
        email: 'test@example.com',
        username: 'ab',
        password: 'Password@123',
      };

      await expect(userService.createUser(input)).rejects.toThrow();
    });

    it('should throw error for invalid password', async () => {
      const input = {
        id: 'user-1',
        email: 'test@example.com',
        username: 'testuser',
        password: '123',
      };

      await expect(userService.createUser(input)).rejects.toThrow();
    });
  });

  describe('signIn', () => {
    it('should sign in user with valid credentials', async () => {
      const username = 'testuser';
      const password = 'Password@123';
      const hashedPassword = 'hashed_password';

      const user = User.create({
        id: UserId.create('user-1'),
        email: Email.create('test@example.com'),
        username: Username.create(username),
      });

      mockUserRepository.findByUsername.mockResolvedValue(user);
      mockUserRepository.getPasswordHash.mockResolvedValue(hashedPassword);
      mockHasher.compare.mockResolvedValue(true);

      const result = await userService.signIn(username, password);

      expect(result).toBe(user);
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(
        expect.objectContaining({ value: username })
      );
      expect(mockHasher.compare).toHaveBeenCalledWith(password, hashedPassword);
    });

    it('should throw error when username not found', async () => {
      mockUserRepository.findByUsername.mockResolvedValue(null);

      await expect(
        userService.signIn('nonexistent', 'Password@123')
      ).rejects.toThrow('UsernameNotFound');
    });

    it('should throw error when password is invalid', async () => {
      const username = 'testuser';
      const password = 'WrongPass@123';
      const hashedPassword = 'hashed_password';

      const user = User.create({
        id: UserId.create('user-1'),
        email: Email.create('test@example.com'),
        username: Username.create(username),
      });

      mockUserRepository.findByUsername.mockResolvedValue(user);
      mockUserRepository.getPasswordHash.mockResolvedValue(hashedPassword);
      mockHasher.compare.mockResolvedValue(false);

      await expect(userService.signIn(username, password)).rejects.toThrow(
        'InvalidPassword'
      );
    });

    it('should throw error for invalid username format', async () => {
      await expect(userService.signIn('ab', 'Password@123')).rejects.toThrow();
    });

    it('should throw error for invalid password format', async () => {
      await expect(userService.signIn('testuser', '123')).rejects.toThrow();
    });
  });
});
