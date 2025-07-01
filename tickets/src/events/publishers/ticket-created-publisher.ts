import { Publisher, Subjects, TicketCreatedEvent } from "@wmelotickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;

  // No additional methods or properties are needed here, as the Publisher class handles the publishing logic.
}
