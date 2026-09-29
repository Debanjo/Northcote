import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { checkRole } from "../middleware/checkRole.js";
import {
  createApprovalRequest,
  getPendingRequests,
  processApprovalRequest,
} from "../controllers/approval.js";

const approvalRouter = Router();

// Admin creates a request (if needed for other actions)
approvalRouter.post("/", requireAuth, checkRole(["admin", "superadmin"]), createApprovalRequest);

// Super admin gets pending requests
approvalRouter.get("/pending", requireAuth, checkRole(["superadmin"]), getPendingRequests);

// Super admin approves/rejects
approvalRouter.put("/:id", requireAuth, checkRole(["superadmin"]), processApprovalRequest);

export default approvalRouter;