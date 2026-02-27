import { DrizzleUserRepository } from "@/app/infrastructure/repositories/DrizzleUserRepository";
import { UserService } from "../services/UserService";
import { BcryptHasher } from "@/app/infrastructure/helpers/BcryptHasher";

const makeUserService = () => {
  const userRepository = new DrizzleUserRepository();
  const hasher = new BcryptHasher();

  const userService = new UserService(
    userRepository,
    hasher
  );

  return userService;
};

export default makeUserService;