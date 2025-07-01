import { Publisher, Subjects, TicketUpdatedEvent } from "@wmelotickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;

  // No additional methods or properties are needed here, as the Publisher class handles the publishing logic.
}
