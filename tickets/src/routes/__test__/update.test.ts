import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

it("returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "Concert",
      price: 20,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "Concert",
      price: 20,
    })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "Concert",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.ticket.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "Updated Concert",
      price: 25,
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "Concert",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.ticket.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${response.body.ticket.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Updated Concert",
      price: -10,
    })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "Concert",
      price: 20,
    });

  const updatedTitle = "Updated Concert";
  const updatedPrice = 25;

  await request(app)
    .put(`/api/tickets/${response.body.ticket.id}`)
    .set("Cookie", cookie)
    .send({
      title: updatedTitle,
      price: updatedPrice,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.ticket.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(updatedTitle);
  expect(ticketResponse.body.price).toEqual(updatedPrice);
});

it("publishes an event", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "Concert",
      price: 20,
    });

  const updatedTitle = "Updated Concert";
  const updatedPrice = 25;

  await request(app)
    .put(`/api/tickets/${response.body.ticket.id}`)
    .set("Cookie", cookie)
    .send({
      title: updatedTitle,
      price: updatedPrice,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("returns a 400 if the ticket is reserved", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "Concert",
      price: 20,
    });

  var ticket = await Ticket.findById(response.body.ticket.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.ticket.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Updated Concert",
      price: 25,
    })
    .expect(400);
}); 