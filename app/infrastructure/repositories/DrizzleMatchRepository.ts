import { MatchRepository } from "@/app/domain/matches/repositories/MatchRepository";
import { Match } from "@/app/domain/matches/aggregates/Match";
import { db } from "../db/connection";
import { matches, teams, matchPlayers, matchStats } from "../db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { MatchMapper } from "./mappers/MatchMapper";
import { MatchPersistence } from "./types/MatchPersistence";

export class DrizzleMatchRepository implements MatchRepository {
  async save(match: Match): Promise<void> {
    const persistence = MatchMapper.toPersistence(match);

    await db.transaction(async (tx) => {
      await tx
        .insert(matches)
        .values(persistence.match)
        .onConflictDoUpdate({
          target: matches.id,
          set: {
            matchDate: persistence.match.matchDate,
          },
        });

      await tx.delete(matchStats).where(eq(matchStats.matchId, match.id.value));

      await tx.delete(matchPlayers).where(
        eq(matchPlayers.teamId, persistence.teams[0].id)
      );

      await tx.delete(matchPlayers).where(
        eq(matchPlayers.teamId, persistence.teams[1].id)
      );

      await tx.delete(teams).where(eq(teams.matchId, match.id.value));

      await tx.insert(teams).values(persistence.teams);

      if (persistence.players.length > 0) {
        await tx.insert(matchPlayers).values(persistence.players);
      }

      if (persistence.stats.length > 0) {
        await tx.insert(matchStats).values(persistence.stats);
      }
    });
  }

  async findById(id: string): Promise<Match | null> {
    const matchRow = await db
      .select()
      .from(matches)
      .where(eq(matches.id, id))
      .limit(1);

    if (matchRow.length === 0) {
      return null;
    }

    const teamRows = await db
      .select()
      .from(teams)
      .where(eq(teams.matchId, id));

    if (teamRows.length === 0) {
      return null;
    }

    const playerRows = await db
      .select()
      .from(matchPlayers);

    const statRows = await db
      .select()
      .from(matchStats)
      .where(eq(matchStats.matchId, id));

    const teamsWithPlayers = teamRows.map((team) => ({
      ...team,
      players: playerRows.filter((p) => p.teamId === team.id),
    }));

    const matchPersistence: MatchPersistence = {
      ...matchRow[0],
      teams: teamsWithPlayers,
      stats: statRows,
    };

    return MatchMapper.toDomain(matchPersistence);
  }

  async findByDate(date: Date, groupId: string): Promise<Match[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const matchRows = await db
      .select()
      .from(matches)
      .where(
        and(
          eq(matches.groupId, groupId),
          gte(matches.matchDate, startOfDay),
          lte(matches.matchDate, endOfDay)
        )
      );

    if (matchRows.length === 0) {
      return [];
    }

    const teamRows = await db
      .select()
      .from(teams);

    const playerRows = await db
      .select()
      .from(matchPlayers);

    const statRows = await db
      .select()
      .from(matchStats);

    const matchPersistences: MatchPersistence[] = matchRows.map((matchRow) => {
      const matchTeams = teamRows.filter((t) => t.matchId === matchRow.id);
      const teamsWithPlayers = matchTeams.map((team) => ({
        ...team,
        players: playerRows.filter((p) => p.teamId === team.id),
      }));

      return {
        ...matchRow,
        teams: teamsWithPlayers,
        stats: statRows.filter((s) => s.matchId === matchRow.id),
      };
    });

    return matchPersistences.map(MatchMapper.toDomain);
  }
}
