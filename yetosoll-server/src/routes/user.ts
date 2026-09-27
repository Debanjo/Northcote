import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { checkRole } from "../middleware/checkRole.js";
import {
  fetchAllUsers,
  getUserById,
  updateUser,
  createProject,
  toggleBanUser,
  deleteUser,
} from "../controllers/user.js";

const userRouter = express.Router();

userRouter.get("/", requireAuth, checkRole(["admin", "superadmin", "project_manager", "supervisor"]), fetchAllUsers);

userRouter.put("/update/:id", requireAuth, checkRole(["admin", "superadmin", "project_manager", "supervisor"]), updateUser);
userRouter.get("/profile/:id", requireAuth, getUserById);

userRouter.post("/project", requireAuth, checkRole(["admin", "superadmin", "project_manager"]), createProject);

userRouter.post("/toggle-ban/:userId", requireAuth, checkRole(["admin", "superadmin"]), toggleBanUser);

userRouter.delete("/:userId", requireAuth, checkRole(["admin", "superadmin"]), deleteUser);

export default userRouter;