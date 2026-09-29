import { deleteFile } from "../controllers/uploadthing.js";
import { requireAuth } from "../middleware/auth.js";
import { checkRole } from "../middleware/checkRole.js";
import express from "express";

const uploadthingRouter = express.Router();

// No per-file ownership is tracked today, so the closest safe scoping is the
// role tier that actually uses file upload/delete in the UI (site inspection
// photos — see SiteInspectionUploadModal, gated to this same tier).
uploadthingRouter.delete(
  "/",
  requireAuth,
  checkRole(["admin", "superadmin", "project_manager", "supervisor"]),
  deleteFile
);

export default uploadthingRouter;