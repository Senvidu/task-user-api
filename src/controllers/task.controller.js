import { validationResult } from "express-validator";
import Task from "../models/Task.js";
import asyncHandler from "../utils/asyncHandler.js";
import { StatusCodes } from "http-status-codes";

export const createTask = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  const task = await Task.create(req.body);
  res.status(StatusCodes.CREATED).json(task);
});

export const listTasks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, assignedTo, sort = "deadline" } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (assignedTo) filter.assignedTo = assignedTo;
  // if normal user, restrict to own tasks
  const user = res.locals.user;
  if (user?.role === "user") {
    filter.assignedTo = user.id;
  }
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [items, total] = await Promise.all([
    Task.find(filter).skip(skip).limit(parseInt(limit)).sort(sort).lean(),
    Task.countDocuments(filter)
  ]);
  res.json({ items, page: parseInt(page), limit: parseInt(limit), total });
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).lean();
  if (!task) return res.status(StatusCodes.NOT_FOUND).json({ message: "Not found" });
  const user = res.locals.user;
  if (user?.role === "user" && task.assignedTo?.toString() !== user.id) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: "Forbidden" });
  }
  res.json(task);
});

export const updateTask = asyncHandler(async (req, res) => {
  const user = res.locals.user;
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(StatusCodes.NOT_FOUND).json({ message: "Not found" });
  if (user?.role === "user" && task.assignedTo?.toString() !== user.id) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: "Forbidden" });
  }
  Object.assign(task, req.body);
  await task.save();
  res.json(task);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const user = res.locals.user;
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(StatusCodes.NOT_FOUND).json({ message: "Not found" });
  if (user?.role === "user" && task.assignedTo?.toString() !== user.id) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: "Forbidden" });
  }
  await task.deleteOne();
  res.json({ message: "Deleted" });
});
