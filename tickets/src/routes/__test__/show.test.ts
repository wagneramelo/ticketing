import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

it("returns a 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .get(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send();

  expect(response.status).toEqual(404);
});

it("returns the ticket if it is found", async () => {
  const ticket = Ticket.build({
    title: "Concert",
    price: 20,
    userId: "12345",
  });
  await ticket.save();

  const response = await request(app)
    .get(`/api/tickets/${ticket.id}`)
    .set("Cookie", global.signin())
    .send();

  expect(response.status).toEqual(200);
  expect(response.body.title).toEqual(ticket.title);
  expect(response.body.price).toEqual(ticket.price);
});
