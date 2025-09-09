import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";

export const attachUserIfPresent = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith("Bearer ")) {
      const token = auth.split(" ")[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.sub).lean();
      if (user && user.isActive) {
        res.locals.user = { id: user._id.toString(), role: user.role, name: user.name, email: user.email };
      }
    }
  } catch (e) {
    // ignore invalid token here; only strict routes will block
  } finally {
    next();
  }
};

export const requireAuth = (req, res, next) => {
  const user = res.locals.user;
  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
  }
  next();
};

export const requireRoles = (...roles) => {
  return (req, res, next) => {
    const user = res.locals.user;
    if (!user || !roles.includes(user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Forbidden" });
    }
    next();
  };
};
