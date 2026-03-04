import { ProfileStats } from "./ProfileStats";
import { UserId } from "../values-objects/UserId";

describe("ProfileStats", () => {
  let userId: UserId;

  beforeEach(() => {
    userId = UserId.create("user-123");
  });

  describe("create()", () => {
    it("should create a new ProfileStats with empty stats", () => {
      const profileStats = ProfileStats.create(userId);

      expect(profileStats.userId).toEqual(userId);
      expect(profileStats.stats.numberOfMatches).toBe(0);
      expect(profileStats.stats.assists).toBe(0);
    });
  });

  describe("restore()", () => {
    it("should restore a ProfileStats from existing stats", () => {
      const existingStats = {
        numberOfMatches: 10,
        assists: 5,
        shotsOnTarget: 20,
        shotsOffTarget: 10,
        shotsHitPost: 3,
        goalFromInsideBox: 8,
        goalFromOutsideBox: 2,
        ownGoal: 0,
        dribbleSuccess: 15,
        dribbleFailed: 5,
        passCompleted: 100,
        passFailed: 20,
        tackle: 30,
        interception: 15,
        block: 10,
        possessionLost: 20,
        ballRecovery: 25,
        foulCommitted: 5,
        foulSuffered: 3,
        yellowCard: 1,
        redCard: 0,
        penaltyWon: 2,
        penaltyMissed: 1,
        penaltyScored: 2,
        penaltyConceded: 0,
        freeKickScored: 1,
        nutmeg: 3,
        lob: 2,
        save: 0,
        saveInsideBox: 0,
        saveOutsideBox: 0,
        penaltySave: 0,
        goalConceded: 0,
      };

      const stats = require("../values-objects/OutfieldPlayerStats").OutfieldPlayerStats.create(existingStats);
      const profileStats = ProfileStats.restore(userId, stats);

      expect(profileStats.userId).toEqual(userId);
      expect(profileStats.stats.numberOfMatches).toBe(10);
      expect(profileStats.stats.assists).toBe(5);
    });
  });

  describe("addMatchPlayed()", () => {
    it("should increment number of matches", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addMatchPlayed();

      expect(profileStats.stats.numberOfMatches).toBe(1);
    });

    it("should increment multiple times", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addMatchPlayed();
      profileStats.addMatchPlayed();
      profileStats.addMatchPlayed();

      expect(profileStats.stats.numberOfMatches).toBe(3);
    });
  });

  describe("addAssist()", () => {
    it("should increment assists", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addAssist();

      expect(profileStats.stats.assists).toBe(1);
    });
  });

  describe("addShotOnTarget()", () => {
    it("should increment shots on target", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addShotOnTarget();

      expect(profileStats.stats.shotsOnTarget).toBe(1);
    });
  });

  describe("addShotOffTarget()", () => {
    it("should increment shots off target", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addShotOffTarget();

      expect(profileStats.stats.shotsOffTarget).toBe(1);
    });
  });

  describe("addShotHitPost()", () => {
    it("should increment shots hit post", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addShotHitPost();

      expect(profileStats.stats.shotsHitPost).toBe(1);
    });
  });

  describe("addGoalFromInsideBox()", () => {
    it("should increment goals from inside box", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addGoalFromInsideBox();

      expect(profileStats.stats.goalFromInsideBox).toBe(1);
    });
  });

  describe("addGoalFromOutsideBox()", () => {
    it("should increment goals from outside box", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addGoalFromOutsideBox();

      expect(profileStats.stats.goalFromOutsideBox).toBe(1);
    });
  });

  describe("addOwnGoal()", () => {
    it("should increment own goals", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addOwnGoal();

      expect(profileStats.stats.ownGoal).toBe(1);
    });
  });

  describe("addDribbleSuccess()", () => {
    it("should increment dribble successes", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addDribbleSuccess();
      profileStats.addDribbleSuccess();

      expect(profileStats.stats.dribbleSuccess).toBe(2);
    });
  });

  describe("addDribbleFailed()", () => {
    it("should increment dribble failures", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addDribbleFailed();

      expect(profileStats.stats.dribbleFailed).toBe(1);
    });
  });

  describe("addPassCompleted()", () => {
    it("should increment passes completed", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addPassCompleted();

      expect(profileStats.stats.passCompleted).toBe(1);
    });
  });

  describe("addPassFailed()", () => {
    it("should increment passes failed", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addPassFailed();

      expect(profileStats.stats.passFailed).toBe(1);
    });
  });

  describe("addTackle()", () => {
    it("should increment tackles", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addTackle();

      expect(profileStats.stats.tackle).toBe(1);
    });
  });

  describe("addInterception()", () => {
    it("should increment interceptions", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addInterception();

      expect(profileStats.stats.interception).toBe(1);
    });
  });

  describe("addBlock()", () => {
    it("should increment blocks", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addBlock();

      expect(profileStats.stats.block).toBe(1);
    });
  });

  describe("addPossessionLost()", () => {
    it("should increment possession lost", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addPossessionLost();

      expect(profileStats.stats.possessionLost).toBe(1);
    });
  });

  describe("addBallRecovery()", () => {
    it("should increment ball recoveries", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addBallRecovery();

      expect(profileStats.stats.ballRecovery).toBe(1);
    });
  });

  describe("addFoulCommitted()", () => {
    it("should increment fouls committed", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addFoulCommitted();

      expect(profileStats.stats.foulCommitted).toBe(1);
    });
  });

  describe("addFoulSuffered()", () => {
    it("should increment fouls suffered", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addFoulSuffered();

      expect(profileStats.stats.foulSuffered).toBe(1);
    });
  });

  describe("addYellowCard()", () => {
    it("should increment yellow cards", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addYellowCard();

      expect(profileStats.stats.yellowCard).toBe(1);
    });
  });

  describe("addRedCard()", () => {
    it("should increment red cards", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addRedCard();

      expect(profileStats.stats.redCard).toBe(1);
    });
  });

  describe("addPenaltyWon()", () => {
    it("should increment penalties won", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addPenaltyWon();

      expect(profileStats.stats.penaltyWon).toBe(1);
    });
  });

  describe("addPenaltyMissed()", () => {
    it("should increment penalties missed", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addPenaltyMissed();

      expect(profileStats.stats.penaltyMissed).toBe(1);
    });
  });

  describe("addPenaltyScored()", () => {
    it("should increment penalties scored", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addPenaltyScored();

      expect(profileStats.stats.penaltyScored).toBe(1);
    });
  });

  describe("addPenaltyConceded()", () => {
    it("should increment penalties conceded", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addPenaltyConceded();

      expect(profileStats.stats.penaltyConceded).toBe(1);
    });
  });

  describe("addFreeKickScored()", () => {
    it("should increment free kicks scored", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addFreeKickScored();

      expect(profileStats.stats.freeKickScored).toBe(1);
    });
  });

  describe("addNutmeg()", () => {
    it("should increment nutmegs", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addNutmeg();

      expect(profileStats.stats.nutmeg).toBe(1);
    });
  });

  describe("addLob()", () => {
    it("should increment lobs", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addLob();

      expect(profileStats.stats.lob).toBe(1);
    });
  });

  describe("addSave()", () => {
    it("should increment saves", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addSave();

      expect(profileStats.stats.save).toBe(1);
    });
  });

  describe("addSaveInsideBox()", () => {
    it("should increment saves inside box", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addSaveInsideBox();

      expect(profileStats.stats.saveInsideBox).toBe(1);
    });
  });

  describe("addSaveOutsideBox()", () => {
    it("should increment saves outside box", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addSaveOutsideBox();

      expect(profileStats.stats.saveOutsideBox).toBe(1);
    });
  });

  describe("addPenaltySave()", () => {
    it("should increment penalty saves", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addPenaltySave();

      expect(profileStats.stats.penaltySave).toBe(1);
    });
  });

  describe("addGoalConceded()", () => {
    it("should increment goals conceded", () => {
      const profileStats = ProfileStats.create(userId);
      profileStats.addGoalConceded();

      expect(profileStats.stats.goalConceded).toBe(1);
    });
  });

  describe("multiple stat tracking", () => {
    it("should track multiple stats independently", () => {
      const profileStats = ProfileStats.create(userId);

      profileStats.addMatchPlayed();
      profileStats.addAssist();
      profileStats.addAssist();
      profileStats.addGoalFromInsideBox();
      profileStats.addGoalFromInsideBox();
      profileStats.addGoalFromInsideBox();
      profileStats.addDribbleSuccess();

      expect(profileStats.stats.numberOfMatches).toBe(1);
      expect(profileStats.stats.assists).toBe(2);
      expect(profileStats.stats.goalFromInsideBox).toBe(3);
      expect(profileStats.stats.dribbleSuccess).toBe(1);
    });
  });

  describe("userId getter", () => {
    it("should return the user id", () => {
      const profileStats = ProfileStats.create(userId);

      expect(profileStats.userId).toEqual(userId);
    });
  });

  describe("stats getter", () => {
    it("should return the stats object", () => {
      const profileStats = ProfileStats.create(userId);

      expect(profileStats.stats).toBeDefined();
      expect(profileStats.stats.numberOfMatches).toBe(0);
    });
  });
});
