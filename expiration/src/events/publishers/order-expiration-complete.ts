import { Publisher, ExpirationCompleteEvent, Subjects } from "@wmelotickets/common";

export class OrderExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}