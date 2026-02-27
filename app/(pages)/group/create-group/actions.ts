'use server';

import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import makeGroupService from "@/app/application/group/factories/makeGroupService";

import { CreateGroupFormType } from "./types";

const service = makeGroupService();

export async function createGroupAction(data: CreateGroupFormType) {
  const { gameMode, name } = data;

  const user = await getServerSession(authOptions);

  const ownerId = user?.user.id!;

  const id = crypto.randomUUID();

  await service.createGroup({
    id,
    name,
    gameMode,
    ownerId,
  });
}