import { Email } from '../values-objects/Email';
import { Password } from '../values-objects/Password';
import { UserId } from '../values-objects/UserId';
import { Username } from '../values-objects/Username';
import { User } from './User';

describe('User', () => {
  it('should create a user', () => {
    const user = User.create({
      id: UserId.create('user-1'),
      email: Email.create('test@example.com'),
      username: Username.create('testuser'),
    });

    expect(user).toBeDefined();
  });

  it('should change email', () => {
    const user = User.create({
      id: UserId.create('user-1'),
      email: Email.create('test@example.com'),
      username: Username.create('testuser'),
    });

    user.changeEmail(Email.create('newemail@example.com'));
    expect(user.email.value).toBe('newemail@example.com');
  });

  it('should change username', () => {
    const user = User.create({
      id: UserId.create('user-1'),
      email: Email.create('test@example.com'),
      username: Username.create('testuser'),
    });

    user.changeUsername(Username.create('newusername'));
    expect(user.username.value).toBe('newusername');
  });

  it('should have undefined password if not set', () => {
    const user = User.create({
      id: UserId.create('user-1'),
      email: Email.create('test@example.com'),
      username: Username.create('testuser'),
    });

    expect(user.password).toBeUndefined();
  });

  it('should change password', () => {
    const user = User.create({
      id: UserId.create('user-1'),
      email: Email.create('test@example.com'),
      username: Username.create('testuser'),
    });

    user.changePassword(Password.create('newpassword123@'));
    expect(user.password!.value).toBe('newpassword123@');
  });
});