import { ValueObject } from "@/app/domain/shared/ValueObject";
import { DomainError } from "@/app/domain/shared/DomainError";

interface MatchIdProps {
  value: string;
}

export class MatchId extends ValueObject<MatchIdProps> {
  private constructor(props: MatchIdProps) {
    super(props);

    if (!props.value) {
      throw new DomainError('MatchIdCannotBeEmpty');
    }
  }

  static create(value: string): MatchId {
    return new MatchId({ value });
  }

  get value(): string {
    return this.props.value;
  }
}