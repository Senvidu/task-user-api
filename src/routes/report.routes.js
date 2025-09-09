import { Router } from "express";
import { taskStatus, userPerformance } from "../controllers/report.controller.js";
import { requireAuth, requireRoles } from "../middlewares/auth.js";

const router = Router();

router.use(requireAuth, requireRoles("admin", "manager"));

router.get("/task-status", taskStatus);
router.get("/user-performance", userPerformance);

export default router;
