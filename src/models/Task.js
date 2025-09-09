import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    deadline: { type: Date },
    status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);
export default Task;
