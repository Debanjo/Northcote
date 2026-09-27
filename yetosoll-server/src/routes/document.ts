import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { checkRole } from "../middleware/checkRole.js";
import { deleteDocument } from "../controllers/document.js";

const documentRouter = Router();

documentRouter.delete(
  "/:id",
  requireAuth,
  checkRole(["admin", "superadmin", "project_manager"]),
  deleteDocument
);

export default documentRouter;