import { Router } from "express";
import { createUser, listUsers, getUser, updateUser, softDeleteUser } from "../controllers/user.controller.js";
import { createUserValidator, listUsersValidator, updateUserValidator } from "../validators/user.validators.js";
import { requireAuth, requireRoles } from "../middlewares/auth.js";
import { recordAudit } from "../middlewares/auditLog.js";

const router = Router();

router.use(requireAuth, requireRoles("admin", "manager"));

router.post("/", createUserValidator, recordAudit("create", "users", (req) => null), createUser);
router.get("/", listUsersValidator, listUsers);
router.get("/:id", getUser);
router.patch("/:id", updateUserValidator, recordAudit("update", "users", (req) => req.params.id), updateUser);
router.delete("/:id", recordAudit("soft-delete", "users", (req) => req.params.id), softDeleteUser);

export default router;
