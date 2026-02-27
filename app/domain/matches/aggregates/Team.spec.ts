import { Team } from './Team';
import { TeamId } from '../value-objects/TeamId';
import { Player } from '../entities/Player';
import { PlayerId } from '../value-objects/PlayerId';

describe('Team Aggregate', () => {
  it('should create a team with empty players list', () => {
    const teamId = TeamId.create('team-1');
    const team = Team.create(teamId);

    expect(team.id).toBe(teamId);
    expect(team.players).toEqual([]);
  });

  it('should add a player to the team', () => {
    const team = Team.create(TeamId.create('team-1'));
    const player = Player.create(PlayerId.create('player-1'), 'John Doe');

    team.addPlayer(player);

    expect(team.players).toHaveLength(1);
    expect(team.players[0]).toBe(player);
  });

  it('should add multiple players to the team', () => {
    const team = Team.create(TeamId.create('team-1'));
    const player1 = Player.create(PlayerId.create('player-1'), 'John Doe');
    const player2 = Player.create(PlayerId.create('player-2'), 'Jane Smith');

    team.addPlayer(player1);
    team.addPlayer(player2);

    expect(team.players).toHaveLength(2);
    expect(team.players[0]).toBe(player1);
    expect(team.players[1]).toBe(player2);
  });

  it('should throw error when adding the same player twice', () => {
    const team = Team.create(TeamId.create('team-1'));
    const player = Player.create(PlayerId.create('player-1'), 'John Doe');

    team.addPlayer(player);

    expect(() => team.addPlayer(player)).toThrow('PlayerAlreadyInTeam');
  });

  it('should remove a player from the team', () => {
    const team = Team.create(TeamId.create('team-1'));
    const player = Player.create(PlayerId.create('player-1'), 'John Doe');

    team.addPlayer(player);
    team.removePlayer(player);

    expect(team.players).toHaveLength(0);
  });

  it('should remove the correct player when multiple players exist', () => {
    const team = Team.create(TeamId.create('team-1'));
    const player1 = Player.create(PlayerId.create('player-1'), 'Player 1');
    const player2 = Player.create(PlayerId.create('player-2'), 'Player 2');
    const player3 = Player.create(PlayerId.create('player-3'), 'Player 3');

    team.addPlayer(player1);
    team.addPlayer(player2);
    team.addPlayer(player3);

    team.removePlayer(player2);

    expect(team.players).toHaveLength(2);
    expect(team.players[0]).toBe(player1);
    expect(team.players[1]).toBe(player3);
  });

  it('should throw error when removing a player not in the team', () => {
    const team = Team.create(TeamId.create('team-1'));
    const player1 = Player.create(PlayerId.create('player-1'), 'John Doe');
    const player2 = Player.create(PlayerId.create('player-2'), 'Jane Smith');

    team.addPlayer(player1);

    expect(() => team.removePlayer(player2)).toThrow('PlayerNotFoundInTeam');
  });

  it('should consider two teams with same id as equal', () => {
    const teamId = TeamId.create('team-1');
    const team1 = Team.create(teamId);
    const team2 = Team.create(teamId);

    expect(team1.equals(team2)).toBe(true);
  });

  it('should consider two teams with different ids as not equal', () => {
    const team1 = Team.create(TeamId.create('team-1'));
    const team2 = Team.create(TeamId.create('team-2'));

    expect(team1.equals(team2)).toBe(false);
  });
});
