import { validationResult } from "express-validator";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";

export const createUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(StatusCodes.CONFLICT).json({ message: "Email already used" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role });
  res.status(StatusCodes.CREATED).json({ id: user._id, name: user.name, email: user.email, role: user.role });
});

export const listUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, role, active } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (active !== undefined) filter.isActive = active === "true";
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [items, total] = await Promise.all([
    User.find(filter).skip(skip).limit(parseInt(limit)).select("-passwordHash").lean(),
    User.countDocuments(filter)
  ]);
  res.json({ items, page: parseInt(page), limit: parseInt(limit), total });
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash").lean();
  if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: "Not found" });
  res.json(user);
});

export const updateUser = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  if (updates.password) {
    updates.passwordHash = await bcrypt.hash(updates.password, 10);
    delete updates.password;
  }
  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-passwordHash").lean();
  if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: "Not found" });
  res.json(user);
});

export const softDeleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }).select("-passwordHash").lean();
  if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: "Not found" });
  res.json({ message: "User deactivated" });
});
