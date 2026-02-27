import { ValueObject } from "@/app/domain/shared/ValueObject";
import { DomainError } from "@/app/domain/shared/DomainError";

import { ImpactEnum, StatTypeEnum } from "../enum/Stats";
import { PlayerId } from "./PlayerId";
import { StatWeight } from "./StatWeight";

type MatchStatProps = {
  playerId: PlayerId;
  type: StatTypeEnum;
  value: number;
  weight: StatWeight;
  impact: ImpactEnum;
};

export class MatchStat extends ValueObject<MatchStatProps> {
  private constructor(props: MatchStatProps) {
    super(props);
  }

  static create(props: MatchStatProps): MatchStat {
    if (props.value <= 0) {
      throw new DomainError("StatValueMustBePositive");
    }

    return new MatchStat(props);
  }

  calculateImpact(): number {
    return (
      this.props.value *
      this.props.weight.value *
      this.props.impact
    );
  }

  get playerId(): PlayerId {
    return this.props.playerId;
  }

  get type(): StatTypeEnum {
    return this.props.type;
  }

  get value(): number {
    return this.props.value;
  }

  get weight(): StatWeight {
    return this.props.weight;
  }

  get impact(): ImpactEnum {
    return this.props.impact;
  }
}