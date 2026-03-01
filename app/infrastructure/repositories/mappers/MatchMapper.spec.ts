import { MatchMapper } from "./MatchMapper";
import { Match } from "@/app/domain/matches/aggregates/Match";
import { Team } from "@/app/domain/matches/aggregates/Team";
import { Player } from "@/app/domain/matches/entities/Player";
import { MatchId } from "@/app/domain/matches/value-objects/MatchId";
import { TeamId } from "@/app/domain/matches/value-objects/TeamId";
import { PlayerId } from "@/app/domain/matches/value-objects/PlayerId";
import { GroupId } from "@/app/domain/group/value-objects/GroupId";

function makeSimpleMatch() {
  const teamA = Team.create(TeamId.create("team-a"));
  const teamB = Team.create(TeamId.create("team-b"));
  const player = Player.create(PlayerId.create("p1"), "P1");
  teamA.addPlayer(player);
  const match = Match.create(
    MatchId.create("m1"),
    GroupId.create("g1"),
    teamA,
    teamB,
  );
  return match;
}

describe("MatchMapper", () => {
  it("should convert to persistence and back to domain", () => {
    const match = makeSimpleMatch();

    const persistence = MatchMapper.toPersistence(match);

    expect(persistence.match.id).toBe("m1");
    expect(persistence.match.groupId).toBe("g1");
    expect(persistence.teams).toHaveLength(2);

    const back = MatchMapper.toDomain({
      createdAt: new Date(),
      groupId: "g1",
      id: "m1",
      matchDate: new Date(),
      stats: persistence.stats,
      teams: persistence.teams.map(({ id, matchId, teamType }) => ({
        id,
        matchId,
        teamType,
        players: persistence.players.filter((p) =>
          teamType === "A" ? p.teamId === "team-a" : p.teamId === "team-b",
        ),
      })),
    });

    expect(back.id.value).toBe("m1");
    expect(back.teamA.players).toHaveLength(1);
  });
});
