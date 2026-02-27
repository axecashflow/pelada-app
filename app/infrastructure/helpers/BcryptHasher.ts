import bcrypt from "bcrypt";

import { Hasher } from "@/app/domain/shared/Hasher";

export class BcryptHasher implements Hasher {
  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}