import { ValueObject } from "@/app/domain/shared/ValueObject";
import { DomainError } from "@/app/domain/shared/DomainError";

type StatWeightProps = {
  value: number;
};

export class StatWeight extends ValueObject<StatWeightProps> {
  private constructor(props: StatWeightProps) {
    super(props);
  }

  static create(value: number): StatWeight {
    if (value <= 0) {
      throw new DomainError("WeightMustBePositive");
    }

    return new StatWeight({ value });
  }

  get value(): number {
    return this.props.value;
  }
}