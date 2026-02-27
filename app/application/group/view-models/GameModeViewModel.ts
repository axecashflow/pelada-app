import { GameMode } from "@/app/domain/group/value-objects/GameMode";

export class GameModeViewModel {
  static toObject(gameMode: GameMode) {
    return {
      type: gameMode.type,
      playersPerTeam: gameMode.playersPerTeam,
    };
  }
}