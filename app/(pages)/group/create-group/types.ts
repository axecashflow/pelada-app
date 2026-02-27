import { GameModeEnum } from "@/app/domain/group/enum/GameMode";

export type CreateGroupFormType = {
  name: string;
  gameMode: {
    type: GameModeEnum;
    playersPerTeam: number;
  };
}

export type GameModeType = {
  type: GameModeEnum;
  playersPerTeam: number;
}
