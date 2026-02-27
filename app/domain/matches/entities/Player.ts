import { Entity } from "@/app/domain/shared/Entity";
import { PlayerId } from "@/app/domain/matches/value-objects/PlayerId";
import { PlayerScore } from "@/app/domain/matches/value-objects/PlayerScore";
import { PlayerPosition, PlayerPresenceInMatch } from "@/app/domain/matches/enum/Player";

interface PlayerProps {
  id: PlayerId;
  name: string;
  rating: PlayerScore;
  position?: PlayerPosition;
  presence: PlayerPresenceInMatch;
}

export class Player extends Entity<PlayerId> {

  private props: PlayerProps;

  private constructor(props: PlayerProps) {
    super(props.id);
    this.props = props;
  }

  static create(id: PlayerId, name: string, position?: PlayerPosition): Player {
    return new Player({
      id,
      name,
      rating: PlayerScore.initial(),
      position,
      presence: PlayerPresenceInMatch.STARTER,
    });
  }

  get name(): string {
    return this.props.name;
  }

  get rating(): PlayerScore {
    return this.props.rating;
  }

  get position(): PlayerPosition | undefined {
    return this.props.position;
  }

  get presence(): PlayerPresenceInMatch {
    return this.props.presence;
  }

  updateScore(newScore: PlayerScore): void {
    this.props.rating = newScore;
  }

  changePresence(presence: PlayerPresenceInMatch): void {
    this.props.presence = presence;
  }

}