import { User } from "@/app/domain/users/aggregates/User";

export type UserViewModelType = {
  id: string;
  email: string;
  username: string;
  createdAt?: Date;
}

export class UserViewModel {
  static toObject(user: User) {
    return {
      id: user.id.value,
      email: user.email.value,
      username: user.username.value,
      createdAt: user.createdAt,
    };
  }
}
