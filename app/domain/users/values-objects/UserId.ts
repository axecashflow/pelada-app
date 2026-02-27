import { DomainError } from "../../shared/DomainError";
import { ValueObject } from "../../shared/ValueObject";

interface UserIdProps {
  value: string;
}

export class UserId extends ValueObject<UserIdProps> {
  private constructor(props: UserIdProps) {
    super(props);

    if (!props.value) {
      throw new DomainError('UserIdCannotBeEmpty');
    }
  }

  static create(value: string): UserId {
    return new UserId({ value });
  }

  get value(): string {
    return this.props.value;
  }
}