import { ValueObject } from "@/app/domain/shared/ValueObject";
import { GameModeEnum } from "@/app/domain/group/enum/GameMode";
import { DomainError } from "../../shared/DomainError";

interface GameModeProps {
  type: GameModeEnum;
  playersPerTeam: number;
}

export class GameMode extends ValueObject<GameModeProps> {
  private constructor(props: GameModeProps) {
    super(props);
    this.validate(props);
  }

  static create(params: {
    type: GameModeEnum;
    playersPerTeam: number;
  }): GameMode {
    return new GameMode(params);
  }

  private validate(props: GameModeProps): void {
    if (props.playersPerTeam <= 0) {
      throw new DomainError('NumberOfTeamsMustBeGreaterThanZero');
    }
  }

  get type(): GameModeEnum {
    return this.props.type;
  }

  get playersPerTeam(): number {
    return this.props.playersPerTeam;
  }

}
