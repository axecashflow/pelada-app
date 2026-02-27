import { Match } from "@/app/domain/matches/aggregates/Match";
import { TeamViewModel } from "./TeamViewModel";
import { MatchStatViewModel } from "./MatchStatViewModel";

export class MatchViewModel {
  static toObject(match: Match) {
    return {
      id: match.id.value,
      groupId: match.groupId.value,
      teamA: TeamViewModel.toObject(match.teamA),
      teamB: TeamViewModel.toObject(match.teamB),
      stats: match.stats.map(MatchStatViewModel.toObject),
    };
  }
}
