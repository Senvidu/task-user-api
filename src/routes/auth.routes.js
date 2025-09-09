import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/auth.validators.js";
import { recordAudit } from "../middlewares/auditLog.js";

const router = Router();

router.post("/register", registerValidator, recordAudit("register", "users"), register);
router.post("/login", loginValidator, recordAudit("login", "users"), login);

export default router;
