import request from "supertest";
import { app } from "../../app";

it("can fetch a list of tickets", async () => {
  // Create three tickets
  await request(app).post("/api/tickets").set("Cookie", global.signin()).send({
    title: "Concert",
    price: 20,
  });

  await request(app).post("/api/tickets").set("Cookie", global.signin()).send({
    title: "Play",
    price: 30,
  });
  await request(app).post("/api/tickets").set("Cookie", global.signin()).send({
    title: "Movie",
    price: 15,
  });

  // Fetch the list of tickets
  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});
