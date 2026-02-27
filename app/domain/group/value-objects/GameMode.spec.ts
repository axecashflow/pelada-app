import { GameMode } from './GameMode';
import { GameModeEnum } from '@/app/domain/group/enum/GameMode';

describe('GameMode Value Object', () => {
  describe('ROTATION mode', () => {
    it('should create a valid rotation game mode', () => {
      const gameMode = GameMode.create({
        playersPerTeam: 5,
        type: GameModeEnum.ROTATION,
      });

      expect(gameMode.type).toBe(GameModeEnum.ROTATION);
      expect(gameMode.playersPerTeam).toBe(5);
    });
  });

  describe('FIXED_TEAMS mode', () => {
    it('should create a valid fixed teams game mode with substitutes', () => {
      const gameMode = GameMode.create({
        playersPerTeam: 5,
        type: GameModeEnum.FIXED_TEAMS,
      });

      expect(gameMode.type).toBe(GameModeEnum.FIXED_TEAMS);
      expect(gameMode.playersPerTeam).toBe(5);
    });
  });

  describe('Common validations', () => {
    it('should throw error if players per team is zero or negative', () => {
      expect(() =>
        GameMode.create({
          playersPerTeam: 0,
          type: GameModeEnum.FIXED_TEAMS,
        }),
      ).toThrow('NumberOfTeamsMustBeGreaterThanZero');
    });
  });
});
