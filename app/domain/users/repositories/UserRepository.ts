import { User } from "../aggregates/User";
import { Email } from "../values-objects/Email";
import { UserId } from "../values-objects/UserId";
import { Username } from "../values-objects/Username";

export interface UserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findByUsername(username: Username): Promise<User | null>;
  save(user: User): Promise<void>;
  getPasswordHash(userId: UserId): Promise<string | null>;
}