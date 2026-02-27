import { DomainError } from "../../shared/DomainError";
import { ValueObject } from "../../shared/ValueObject";

interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  static create(raw: string): Email {
    if (!raw) {
      throw new DomainError('EmailCannotBeEmpty');
    }

    const normalized = raw.trim().toLowerCase();

    if (!Email.isValid(normalized)) {
      throw new DomainError('InvalidEmailFormat');
    }

    return new Email({ value: normalized });
  }

  private static isValid(email: string): boolean {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  }

  get value(): string {
    return this.props.value;
  }
}
