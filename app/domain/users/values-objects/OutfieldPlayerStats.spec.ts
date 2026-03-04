import { OutfieldPlayerStats } from "./OutfieldPlayerStats";

describe("OutfieldPlayerStats", () => {
  describe("empty()", () => {
    it("should create empty stats with all values as 0", () => {
      const stats = OutfieldPlayerStats.empty();

      expect(stats.numberOfMatches).toBe(0);
      expect(stats.assists).toBe(0);
      expect(stats.shotsOnTarget).toBe(0);
      expect(stats.shotsOffTarget).toBe(0);
      expect(stats.shotsHitPost).toBe(0);
      expect(stats.goalFromInsideBox).toBe(0);
      expect(stats.goalFromOutsideBox).toBe(0);
      expect(stats.ownGoal).toBe(0);
      expect(stats.dribbleSuccess).toBe(0);
      expect(stats.dribbleFailed).toBe(0);
      expect(stats.passCompleted).toBe(0);
      expect(stats.passFailed).toBe(0);
      expect(stats.tackle).toBe(0);
      expect(stats.interception).toBe(0);
      expect(stats.block).toBe(0);
      expect(stats.possessionLost).toBe(0);
      expect(stats.ballRecovery).toBe(0);
      expect(stats.foulCommitted).toBe(0);
      expect(stats.foulSuffered).toBe(0);
      expect(stats.yellowCard).toBe(0);
      expect(stats.redCard).toBe(0);
      expect(stats.penaltyWon).toBe(0);
      expect(stats.penaltyMissed).toBe(0);
      expect(stats.penaltyScored).toBe(0);
      expect(stats.penaltyConceded).toBe(0);
      expect(stats.freeKickScored).toBe(0);
      expect(stats.nutmeg).toBe(0);
      expect(stats.lob).toBe(0);
      expect(stats.save).toBe(0);
      expect(stats.saveInsideBox).toBe(0);
      expect(stats.saveOutsideBox).toBe(0);
      expect(stats.penaltySave).toBe(0);
      expect(stats.goalConceded).toBe(0);
    });
  });

  describe("create()", () => {
    it("should create stats with provided values", () => {
      const props = {
        numberOfMatches: 5,
        assists: 3,
        shotsOnTarget: 10,
        shotsOffTarget: 5,
        shotsHitPost: 2,
        goalFromInsideBox: 4,
        goalFromOutsideBox: 2,
        ownGoal: 0,
        dribbleSuccess: 8,
        dribbleFailed: 3,
        passCompleted: 50,
        passFailed: 10,
        tackle: 15,
        interception: 8,
        block: 5,
        possessionLost: 12,
        ballRecovery: 10,
        foulCommitted: 3,
        foulSuffered: 2,
        yellowCard: 1,
        redCard: 0,
        penaltyWon: 1,
        penaltyMissed: 0,
        penaltyScored: 1,
        penaltyConceded: 0,
        freeKickScored: 0,
        nutmeg: 2,
        lob: 1,
        save: 0,
        saveInsideBox: 0,
        saveOutsideBox: 0,
        penaltySave: 0,
        goalConceded: 0,
      };

      const stats = OutfieldPlayerStats.create(props);

      expect(stats.numberOfMatches).toBe(5);
      expect(stats.assists).toBe(3);
      expect(stats.shotsOnTarget).toBe(10);
    });
  });

  describe("incrementNumberOfMatches()", () => {
    it("should increment number of matches by 1", () => {
      const stats = OutfieldPlayerStats.empty();
      const newStats = stats.incrementNumberOfMatches();

      expect(newStats.numberOfMatches).toBe(1);
      expect(stats.numberOfMatches).toBe(0); // original unchanged
    });

    it("should increment multiple times", () => {
      let stats = OutfieldPlayerStats.empty();
      stats = stats.incrementNumberOfMatches();
      stats = stats.incrementNumberOfMatches();

      expect(stats.numberOfMatches).toBe(2);
    });
  });

  describe("incrementAssists()", () => {
    it("should increment assists by 1", () => {
      const stats = OutfieldPlayerStats.empty();
      const newStats = stats.incrementAssists();

      expect(newStats.assists).toBe(1);
      expect(stats.assists).toBe(0);
    });
  });

  describe("incrementShotsOnTarget()", () => {
    it("should increment shots on target by 1", () => {
      const stats = OutfieldPlayerStats.empty();
      const newStats = stats.incrementShotsOnTarget();

      expect(newStats.shotsOnTarget).toBe(1);
    });
  });

  describe("incrementGoalFromInsideBox()", () => {
    it("should increment goals from inside box by 1", () => {
      const stats = OutfieldPlayerStats.empty();
      const newStats = stats.incrementGoalFromInsideBox();

      expect(newStats.goalFromInsideBox).toBe(1);
    });
  });

  describe("incrementDribbleSuccess()", () => {
    it("should increment dribble success by 1", () => {
      const stats = OutfieldPlayerStats.empty();
      const newStats = stats.incrementDribbleSuccess();

      expect(newStats.dribbleSuccess).toBe(1);
    });
  });

  describe("incrementPassCompleted()", () => {
    it("should increment pass completed by 1", () => {
      const stats = OutfieldPlayerStats.empty();
      const newStats = stats.incrementPassCompleted();

      expect(newStats.passCompleted).toBe(1);
    });
  });

  describe("incrementTackle()", () => {
    it("should increment tackle by 1", () => {
      const stats = OutfieldPlayerStats.empty();
      const newStats = stats.incrementTackle();

      expect(newStats.tackle).toBe(1);
    });
  });

  describe("incrementNutmeg()", () => {
    it("should increment nutmeg by 1", () => {
      const stats = OutfieldPlayerStats.empty();
      const newStats = stats.incrementNutmeg();

      expect(newStats.nutmeg).toBe(1);
    });
  });

  describe("incrementLob()", () => {
    it("should increment lob by 1", () => {
      const stats = OutfieldPlayerStats.empty();
      const newStats = stats.incrementLob();

      expect(newStats.lob).toBe(1);
    });
  });

  describe("incrementSave()", () => {
    it("should increment save by 1", () => {
      const stats = OutfieldPlayerStats.empty();
      const newStats = stats.incrementSave();

      expect(newStats.save).toBe(1);
    });
  });

  describe("incrementGoalConceded()", () => {
    it("should increment goal conceded by 1", () => {
      const stats = OutfieldPlayerStats.empty();
      const newStats = stats.incrementGoalConceded();

      expect(newStats.goalConceded).toBe(1);
    });
  });

  describe("chaining multiple increments", () => {
    it("should allow chaining multiple increments", () => {
      let stats = OutfieldPlayerStats.empty();
      stats = stats.incrementNumberOfMatches();
      stats = stats.incrementAssists();
      stats = stats.incrementShotsOnTarget();
      stats = stats.incrementGoalFromInsideBox();

      expect(stats.numberOfMatches).toBe(1);
      expect(stats.assists).toBe(1);
      expect(stats.shotsOnTarget).toBe(1);
      expect(stats.goalFromInsideBox).toBe(1);
    });
  });

  describe("immutability", () => {
    it("should not mutate original stats when incrementing", () => {
      const original = OutfieldPlayerStats.empty();
      const updated = original.incrementAssists();

      expect(original.assists).toBe(0);
      expect(updated.assists).toBe(1);
    });
  });
});
