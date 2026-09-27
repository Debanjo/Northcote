import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { checkRole } from "../middleware/checkRole.js";
import { getSetting, setSetting, getAllSettings } from "../controllers/setting.js";

const settingRouter = Router();

settingRouter.get("/:key", getSetting);
settingRouter.put(
  "/:key",
  requireAuth,
  checkRole(["admin", "superadmin"]),
  setSetting
);
settingRouter.get(
  "/",
  requireAuth,
  checkRole(["admin", "superadmin"]),
  getAllSettings
);

export default settingRouter;