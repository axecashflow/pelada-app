import { ValueObject } from "@/app/domain/shared/ValueObject";
import { DomainError } from "@/app/domain/shared/DomainError";

interface PlayerIdProps {
  value: string;
}

export class PlayerId extends ValueObject<PlayerIdProps> {
  private constructor(props: PlayerIdProps) {
    super(props);

    if (!props.value) {
      throw new DomainError('PlayerIdCannotBeEmpty');
    }
  }

  static create(value: string): PlayerId {
    return new PlayerId({ value });
  }

  get value(): string {
    return this.props.value;
  }
}