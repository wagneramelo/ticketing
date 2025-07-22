import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket"; // Assuming you have a Ticket model
const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  const tickets = await Ticket.find({ orderId: undefined }); // Fetch all tickets from the database
  res.send(tickets); // Send the list of tickets as the response
});

export { router as indexTicketRouter };
