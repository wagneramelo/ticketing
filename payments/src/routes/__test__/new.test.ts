import { OrderStatus } from "@wmelotickets/common";
import { Order } from "../../models/order";
import { app } from "../../app";
import request from "supertest";
import mongoose from "mongoose";
import { stripe } from "../../stripe";

jest.mock("../../stripe");

it("returns an error if the order does not exist", async () => {
    const response = await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin())
        .send({
            token: "dsadsasd",
            orderId: new mongoose.Types.ObjectId().toHexString(),
        });

    expect(response.status).toEqual(404);
});

it("returns an error if the order does not belong to the user", async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        version: 0,
        price: 10
    });

    await order.save();

    await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
        token: "asdadsasads",
        orderId: order.id
    })
    .expect(401)
});

it("returns a 400 when purchasing a cancelled order", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        status: OrderStatus.Cancelled,
        version: 0,
        price: 10
    });

    order.save();

    await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
        token: "asdadsasads",
        orderId: order.id
    })
    .expect(400)

})

it("returns a 204 with valid inputs", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        status: OrderStatus.Created,
        version: 0,
        price: 10
    });

    order.save();

    await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
        token: 'tok_visa',
        orderId: order.id
    })
    .expect(201);

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    expect(chargeOptions.source).toEqual('tok_visa')
    expect(chargeOptions.amount).toEqual(20 * 100);
    expect(chargeOptions.currency).toEqual('usd');


})