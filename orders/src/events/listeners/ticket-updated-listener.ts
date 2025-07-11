import { Message } from "node-nats-streaming";
import { Listener, TicketUpdatedEvent, Subjects } from "@wmelotickets/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { id, title, price } = data;

    // Find the ticket that the event is describing
    const ticket = await Ticket.findOne({
      _id: id,
      version: data.version - 1, // Ensure we are working with the correct version
    });

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Update the ticket with the new data
    ticket.set({ title, price });
    await ticket.save();

    // Acknowledge the message
    msg.ack();
  }
}
