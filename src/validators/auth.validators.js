import { body } from "express-validator";

export const registerValidator = [
  body("name").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("role").optional().isIn(["admin", "manager", "user"])
];

export const loginValidator = [body("email").isEmail(), body("password").notEmpty()];
