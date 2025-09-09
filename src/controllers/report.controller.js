import Task from "../models/Task.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

export const taskStatus = asyncHandler(async (req, res) => {
  const agg = await Task.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $project: { _id: 0, status: "$_id", count: 1 } }
  ]);
  res.json(agg);
});

export const userPerformance = asyncHandler(async (req, res) => {
  const agg = await Task.aggregate([
    { $match: { status: "completed" } },
    { $group: { _id: "$assignedTo", completed: { $sum: 1 } } },
    { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
    { $unwind: "$user" },
    { $project: { userId: "$user._id", name: "$user.name", email: "$user.email", completed: 1, _id: 0 } }
  ]);
  res.json(agg);
});
