import { DomainEvent } from '@/app/domain/shared/DomainEvent';

export interface DomainEventHandler<
  T extends DomainEvent = DomainEvent
> {
  readonly eventName: string;
  handle(event: T): Promise<void> | void;
}
