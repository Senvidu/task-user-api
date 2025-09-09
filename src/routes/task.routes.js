import { Router } from "express";
import { createTask, listTasks, getTask, updateTask, deleteTask } from "../controllers/task.controller.js";
import { createTaskValidator, listTaskValidator, updateTaskValidator } from "../validators/task.validators.js";
import { requireAuth, requireRoles } from "../middlewares/auth.js";
import { recordAudit } from "../middlewares/auditLog.js";

const router = Router();

router.use(requireAuth);

router.post("/", requireRoles("admin", "manager"), createTaskValidator, recordAudit("create", "tasks"), createTask);
router.get("/", listTaskValidator, listTasks);
router.get("/:id", getTask);
router.patch("/:id", updateTaskValidator, recordAudit("update", "tasks", (req) => req.params.id), updateTask);
router.delete("/:id", recordAudit("delete", "tasks", (req) => req.params.id), deleteTask);

export default router;
