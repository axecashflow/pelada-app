import { ValueObject } from "@/app/domain/shared/ValueObject";
import { DomainError } from "@/app/domain/shared/DomainError";

interface TeamIdProps {
  value: string;
}

export class TeamId extends ValueObject<TeamIdProps> {
  private constructor(props: TeamIdProps) {
    super(props);

    if (!props.value) {
      throw new DomainError('TeamIdCannotBeEmpty');
    }
  }

  static create(value: string): TeamId {
    return new TeamId({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
