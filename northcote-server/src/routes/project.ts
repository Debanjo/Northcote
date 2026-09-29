import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { checkRole } from "../middleware/checkRole.js";
import {
  getClientProject,
  createProject,
  updateProjectProgress,
} from "../controllers/project.js";
import {
  getProjectMilestones,
  createMilestone,
} from "../controllers/milestone.js";
import {
  getProjectDocuments,
  createDocument,
} from "../controllers/document.js";
import Project from "../models/Project.js";

const projectRouter = Router();

projectRouter.get(
  "/all",
  requireAuth,
  checkRole(["admin", "superadmin", "project_manager", "supervisor", "client"]),
  async (req, res) => {
    try {
      const currentUser = (req as any).user;
      // Clients only ever see their own projects; staff/admin tiers see everything.
      const filter = currentUser.role === "client" ? { clientId: currentUser.id } : {};
      // No pagination query params yet (the frontend expects a plain array) —
      // this cap is just a DoS backstop until real pagination is added here.
      const projects = await Project.find(filter).sort({ createdAt: -1 }).limit(500);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching all projects:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

projectRouter.get(
  "/client/:clientId",
  requireAuth,
  checkRole(["client", "admin", "superadmin", "project_manager", "supervisor"]),
  getClientProject
);

projectRouter.post(
  "/",
  requireAuth,
  checkRole(["admin", "superadmin", "project_manager"]),
  createProject
);

projectRouter.put(
  "/:id/progress",
  requireAuth,
  checkRole(["admin", "superadmin", "project_manager", "supervisor"]),
  updateProjectProgress
);

projectRouter.get(
  "/:projectId/milestones",
  requireAuth,
  checkRole(["client", "admin", "superadmin", "project_manager", "supervisor"]),
  getProjectMilestones
);
projectRouter.post(
  "/:projectId/milestones",
  requireAuth,
  checkRole(["admin", "superadmin", "project_manager"]),
  createMilestone
);

projectRouter.get(
  "/:projectId/documents",
  requireAuth,
  checkRole(["client", "admin", "superadmin", "project_manager", "supervisor"]),
  getProjectDocuments
);
projectRouter.post(
  "/:projectId/documents",
  requireAuth,
  checkRole(["admin", "superadmin", "project_manager"]),
  createDocument
);

export default projectRouter;