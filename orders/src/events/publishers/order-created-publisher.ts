import { Publisher, OrderCreatedEvent, Subjects } from "@wmelotickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
