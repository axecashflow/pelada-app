import { DomainError } from "../../shared/DomainError";
import { ValueObject } from "../../shared/ValueObject";

interface PasswordProps {
  value: string;
}

export class Password extends ValueObject<PasswordProps> {
  private constructor(props: PasswordProps) {
    super(props);
  }

  static create(raw: string): Password {
    if (!raw) {
      throw new DomainError('PasswordCannotBeEmpty');
    }

    if (raw.length < 8) {
      throw new DomainError('PasswordTooShort');
    }

    if (!Password.hasNumber(raw)) {
      throw new DomainError('PasswordMustContainNumber');
    }

    if (!Password.hasSpecialCharacter(raw)) {
      throw new DomainError('PasswordMustContainSpecialCharacter');
    }

    return new Password({ value: raw });
  }

  private static hasNumber(value: string): boolean {
    return /\d/.test(value);
  }

  private static hasSpecialCharacter(value: string): boolean {
    return /[!@#$%^&*(),.?":{}|<>_\-\\[\]\\/+=~`]/.test(value);
  }

  get value(): string {
    return this.props.value;
  }
}
