'use server';

import makeUserService from "@/app/application/users/factories/makeUserService";
import { CreateUserFormType } from "./types";

const service = makeUserService();

export async function registerAction(data: CreateUserFormType) {
  const { email, password, username } = data;

  const id = crypto.randomUUID();

  await service.createUser({
    email,
    password,
    username,
    id,
  });
}