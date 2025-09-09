import { body, param, query } from "express-validator";

export const createTaskValidator = [
  body("title").notEmpty(),
  body("description").optional().isString(),
  body("deadline").optional().isISO8601(),
  body("status").optional().isIn(["pending", "in-progress", "completed"]),
  body("assignedTo").optional().isMongoId()
];

export const updateTaskValidator = [
  param("id").isMongoId(),
  body("title").optional().notEmpty(),
  body("description").optional().isString(),
  body("deadline").optional().isISO8601(),
  body("status").optional().isIn(["pending", "in-progress", "completed"]),
  body("assignedTo").optional().isMongoId()
];

export const listTaskValidator = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("status").optional().isIn(["pending", "in-progress", "completed"]),
  query("assignedTo").optional().isMongoId(),
  query("sort").optional().isString()
];
