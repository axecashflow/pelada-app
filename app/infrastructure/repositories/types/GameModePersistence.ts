import { GameModeEnum } from '@/app/domain/group/enum/GameMode';

export interface GameModePersistence {
  type: GameModeEnum;
  playersPerTeam: number;
}
