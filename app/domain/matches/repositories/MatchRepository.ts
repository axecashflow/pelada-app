import { Match } from "../aggregates/Match";

export interface MatchRepository {
  save(match: Match): Promise<void>;
  findById(id: string): Promise<Match | null>;
  findByDate(date: Date, groupId: string): Promise<Match[]>;
}
