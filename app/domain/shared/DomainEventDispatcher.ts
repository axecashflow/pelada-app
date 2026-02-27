import { DomainEvent } from '@/app/domain/shared/DomainEvent';
import { DomainEventHandler } from '@/app/domain/shared/DomainEventHandler';

export class DomainEventDispatcher {
  private handlers: DomainEventHandler[] = [];

  register(handler: DomainEventHandler): void {
    this.handlers.push(handler);
  }

  async dispatch(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      const handlers = this.handlers.filter(
        h => h.eventName === event.eventName
      );

      for (const handler of handlers) {
        await handler.handle(event);
      }
    }
  }
}
