import { ValueObject } from '@/app/domain/shared/ValueObject';
import { DomainError } from '../../shared/DomainError';

interface GroupIdProps {
  value: string;
}

export class GroupId extends ValueObject<GroupIdProps> {
  private constructor(props: GroupIdProps) {
    super(props);

    if (!props.value) {
      throw new DomainError('GroupIdCannotBeEmpty');
    }
  }

  static create(value: string): GroupId {
    return new GroupId({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
