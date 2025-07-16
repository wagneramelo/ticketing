import { OrderCancelledEvent, OrderStatus } from "@wmelotickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Order } from "../../../models/order";
import mongoose from "mongoose";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 10,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
    });

    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        ticket: {
            id: "sdsad"
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }

    return { listener, data, msg };
}

it("updates the order status to cancelled", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(data.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
})

it("acks the message", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})
