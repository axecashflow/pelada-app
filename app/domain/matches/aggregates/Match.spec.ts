import { Match } from "./Match";
import { Team } from "./Team";
import { Player } from "../entities/Player";
import { MatchId } from "../value-objects/MatchId";
import { TeamId } from "../value-objects/TeamId";
import { PlayerId } from "../value-objects/PlayerId";
import { GroupId } from "@/app/domain/group/value-objects/GroupId";
import { StatTypeEnum } from "../enum/Stats";
import { PlayerPosition } from "../enum/Player";

describe("Match Aggregate", () => {
  let groupId: GroupId;
  let teamA: Team;
  let teamB: Team;
  let player1: Player;
  let player2: Player;
  let player3: Player;
  let player4: Player;

  beforeEach(() => {
    groupId = GroupId.create("group-1");
    teamA = Team.create(TeamId.create("team-a"));
    teamB = Team.create(TeamId.create("team-b"));

    player1 = Player.create(PlayerId.create("player-1"), "Player 1");
    player2 = Player.create(PlayerId.create("player-2"), "Player 2");
    player3 = Player.create(PlayerId.create("player-3"), "Player 3");
    player4 = Player.create(PlayerId.create("player-4"), "Player 4");

    teamA.addPlayer(player1);
    teamA.addPlayer(player2);
    teamB.addPlayer(player3);
    teamB.addPlayer(player4);
  });

  describe("create", () => {
    it("should create a match with two teams", () => {
      const matchId = MatchId.create("match-1");
      const match = Match.create(matchId, groupId, teamA, teamB);

      expect(match.id).toBe(matchId);
      expect(match.groupId).toBe(groupId);
      expect(match.teamA).toBe(teamA);
      expect(match.teamB).toBe(teamB);
      expect(match.stats).toEqual([]);
    });
  });

  describe("recordEvent", () => {
    it("should record a simple event without counterpart", () => {
      const match = Match.create(
        MatchId.create("match-1"),
        groupId,
        teamA,
        teamB,
      );

      match.recordEvent(player1.id, StatTypeEnum.ASSIST);

      expect(match.stats).toHaveLength(1);
      expect(match.stats[0].playerId).toBe(player1.id);
      expect(match.stats[0].type).toBe(StatTypeEnum.ASSIST);
    });

    it("should record event with counterpart using specified opponent", () => {
      const match = Match.create(
        MatchId.create("match-1"),
        groupId,
        teamA,
        teamB,
      );

      match.recordEvent(
        player1.id,
        StatTypeEnum.BALL_RECOVERY,
        player3.id,
        PlayerPosition.MIDFIELDER,
      );

      expect(match.stats).toHaveLength(2);

      // Primary stat
      expect(match.stats[0].playerId).toBe(player1.id);
      expect(match.stats[0].type).toBe(StatTypeEnum.BALL_RECOVERY);

      // Counterpart stat
      expect(match.stats[1].playerId).toBe(player3.id);
      expect(match.stats[1].type).toBe(StatTypeEnum.POSSESSION_LOST);
    });

    it("should record event with counterpart without specifying opponent", () => {
      const match = Match.create(
        MatchId.create("match-1"),
        groupId,
        teamA,
        teamB,
      );

      match.recordEvent(player1.id, StatTypeEnum.TACKLE);

      expect(match.stats).toHaveLength(1);

      // Primary stat
      expect(match.stats[0].playerId).toBe(player1.id);
      expect(match.stats[0].type).toBe(StatTypeEnum.TACKLE);
    });

    it("should record duel won with counterpart duel lost", () => {
      const match = Match.create(
        MatchId.create("match-1"),
        groupId,
        teamA,
        teamB,
      );

      match.recordEvent(player2.id, StatTypeEnum.DUEL_WON, player4.id);

      expect(match.stats).toHaveLength(2);
      expect(match.stats[0].type).toBe(StatTypeEnum.DUEL_WON);
      expect(match.stats[0].playerId).toBe(player2.id);
      expect(match.stats[1].type).toBe(StatTypeEnum.DUEL_LOST);
      expect(match.stats[1].playerId).toBe(player4.id);
    });

    it("should record goal with goalkeeper conceding", () => {
      const match = Match.create(
        MatchId.create("match-1"),
        groupId,
        teamA,
        teamB,
      );

      match.recordEvent(
        player1.id,
        StatTypeEnum.GOAL_FROM_INSIDE_BOX,
        player3.id,
        PlayerPosition.FORWARD,
      );

      expect(match.stats).toHaveLength(2);
      expect(match.stats[0].type).toBe(StatTypeEnum.GOAL_FROM_INSIDE_BOX);
      expect(match.stats[0].playerId).toBe(player1.id);
      expect(match.stats[1].type).toBe(StatTypeEnum.GOAL_CONCEDED);
      expect(match.stats[1].playerId).toBe(player3.id);
    });

    it("should throw error when player is not in match", () => {
      const match = Match.create(
        MatchId.create("match-1"),
        groupId,
        teamA,
        teamB,
      );
      const unknownPlayerId = PlayerId.create("unknown");

      expect(() => {
        match.recordEvent(unknownPlayerId, StatTypeEnum.ASSIST);
      }).toThrow("PlayerNotFoundInTeam");
    });

    it("should record multiple events for same player", () => {
      const match = Match.create(
        MatchId.create("match-1"),
        groupId,
        teamA,
        teamB,
      );

      match.recordEvent(player1.id, StatTypeEnum.PASS_COMPLETED);
      match.recordEvent(player1.id, StatTypeEnum.SHOT_ON_TARGET);
      match.recordEvent(player1.id, StatTypeEnum.ASSIST);

      expect(match.stats).toHaveLength(3);
      expect(
        match.stats.filter((s) => s.playerId.equals(player1.id)),
      ).toHaveLength(3);
    });

    it("should not create counterpart if opponent player not found", () => {
      const emptyTeamB = Team.create(TeamId.create("team-b-empty"));
      const match = Match.create(
        MatchId.create("match-1"),
        groupId,
        teamA,
        emptyTeamB,
      );

      match.recordEvent(player1.id, StatTypeEnum.TACKLE);

      // Only primary stat should be recorded
      expect(match.stats).toHaveLength(1);
      expect(match.stats[0].type).toBe(StatTypeEnum.TACKLE);
    });

    it("should update player score when recording positive event", () => {
      const match = Match.create(
        MatchId.create("match-1"),
        groupId,
        teamA,
        teamB,
      );

      const initialScore = player1.rating.score;

      match.recordEvent(
        player1.id,
        StatTypeEnum.GOAL_FROM_INSIDE_BOX,
        undefined,
        PlayerPosition.FORWARD,
      );

      // Score should increase (initial 6 + weight 1.2)
      expect(player1.rating.score).toBeGreaterThan(initialScore);
      expect(player1.rating.score).toBeCloseTo(7.5, 1);
    });

    it("should update player score when recording negative event", () => {
      const match = Match.create(
        MatchId.create("match-1"),
        groupId,
        teamA,
        teamB,
      );
      const initialScore = player3.rating.score;

      match.recordEvent(
        player1.id,
        StatTypeEnum.GOAL_FROM_INSIDE_BOX,
        player3.id,
        PlayerPosition.GOALKEEPER,
      );

      // Opponent score should decrease (goal conceded is negative)
      expect(player3.rating.score).toBeLessThan(initialScore);
    });

    it("should update scores for both players when event has counterpart", () => {
      const match = Match.create(
        MatchId.create("match-1"),
        groupId,
        teamA,
        teamB,
      );
      const player1InitialScore = player1.rating.score;
      const player3InitialScore = player3.rating.score;

      match.recordEvent(
        player1.id,
        StatTypeEnum.TACKLE,
        player3.id,
        PlayerPosition.DEFENDER,
      );

      // Player1 score should increase (tackle is positive)
      expect(player1.rating.score).toBeGreaterThan(player1InitialScore);
      // Player3 score should decrease (possession lost is negative)
      expect(player3.rating.score).toBeLessThan(player3InitialScore);
    });

    it("should clamp score between 0 and 10", () => {
      const match = Match.create(
        MatchId.create("match-1"),
        groupId,
        teamA,
        teamB,
      );

      // Record many positive events to try to exceed 10
      for (let i = 0; i < 10; i++) {
        match.recordEvent(
          player1.id,
          StatTypeEnum.GOAL_FROM_INSIDE_BOX,
          undefined,
          PlayerPosition.FORWARD,
        );
      }

      expect(player1.rating.score).toBeLessThanOrEqual(10);
      expect(player1.rating.score).toBeGreaterThanOrEqual(0);
    });
  });

  describe("substitutePlayerInTeamA", () => {
    it("should substitute a player in team A", () => {
      const match = Match.create(
        MatchId.create("match-1"),
        groupId,
        teamA,
        teamB,
      );
      const newPlayer = Player.create(
        PlayerId.create("new-player"),
        "New Player",
      );

      match.substitutePlayerInTeamA(player1, newPlayer);

      expect(match.teamA.players).toHaveLength(3);
      const substitutedOut = match.teamA.players.find((p) =>
        p.id.equals(player1.id),
      );
      expect(substitutedOut).toBeDefined();
      expect(substitutedOut?.presence).toBe("SUBSTITUTED_OUT");
      const substitutedIn = match.teamA.players.find((p) =>
        p.id.equals(newPlayer.id),
      );
      expect(substitutedIn).toBeDefined();
      expect(substitutedIn?.presence).toBe("SUBSTITUTED_IN");
    });
  });

  describe("substitutePlayerInTeamB", () => {
    it("should substitute a player in team B", () => {
      const match = Match.create(
        MatchId.create("match-1"),
        groupId,
        teamA,
        teamB,
      );
      const newPlayer = Player.create(
        PlayerId.create("new-player"),
        "New Player",
      );

      match.substitutePlayerInTeamB(player3, newPlayer);

      expect(match.teamB.players).toHaveLength(3);
      const substitutedOut = match.teamB.players.find((p) =>
        p.id.equals(player3.id),
      );
      expect(substitutedOut).toBeDefined();
      expect(substitutedOut?.presence).toBe("SUBSTITUTED_OUT");
      const substitutedIn = match.teamB.players.find((p) =>
        p.id.equals(newPlayer.id),
      );
      expect(substitutedIn).toBeDefined();
      expect(substitutedIn?.presence).toBe("SUBSTITUTED_IN");
    });
  });

  describe("equals", () => {
    it("should consider two matches with same id as equal", () => {
      const matchId = MatchId.create("match-1");
      const match1 = Match.create(matchId, groupId, teamA, teamB);
      const match2 = Match.create(matchId, groupId, teamA, teamB);

      expect(match1.equals(match2)).toBe(true);
    });

    it("should consider two matches with different ids as not equal", () => {
      const match1 = Match.create(
        MatchId.create("match-1"),
        groupId,
        teamA,
        teamB,
      );
      const match2 = Match.create(
        MatchId.create("match-2"),
        groupId,
        teamA,
        teamB,
      );

      expect(match1.equals(match2)).toBe(false);
    });
  });
});
