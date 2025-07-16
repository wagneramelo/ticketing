import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@wmelotickets/common";
import { createChargeRouter } from "./routes/new";


const app = express();

app.use(express.json());
app.set("trust proxy", true); // trust first proxy
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test", // Set to true in production
  })
);

app.use(currentUser);

app.use(createChargeRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
