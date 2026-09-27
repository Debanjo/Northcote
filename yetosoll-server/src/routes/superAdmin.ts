import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireSuperAdmin } from "../middleware/superAdmin.js";
import {
  getSystemAnalytics,
  getAllUsersExtended,
  impersonateUser,
  getSystemHealth,
} from "../controllers/superAdmin.js";

const superAdminRouter = Router();

// All routes require super admin
superAdminRouter.use(requireAuth, requireSuperAdmin);

superAdminRouter.get("/analytics", getSystemAnalytics);
superAdminRouter.get("/users", getAllUsersExtended);
superAdminRouter.post("/impersonate/:userId", impersonateUser);
superAdminRouter.get("/health", getSystemHealth);

export default superAdminRouter;