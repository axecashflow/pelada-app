import { UpdateProfileStatsOnMatchStatRecordedHandler } from "./UpdateProfileStatsOnMatchStatRecordedHandler";
import { ProfileStatsRepository } from "../repositories/ProfileStatsRepository";
import { MatchStatRecordedEvent } from "@/app/domain/matches/events/MatchStatRecordedEvent";
import { StatTypeEnum } from "@/app/domain/matches/enum/Stats";
import { ProfileStats } from "../aggregates/ProfileStats";
import { UserId } from "../values-objects/UserId";

describe("UpdateProfileStatsOnMatchStatRecordedHandler", () => {
  let handler: UpdateProfileStatsOnMatchStatRecordedHandler;
  let mockRepository: jest.Mocked<ProfileStatsRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findByUserId: jest.fn(),
      findUserIdFromPlayer: jest.fn(),
    };

    handler = new UpdateProfileStatsOnMatchStatRecordedHandler(mockRepository);
  });

  describe("eventName", () => {
    it("should have correct event name", () => {
      expect(handler.eventName).toBe("MatchStatRecorded");
    });
  });

  describe("handle", () => {
    it("should create new ProfileStats if user does not have one", async () => {
      const event = MatchStatRecordedEvent.create(
        "match-1",
        "group-1",
        "user-123",
        StatTypeEnum.ASSIST,
      );

      mockRepository.findByUserId.mockResolvedValue(ProfileStats.create(UserId.create("user-123")));
      mockRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockRepository.findByUserId).toHaveBeenCalledWith(
        UserId.create("user-123"),
      );
      expect(mockRepository.save).toHaveBeenCalled();

      const savedProfileStats = (mockRepository.save as jest.Mock).mock
        .calls[0][0];
      expect(savedProfileStats.stats.assists).toBe(1);
    });

    it("should update existing ProfileStats", async () => {
      const event = MatchStatRecordedEvent.create(
        "match-1",
        "group-1",
        "user-123",
        StatTypeEnum.GOAL_FROM_INSIDE_BOX,
      );

      const userId = UserId.create("user-123");
      const existingStats = ProfileStats.create(userId);
      existingStats.addGoalFromInsideBox();

      mockRepository.findByUserId.mockResolvedValue(existingStats);
      mockRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockRepository.findByUserId).toHaveBeenCalledWith(userId);
      expect(mockRepository.save).toHaveBeenCalled();

      const savedProfileStats = (mockRepository.save as jest.Mock).mock
        .calls[0][0];
      expect(savedProfileStats.stats.goalFromInsideBox).toBe(2);
    });

    it("should handle ASSIST event", async () => {
      const event = MatchStatRecordedEvent.create(
        "match-1",
        "group-1",
        "user-123",
        StatTypeEnum.ASSIST,
      );

      mockRepository.findByUserId.mockResolvedValue(ProfileStats.create(UserId.create("user-123")));
      mockRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      const savedProfileStats = (mockRepository.save as jest.Mock).mock
        .calls[0][0];
      expect(savedProfileStats.stats.assists).toBe(1);
    });

    it("should handle DRIBBLE_SUCCESS event", async () => {
      const event = MatchStatRecordedEvent.create(
        "match-1",
        "group-1",
        "user-123",
        StatTypeEnum.DRIBBLE_SUCCESS,
      );

      mockRepository.findByUserId.mockResolvedValue(ProfileStats.create(UserId.create("user-123")));
      mockRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      const savedProfileStats = (mockRepository.save as jest.Mock).mock
        .calls[0][0];
      expect(savedProfileStats.stats.dribbleSuccess).toBe(1);
    });

    it("should handle NUTMEG event", async () => {
      const event = MatchStatRecordedEvent.create(
        "match-1",
        "group-1",
        "user-123",
        StatTypeEnum.NUTMEG,
      );

      mockRepository.findByUserId.mockResolvedValue(ProfileStats.create(UserId.create("user-123")));
      mockRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      const savedProfileStats = (mockRepository.save as jest.Mock).mock
        .calls[0][0];
      expect(savedProfileStats.stats.nutmeg).toBe(1);
    });

    it("should handle SAVE event", async () => {
      const event = MatchStatRecordedEvent.create(
        "match-1",
        "group-1",
        "user-123",
        StatTypeEnum.SAVE,
      );

      mockRepository.findByUserId.mockResolvedValue(ProfileStats.create(UserId.create("user-123")));
      mockRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      const savedProfileStats = (mockRepository.save as jest.Mock).mock
        .calls[0][0];
      expect(savedProfileStats.stats.save).toBe(1);
    });

    it("should not throw error for unmapped stats", async () => {
      const event = MatchStatRecordedEvent.create(
        "match-1",
        "group-1",
        "user-123",
        StatTypeEnum.NUTMEG_RECEIVED,
      );

      mockRepository.findByUserId.mockResolvedValue(ProfileStats.create(UserId.create("user-123")));
      mockRepository.save.mockResolvedValue(undefined);

      await expect(handler.handle(event)).resolves.not.toThrow();
    });

    it("should call repository save with correct ProfileStats", async () => {
      const event = MatchStatRecordedEvent.create(
        "match-1",
        "group-1",
        "user-123",
        StatTypeEnum.ASSIST,
      );

      const userId = UserId.create("user-123");
      mockRepository.findByUserId.mockResolvedValue(ProfileStats.create(UserId.create("user-123")));
      mockRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockRepository.save).toHaveBeenCalled();
      const savedArg = (mockRepository.save as jest.Mock).mock.calls[0][0];
      expect(savedArg).toBeInstanceOf(ProfileStats);
      expect(savedArg.userId).toEqual(userId);
    });
  });
});
