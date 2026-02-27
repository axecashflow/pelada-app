import { DomainEvent } from "@/app/domain/shared/DomainEvent";
import { DomainEventDispatcher } from "./DomainEventDispatcher";
import { DomainEventHandler } from "@/app/domain/shared/DomainEventHandler";

class FakeEvent implements DomainEvent {
  eventName = 'fake.event';
  occurredOn = new Date();
}

describe('DomainEventDispatcher', () => {
  it('should dispatch event to registered handler', async () => {
    const dispatcher = new DomainEventDispatcher();

    const handler: DomainEventHandler<FakeEvent> = {
      eventName: 'fake.event',
      handle: jest.fn(),
    };

    dispatcher.register(handler);

    await dispatcher.dispatch([new FakeEvent()]);

    expect(handler.handle).toHaveBeenCalledTimes(1);
  });
});
