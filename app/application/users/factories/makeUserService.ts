import { DrizzleUserRepository } from "@/app/infrastructure/repositories/DrizzleUserRepository";
import { UserService } from "../services/UserService";
import { BcryptHasher } from "@/app/infrastructure/helpers/BcryptHasher";
import { DrizzleProfileStatsRepository } from "@/app/infrastructure/repositories/DrizzleProfileStatsRepository";

const makeUserService = () => {
  const userRepository = new DrizzleUserRepository();
  const hasher = new BcryptHasher();
  const profileStatsRepository = new DrizzleProfileStatsRepository();

  const userService = new UserService(
    userRepository,
    hasher,
    profileStatsRepository,
  );

  return userService;
};

export default makeUserService;
