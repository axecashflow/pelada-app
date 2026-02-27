import bcrypt from "bcrypt";

import { User } from "@/app/domain/users/aggregates/User";
import { UserPersistence } from "../types/UserPersistence";
import { UserId } from "@/app/domain/users/values-objects/UserId";
import { Username } from "@/app/domain/users/values-objects/Username";
import { Email } from "@/app/domain/users/values-objects/Email";

const saltRounds = 10;

export class UserMapper {
  static async toPersistence(user: User) {
    const hashedPassword = user.password
      ? await bcrypt.hash(user.password.value, saltRounds)
      : undefined;

    const data: any = {
      id: user.id.value,
      username: user.username.value,
      email: user.email.value,
    }

    if (user.password?.value) {
      data.password = hashedPassword;
    }

    return data;
  }

  static toDomain(user: UserPersistence): User {
    return User.create({
      id: UserId.create(user.id),
      username: Username.create(user.username),
      email: Email.create(user.email),
      createdAt: user.createdAt,
    });
  }
}