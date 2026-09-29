import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { checkRole } from "../middleware/checkRole.js";
import {
  createInspection,
  getProjectInspections,
  updateInspection,
} from "../controllers/siteInspection.js";

const inspectionRouter = Router();

inspectionRouter.post(
  "/",
  requireAuth,
  checkRole(["admin", "superadmin", "project_manager", "supervisor"]),
  createInspection
);

inspectionRouter.get(
  "/project/:projectId",
  requireAuth,
  checkRole(["admin", "superadmin", "project_manager", "supervisor", "engineer"]),
  getProjectInspections
);

inspectionRouter.put(
  "/:id",
  requireAuth,
  checkRole(["admin", "superadmin", "project_manager", "supervisor"]),
  updateInspection
);

export default inspectionRouter;