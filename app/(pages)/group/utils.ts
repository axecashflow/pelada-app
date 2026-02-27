import { GameModeEnum } from "@/app/domain/group/enum/GameMode";

export const gameModeLabels: Record<GameModeEnum, string> = {
  [GameModeEnum.FIXED_TEAMS]: 'Time Fixo',
  [GameModeEnum.ROTATION]: '10 minutos 2 gols',
};
