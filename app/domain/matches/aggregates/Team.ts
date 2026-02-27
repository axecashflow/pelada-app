import { Entity } from "@/app/domain/shared/Entity";
import { TeamId } from "@/app/domain/matches/value-objects/TeamId";
import { Player } from "@/app/domain/matches/entities/Player";
import { DomainError } from "@/app/domain/shared/DomainError";

interface TeamProps {
  players: Player[];
}

export class Team extends Entity<TeamId> {
  
  private props: TeamProps;

  private constructor(id: TeamId, props: TeamProps) {
    super(id);
    this.props = props;
  }

  static create(id: TeamId): Team {
    return new Team(id, { players: [] });
  }

  get players(): Player[] {
    return this.props.players;
  }

  private findPlayerInTeam(player: Player): Player | undefined {
    return this.props.players.find(p => p.equals(player));
  }

  addPlayer(player: Player): void {
    if(this.findPlayerInTeam(player)) {
      throw new DomainError('PlayerAlreadyInTeam');
    }

    this.props.players.push(player);
  }

  removePlayer(player: Player): void {
    const isPlayerInTeam = this.findPlayerInTeam(player);

    if (!isPlayerInTeam) {
      throw new DomainError('PlayerNotFoundInTeam');
    }

    this.props.players = this.props.players.filter(p => !p.equals(player));
  }
  
}