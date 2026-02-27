import { Player } from "@/app/domain/matches/entities/Player";

export class PlayerViewModel {
  static toObject(player: Player) {
    return {
      id: player.id.value,
      name: player.name,
      rating: player.rating.score,
      position: player.position,
      presence: player.presence,
    };
  }
}
