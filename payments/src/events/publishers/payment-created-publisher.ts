import { Subjects, Publisher, PaymentCreatedEvent } from "@wmelotickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;

}