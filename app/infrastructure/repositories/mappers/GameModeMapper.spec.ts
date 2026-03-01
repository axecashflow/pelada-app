import { GameModeMapper } from './GameModeMapper';
import { GameMode } from '@/app/domain/group/value-objects/GameMode';
import { GameModeEnum } from '@/app/domain/group/enum/GameMode';

describe('GameModeMapper', () => {
  it('should map between domain and persistence', () => {
    const domain = GameMode.create({ type: GameModeEnum.FIXED_TEAMS, playersPerTeam: 5 });
    const persisted = GameModeMapper.toPersistence(domain);
    expect(persisted.type).toBe(domain.type);

    const back = GameModeMapper.toDomain(persisted);
    expect(back.type).toBe(domain.type);
    expect(back.maxMembers).toBe(domain.maxMembers);
  });
});
