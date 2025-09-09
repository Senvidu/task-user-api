import mongoose from "mongoose";
import logger from "../utils/logger.js";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI not set");
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { dbName: undefined });
  logger.info("MongoDB connected");
};
