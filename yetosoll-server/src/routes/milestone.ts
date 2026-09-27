import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { checkRole } from "../middleware/checkRole.js";
import { updateMilestone, deleteMilestone } from "../controllers/milestone.js";

const milestoneRouter = Router();

milestoneRouter.put(
  "/:id",
  requireAuth,
  checkRole(["admin", "superadmin", "project_manager"]),
  updateMilestone
);
milestoneRouter.delete(
  "/:id",
  requireAuth,
  checkRole(["admin", "superadmin", "project_manager"]),
  deleteMilestone
);

export default milestoneRouter;