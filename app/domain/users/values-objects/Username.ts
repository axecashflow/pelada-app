import { DomainError } from "../../shared/DomainError";
import { ValueObject } from "../../shared/ValueObject";

interface UsernameProps {
  value: string;
}

export class Username extends ValueObject<UsernameProps> {
  private constructor(props: UsernameProps) {
    super(props);
  }

  static create(value: string): Username {
    const normalized = value?.trim();

    if (!normalized) {
      throw new DomainError('UsernameCannotBeEmpty');
    }

    if (normalized.length < 3 || normalized.length > 30) {
      throw new DomainError('UsernameInvalidLength');
    }

    const validCharactersRegex = /^[a-zA-Z0-9._]+$/;
    if (!validCharactersRegex.test(normalized)) {
      throw new DomainError('UsernameInvalidCharacters');
    }

    if (normalized.startsWith('.') || normalized.endsWith('.')) {
      throw new DomainError('UsernameCannotStartOrEndWithDot');
    }

    if (normalized.includes('..')) {
      throw new DomainError('UsernameCannotContainConsecutiveDots');
    }

    return new Username({ value: normalized });
  }

  get value(): string {
    return this.props.value;
  }
}