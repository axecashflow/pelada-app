import { ProfileStatsEventMapper } from "./ProfileStatsEventMapper";
import { MatchStatRecordedEvent } from "@/app/domain/matches/events/MatchStatRecordedEvent";
import { StatTypeEnum } from "@/app/domain/matches/enum/Stats";
import { ProfileStats } from "../aggregates/ProfileStats";
import { UserId } from "../values-objects/UserId";

describe("ProfileStatsEventMapper", () => {
  let profileStats: ProfileStats;
  const userId = UserId.create("user-123");

  beforeEach(() => {
    profileStats = ProfileStats.create(userId);
  });

  describe("mapEventToProfileStatMethod", () => {
    it("should map ASSIST event to addAssist", () => {
      const event = MatchStatRecordedEvent.create(
        "match-1",
        "group-1",
        "user-123",
        StatTypeEnum.ASSIST,
      );

      ProfileStatsEventMapper.mapEventToProfileStatMethod(profileStats, event);

      expect(profileStats.stats.assists).toBe(1);
    });

    it("should map SHOT_ON_TARGET event to addShotOnTarget", () => {
      const event = MatchStatRecordedEvent.create(
        "match-1",
        "group-1",
        "user-123",
        StatTypeEnum.SHOT_ON_TARGET,
      );

      ProfileStatsEventMapper.mapEventToProfileStatMethod(profileStats, event);

      expect(profileStats.stats.shotsOnTarget).toBe(1);
    });

    it("should map GOAL_FROM_INSIDE_BOX event to addGoalFromInsideBox", () => {
      const event = MatchStatRecordedEvent.create(
        "match-1",
        "group-1",
        "user-123",
        StatTypeEnum.GOAL_FROM_INSIDE_BOX,
      );

      ProfileStatsEventMapper.mapEventToProfileStatMethod(profileStats, event);

      expect(profileStats.stats.goalFromInsideBox).toBe(1);
    });

    it("should map DRIBBLE_SUCCESS event to addDribbleSuccess", () => {
      const event = MatchStatRecordedEvent.create(
        "match-1",
        "group-1",
        "user-123",
        StatTypeEnum.DRIBBLE_SUCCESS,
      );

      ProfileStatsEventMapper.mapEventToProfileStatMethod(profileStats, event);

      expect(profileStats.stats.dribbleSuccess).toBe(1);
    });

    it("should map PASS_COMPLETED event to addPassCompleted", () => {
      const event = MatchStatRecordedEvent.create(
        "match-1",
        "group-1",
        "user-123",
        StatTypeEnum.PASS_COMPLETED,
      );

      ProfileStatsEventMapper.mapEventToProfileStatMethod(profileStats, event);

      expect(profileStats.stats.passCompleted).toBe(1);
    });

    it("should map TACKLE event to addTackle", () => {
      const event = MatchStatRecordedEvent.create(
        "match-1",
        "group-1",
        "user-123",
        StatTypeEnum.TACKLE,
      );

      ProfileStatsEventMapper.mapEventToProfileStatMethod(profileStats, event);

      expect(profileStats.stats.tackle).toBe(1);
    });

    it("should map NUTMEG event to addNutmeg", () => {
      const event = MatchStatRecordedEvent.create(
        "match-1",
        "group-1",
        "user-123",
        StatTypeEnum.NUTMEG,
      );

      ProfileStatsEventMapper.mapEventToProfileStatMethod(profileStats, event);

      expect(profileStats.stats.nutmeg).toBe(1);
    });

    it("should map LOB event to addLob", () => {
      const event = MatchStatRecordedEvent.create(
        "match-1",
        "group-1",
        "user-123",
        StatTypeEnum.LOB,
      );

      ProfileStatsEventMapper.mapEventToProfileStatMethod(profileStats, event);

      expect(profileStats.stats.lob).toBe(1);
    });

    it("should map SAVE event to addSave", () => {
      const event = MatchStatRecordedEvent.create(
        "match-1",
        "group-1",
        "user-123",
        StatTypeEnum.SAVE,
      );

      ProfileStatsEventMapper.mapEventToProfileStatMethod(profileStats, event);

      expect(profileStats.stats.save).toBe(1);
    });

    it("should map GOAL_CONCEDED event to addGoalConceded", () => {
      const event = MatchStatRecordedEvent.create(
        "match-1",
        "group-1",
        "user-123",
        StatTypeEnum.GOAL_CONCEDED,
      );

      ProfileStatsEventMapper.mapEventToProfileStatMethod(profileStats, event);

      expect(profileStats.stats.goalConceded).toBe(1);
    });

    it("should not map NUTMEG_RECEIVED event", () => {
      const event = MatchStatRecordedEvent.create(
        "match-1",
        "group-1",
        "user-123",
        StatTypeEnum.NUTMEG_RECEIVED,
      );

      ProfileStatsEventMapper.mapEventToProfileStatMethod(profileStats, event);

      expect(profileStats.stats.nutmeg).toBe(0);
    });

    it("should not map LOB_RECEIVED event", () => {
      const event = MatchStatRecordedEvent.create(
        "match-1",
        "group-1",
        "user-123",
        StatTypeEnum.LOB_RECEIVED,
      );

      ProfileStatsEventMapper.mapEventToProfileStatMethod(profileStats, event);

      expect(profileStats.stats.lob).toBe(0);
    });

    it("should handle multiple sequential events", () => {
      const assistEvent = MatchStatRecordedEvent.create(
        "match-1",
        "group-1",
        "user-123",
        StatTypeEnum.ASSIST,
      );
      const goalEvent = MatchStatRecordedEvent.create(
        "match-1",
        "group-1",
        "user-123",
        StatTypeEnum.GOAL_FROM_INSIDE_BOX,
      );
      const tackleEvent = MatchStatRecordedEvent.create(
        "match-1",
        "group-1",
        "user-123",
        StatTypeEnum.TACKLE,
      );

      ProfileStatsEventMapper.mapEventToProfileStatMethod(profileStats, assistEvent);
      ProfileStatsEventMapper.mapEventToProfileStatMethod(profileStats, goalEvent);
      ProfileStatsEventMapper.mapEventToProfileStatMethod(profileStats, tackleEvent);

      expect(profileStats.stats.assists).toBe(1);
      expect(profileStats.stats.goalFromInsideBox).toBe(1);
      expect(profileStats.stats.tackle).toBe(1);
    });
  });
});
