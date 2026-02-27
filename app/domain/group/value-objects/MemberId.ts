import { ValueObject } from '@/app/domain/shared/ValueObject';
import { DomainError } from '../../shared/DomainError';

interface MemberIdProps {
  value: string;
}

export class MemberId extends ValueObject<MemberIdProps> {
  private constructor(props: MemberIdProps) {
    super(props);

    if (!props.value) {
      throw new DomainError('MemberIdCannotBeEmpty');
    }
  }

  static create(value: string): MemberId {
    return new MemberId({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
