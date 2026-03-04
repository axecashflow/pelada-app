"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import makeUserService from "@/app/application/users/factories/makeUserService";
import { ProfileStatsViewModel } from "@/app/application/users/view-models/ProfileStatsViewModel";
import { UserViewModel } from "@/app/application/users/view-models/UserViewModel";

const userService = makeUserService();

export async function getUser() {
  const session = await getServerSession(authOptions);

  const user = await userService.getUser(session?.user.id!);

  return UserViewModel.toObject(user!);
}

export async function getProfileStats() {
  const session = await getServerSession(authOptions);

  const profileStats = await userService.getProfileStats(session?.user.id!);

  return ProfileStatsViewModel.toObject(profileStats);
}
