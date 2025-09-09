import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import logger from "./src/utils/logger.js";

const PORT = process.env.PORT || 8080;

const start = async () => {
  try {
    await connectDB();
    const server = http.createServer(app);
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

start();
