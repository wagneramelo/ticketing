import { Listener, OrderCreatedEvent, Subjects } from "@wmelotickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const { id, userId, status, version, ticket } = data;

        const order = Order.build({
            id,
            price: ticket.price,
            status,
            userId,
            version,
        });

        await order.save();

        msg.ack();
    }
}