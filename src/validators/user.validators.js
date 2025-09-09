import { body, param, query } from "express-validator";

export const createUserValidator = [
  body("name").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("role").isIn(["admin", "manager", "user"])
];

export const updateUserValidator = [
  param("id").isMongoId(),
  body("name").optional().notEmpty(),
  body("email").optional().isEmail(),
  body("password").optional().isLength({ min: 6 }),
  body("role").optional().isIn(["admin", "manager", "user"]),
  body("isActive").optional().isBoolean()
];

export const listUsersValidator = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("role").optional().isIn(["admin", "manager", "user"]),
  query("active").optional().isBoolean()
];
