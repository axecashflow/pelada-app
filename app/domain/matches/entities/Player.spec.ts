import { Player } from './Player';
import { PlayerId } from '../value-objects/PlayerId';
import { PlayerScore } from '../value-objects/PlayerScore';
import { PlayerPosition, PlayerPresenceInMatch } from '../enum/Player';

describe('Player Entity', () => {
  it('should create a player with initial rating and starter presence', () => {
    const playerId = PlayerId.create('player-1');
    const player = Player.create(playerId, 'John Doe');

    expect(player.id).toBe(playerId);
    expect(player.name).toBe('John Doe');
    expect(player.rating.score).toBe(6);
    expect(player.presence).toBe(PlayerPresenceInMatch.STARTER);
    expect(player.position).toBeUndefined();
  });

  it('should create a player with a position', () => {
    const playerId = PlayerId.create('player-1');
    const player = Player.create(playerId, 'John Doe', PlayerPosition.FORWARD);

    expect(player.position).toBe(PlayerPosition.FORWARD);
    expect(player.presence).toBe(PlayerPresenceInMatch.STARTER);
  });

  it('should update player rating', () => {
    const playerId = PlayerId.create('player-1');
    const player = Player.create(playerId, 'John Doe');

    const newScore = PlayerScore.create(8.5);
    player.updateScore(newScore);

    expect(player.rating.score).toBe(8.5);
  });

  it('should allow multiple rating updates', () => {
    const playerId = PlayerId.create('player-1');
    const player = Player.create(playerId, 'John Doe');

    player.updateScore(PlayerScore.create(7.0));
    expect(player.rating.score).toBe(7.0);

    player.updateScore(PlayerScore.create(9.5));
    expect(player.rating.score).toBe(9.5);
  });

  it('should update player presence', () => {
    const playerId = PlayerId.create('player-1');
    const player = Player.create(playerId, 'John Doe');

    expect(player.presence).toBe(PlayerPresenceInMatch.STARTER);

    player.changePresence(PlayerPresenceInMatch.SUBSTITUTED_OUT);
    expect(player.presence).toBe(PlayerPresenceInMatch.SUBSTITUTED_OUT);
  });

  it('should change presence from substitute to starter', () => {
    const playerId = PlayerId.create('player-1');
    const player = Player.create(playerId, 'John Doe');

    player.changePresence(PlayerPresenceInMatch.SUBSTITUTED_IN);
    expect(player.presence).toBe(PlayerPresenceInMatch.SUBSTITUTED_IN);

    player.changePresence(PlayerPresenceInMatch.STARTER);
    expect(player.presence).toBe(PlayerPresenceInMatch.STARTER);
  });

  it('should consider two players with same id as equal', () => {
    const playerId = PlayerId.create('player-1');
    const player1 = Player.create(playerId, 'John Doe');
    const player2 = Player.create(playerId, 'Jane Smith');

    expect(player1.equals(player2)).toBe(true);
  });

  it('should consider two players with different ids as not equal', () => {
    const player1 = Player.create(PlayerId.create('player-1'), 'John Doe');
    const player2 = Player.create(PlayerId.create('player-2'), 'Jane Smith');

    expect(player1.equals(player2)).toBe(false);
  });
});
