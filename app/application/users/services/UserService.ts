import { DomainError } from "@/app/domain/shared/DomainError";
import { Hasher } from "@/app/domain/shared/Hasher";
import { User } from "@/app/domain/users/aggregates/User";
import { UserRepository } from "@/app/domain/users/repositories/UserRepository";
import { Email } from "@/app/domain/users/values-objects/Email";
import { Password } from "@/app/domain/users/values-objects/Password";
import { UserId } from "@/app/domain/users/values-objects/UserId";
import { Username } from "@/app/domain/users/values-objects/Username";

type CreateUserInput = {
  id: string;
  email: string;
  username: string;
  password: string;
}

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hasher: Hasher,
  ) { }

  async createUser(input: CreateUserInput) {
    const user = User.create({
      email: Email.create(input.email),
      username: Username.create(input.username),
      id: UserId.create(input.id),
    });

    user.changePassword(Password.create(input.password));

    await this.userRepository.save(user);
  }

  async signIn(username: string, password: string) {
    const usernameVo = Username.create(username);
    const passwordVo = Password.create(password);

    const user = await this.userRepository.findByUsername(
      usernameVo,
    );

    if (!user) {
      throw new DomainError("UsernameNotFound");
    }

    const hashedPassword = await this.userRepository.getPasswordHash(user.id);

    const isPasswordValid = await this.hasher.compare(
      passwordVo.value,
      hashedPassword ?? ''
    );

    if (!isPasswordValid) {
      throw new DomainError("InvalidPassword");
    }

    return user;
  }
}