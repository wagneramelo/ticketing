import { Subjects, Publisher, OrderCancelledEvent } from "@wmelotickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
