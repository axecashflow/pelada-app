import { eq } from "drizzle-orm";

import { User } from "@/app/domain/users/aggregates/User";
import { UserRepository } from "@/app/domain/users/repositories/UserRepository";
import { Email } from "@/app/domain/users/values-objects/Email";
import { UserId } from "@/app/domain/users/values-objects/UserId";
import { Username } from "@/app/domain/users/values-objects/Username";

import { db } from '../db/connection';
import { users } from "../db/schema";
import { UserMapper } from "./mappers/UserMapper";

export class DrizzleUserRepository implements UserRepository {
  async findById(id: UserId): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id.value))
      .limit(1);

    if (!result.length) return null;

    return UserMapper.toDomain(result[0]);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email.value))
      .limit(1);

    if (!result.length) return null;

    return UserMapper.toDomain(result[0]);
  }

  async findByUsername(username: Username): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username.value))
      .limit(1);

    if (!result.length) return null;

    return UserMapper.toDomain(result[0]);
  }

  async getPasswordHash(userId: UserId): Promise<string | null> {
    const result = await db
      .select({ password: users.password })
      .from(users)
      .where(eq(users.id, userId.value))
      .limit(1);

    if (!result.length) return null;

    return result[0].password;
  }

  async save(user: User): Promise<void> {
    const insertData = await UserMapper.toPersistence(user);

    await db
      .insert(users)
      .values(insertData)
      .onConflictDoUpdate({
        target: users.id,
        set: insertData,
      });
  }

}