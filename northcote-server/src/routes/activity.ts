import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { addActivityLog, getActivityLogs } from "../controllers/activity.js";
import { checkRole } from "../middleware/checkRole.js";

const activityLogRouter = express.Router();

activityLogRouter.get(
  "/",
  requireAuth,
  checkRole(["admin", "superadmin"]),
  getActivityLogs
);
activityLogRouter.post("/create", requireAuth, addActivityLog);

export default activityLogRouter;