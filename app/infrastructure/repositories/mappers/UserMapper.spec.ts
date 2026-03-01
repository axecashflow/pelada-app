import { UserMapper } from './UserMapper';
import { User } from '@/app/domain/users/aggregates/User';
import { UserId } from '@/app/domain/users/values-objects/UserId';
import { Email } from '@/app/domain/users/values-objects/Email';
import { Username } from '@/app/domain/users/values-objects/Username';

describe('UserMapper', () => {
  it('should convert user domain to persistence and back', async () => {
    const user = User.create({
      id: UserId.create('u1'),
      email: Email.create('test@example.com'),
      username: Username.create('testuser'),
    });
    
    const persistence = await UserMapper.toPersistence(user);
    expect(persistence.id).toBe('u1');

    const back = UserMapper.toDomain(persistence);
    expect(back.id.value).toBe('u1');
  });
});
