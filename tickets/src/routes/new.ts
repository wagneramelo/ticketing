import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@wmelotickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket"; // Assuming you have a Ticket model
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper"; // Assuming you have a NATS client set up
const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be a positive number"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id, // Assuming you have currentUser set by requireAuth middleware
    });

    await ticket.save();
    // Here you would typically save the ticket to a database
    // For now, we'll just return a success response

    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      version: ticket.version, // Added version for optimistic concurrency control
      userId: ticket.userId,
    });

    res.status(201).send({
      message: "Ticket created successfully",
      ticket,
    });
  }
);

export { router as createTicketRouter };
