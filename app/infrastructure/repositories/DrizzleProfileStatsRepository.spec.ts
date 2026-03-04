import { DrizzleProfileStatsRepository } from "./DrizzleProfileStatsRepository";
import { ProfileStats } from "@/app/domain/users/aggregates/ProfileStats";
import { UserId } from "@/app/domain/users/values-objects/UserId";
import { db } from "@/app/infrastructure/db/connection";
import { profileStats as profileStatsTable } from "@/app/infrastructure/db/schema";

jest.mock("@/app/infrastructure/db/connection");

describe("DrizzleProfileStatsRepository", () => {
  let repository: DrizzleProfileStatsRepository;
  let mockDb: any;

  beforeEach(() => {
    repository = new DrizzleProfileStatsRepository();
    mockDb = db as any;
    jest.clearAllMocks();
  });

  describe("save", () => {
    it("should insert new profile stats when user has no record", async () => {
      const userId = UserId.create("user-123");
      const profileStat = ProfileStats.create(userId);

      const mockInsert = jest.fn().mockReturnThis();
      const mockValues = jest.fn().mockReturnThis();
      const mockOnConflictDoUpdate = jest.fn().mockResolvedValue(undefined);

      (db as any).insert = mockInsert;
      mockInsert.mockReturnValue({
        values: mockValues,
      });
      mockValues.mockReturnValue({
        onConflictDoUpdate: mockOnConflictDoUpdate,
      });

      await repository.save(profileStat);

      expect(mockInsert).toHaveBeenCalledWith(profileStatsTable);
      expect(mockValues).toHaveBeenCalled();
      expect(mockOnConflictDoUpdate).toHaveBeenCalled();
    });

    it("should update existing profile stats", async () => {
      const userId = UserId.create("user-123");
      const profileStat = ProfileStats.create(userId);
      profileStat.addAssist();
      profileStat.addGoalFromInsideBox();

      const mockInsert = jest.fn().mockReturnThis();
      const mockValues = jest.fn().mockReturnThis();
      const mockOnConflictDoUpdate = jest.fn().mockResolvedValue(undefined);

      (db as any).insert = mockInsert;
      mockInsert.mockReturnValue({
        values: mockValues,
      });
      mockValues.mockReturnValue({
        onConflictDoUpdate: mockOnConflictDoUpdate,
      });

      await repository.save(profileStat);

      expect(mockOnConflictDoUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          target: profileStatsTable.userId,
        })
      );
    });
  });

  describe("findByUserId", () => {
    it("should return null when user has no profile stats", async () => {
      const userId = UserId.create("user-123");

      const mockSelect = jest.fn().mockReturnThis();
      const mockFrom = jest.fn().mockReturnThis();
      const mockWhere = jest.fn().mockReturnThis();
      const mockLimit = jest.fn().mockResolvedValue([]);

      (db as any).select = mockSelect;
      mockSelect.mockReturnValue({
        from: mockFrom,
      });
      mockFrom.mockReturnValue({
        where: mockWhere,
      });
      mockWhere.mockReturnValue({
        limit: mockLimit,
      });

      const result = await repository.findByUserId(userId);

      expect(result).toBeNull();
      expect(mockSelect).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith(profileStatsTable);
    });

    it("should return profile stats when user has a record", async () => {
      const userId = UserId.create("user-123");
      const persistenceRecord = {
        userId: "user-123",
        numberOfMatches: "5",
        assists: "2",
        shotsOnTarget: "3",
        shotsOffTarget: "1",
        shotsHitPost: "0",
        goalFromInsideBox: "1",
        goalFromOutsideBox: "0",
        ownGoal: "0",
        dribbleSuccess: "10",
        dribbleFailed: "2",
        passCompleted: "45",
        passFailed: "5",
        tackle: "8",
        interception: "3",
        block: "2",
        possessionLost: "4",
        ballRecovery: "7",
        foulCommitted: "2",
        foulSuffered: "1",
        yellowCard: "0",
        redCard: "0",
        penaltyWon: "0",
        penaltyMissed: "0",
        penaltyScored: "0",
        penaltyConceded: "0",
        freeKickScored: "0",
        nutmeg: "1",
        lob: "0",
        save: "3",
        saveInsideBox: "2",
        saveOutsideBox: "1",
        penaltySave: "0",
        goalConceded: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockSelect = jest.fn().mockReturnThis();
      const mockFrom = jest.fn().mockReturnThis();
      const mockWhere = jest.fn().mockReturnThis();
      const mockLimit = jest.fn().mockResolvedValue([persistenceRecord]);

      (db as any).select = mockSelect;
      mockSelect.mockReturnValue({
        from: mockFrom,
      });
      mockFrom.mockReturnValue({
        where: mockWhere,
      });
      mockWhere.mockReturnValue({
        limit: mockLimit,
      });

      const result = await repository.findByUserId(userId);

      expect(result).not.toBeNull();
      expect(result?.userId.value).toBe("user-123");
      expect(mockWhere).toHaveBeenCalled();
      expect(mockLimit).toHaveBeenCalledWith(1);
    });
  });
});
