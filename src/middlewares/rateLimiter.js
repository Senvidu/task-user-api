import rateLimit from "express-rate-limit";

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10);
const max = parseInt(process.env.RATE_LIMIT_MAX || "100", 10);

const limiter = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false
});

export default limiter;
