import { GameModeEnum } from "@/app/domain/group/enum/GameMode";
import { MemberStatusEnum } from "@/app/domain/group/enum/Member";

export type MemberViewModelType = {
  id: string;
  name: string;
  status: MemberStatusEnum;
};

export type GameModeViewModelType = {
  type: GameModeEnum;
  playersPerTeam: number;
};

export type GroupViewModelType = {
  id: string;
  name: string;
  status: string;
  ownerId: string;
  gameMode: GameModeViewModelType;
  members: MemberViewModelType[];
  createdAt: Date;
};