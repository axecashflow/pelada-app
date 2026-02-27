import { Team } from "@/app/domain/matches/aggregates/Team";
import { PlayerViewModel } from "./PlayerViewModel";

export class TeamViewModel {
  static toObject(team: Team) {
    return {
      id: team.id.value,
      players: team.players.map(PlayerViewModel.toObject),
    };
  }
}
