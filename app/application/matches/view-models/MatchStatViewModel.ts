import { MatchStat } from "@/app/domain/matches/value-objects/MatchStat";

export class MatchStatViewModel {
  static toObject(stat: MatchStat) {
    return {
      playerId: stat.playerId.value,
      type: stat.type,
      value: stat.value,
      weight: stat.weight.value,
      impact: stat.impact,
    };
  }
}
