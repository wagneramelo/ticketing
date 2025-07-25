import { Message } from "node-nats-streaming";
import { Listener, TicketCreatedEvent, Subjects } from "@wmelotickets/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;

    // Create and save the ticket
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();

    // Acknowledge the message
    msg.ack();
  }
}
