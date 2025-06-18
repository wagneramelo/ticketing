import express from "express";
import { body } from "express-validator";
import { Request, Response } from "express";
import { validateRequest } from "@wmelotickets/common/build/middlewares/validate-request";
import { User } from "../../models/user";
import { BadRequestError } from "@wmelotickets/common/build/errors/bad-request-error";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }
    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    const token = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY!
    ); // Use JWT_KEY from environment variables

    req.session = {
      jwt: token, // Store JWT in session
    };
    res.status(200).send({ existingUser });
  }
);

export { router as signinRouter };
