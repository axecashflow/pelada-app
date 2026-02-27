import { GameMode } from '@/app/domain/group/value-objects/GameMode';
import { GameModePersistence } from '../types/GameModePersistence';

export class GameModeMapper {
  static toPersistence(gameMode: GameMode): GameModePersistence {
    return {
      type: gameMode.type,
      playersPerTeam: gameMode.playersPerTeam,
    };
  }

  static toDomain(raw: GameModePersistence): GameMode {
    return GameMode.create({
      type: raw.type,
      playersPerTeam: raw.playersPerTeam,
    })
  }
}
