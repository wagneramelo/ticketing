import request from "supertest";
import { app } from "../app";

const signIn = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get("Set-Cookie");
  return cookie;
};

export { signIn };
