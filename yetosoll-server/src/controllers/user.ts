// yetosoll-server/src/controllers/user.ts
import mongoose from "mongoose";
import type { Request, Response } from "express";
import { userService } from "../services/userService.js";
import { projectService } from "../services/projectService.js";
import { logActivity } from "../lib/activity.js";
import { inngest } from "../inngest/client.js";
import ApprovalRequest from "../models/ApprovalRequest.js";
import { getIO } from "../lib/socket.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getParamString = (param: string | string[] | undefined): string | undefined =>
  Array.isArray(param) ? param[0] : param;

// Same elevated tier that's already allowed to list all users (GET /api/users) —
// viewing one profile shouldn't be more permissive than viewing the whole list.
const PROFILE_READ_ROLES = ["admin", "superadmin", "project_manager", "supervisor"];

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const id = getParamString(req.params.id);
  if (!id) return res.status(400).json({ message: "Missing user id" });
  const currentUser = (req as any).user;

  if (currentUser.id !== id && !PROFILE_READ_ROLES.includes(currentUser.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const user = await userService.findByIdWithoutPassword(id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const id = getParamString(req.params.id);
  if (!id) return res.status(400).json({ message: "Missing user id" });
  const currentUser = (req as any).user;
  // role/banned/emailVerified/_id are privileged or immutable fields — never let
  // them flow through from an arbitrary request body (see updatePayload below).
  const { role, banned, emailVerified, _id, id: bodyId, ...safeFields } = req.body;

  const existingUser = await userService.findByIdWithoutPassword(id);
  if (!existingUser) return res.status(404).json({ message: "User not found" });

  if (role !== undefined && role !== existingUser.role) {
    if (currentUser.role === "superadmin") {
      safeFields.role = role;
    } else if (currentUser.role === "admin") {
      const existingRequest = await ApprovalRequest.findOne({
        action: "change_role",
        targetId: id,
        status: "pending",
      });
      if (existingRequest) {
        return res.status(400).json({ message: "A pending role-change request already exists for this user." });
      }

      const request = await ApprovalRequest.create({
        requestedBy: currentUser.id,
        requestedByName: currentUser.name,
        requestedByEmail: currentUser.email,
        action: "change_role",
        targetId: id,
        targetName: existingUser.name,
        payload: { role },
      });

      const io = getIO();
      if (io) io.to("superadmin_room").emit("new_approval_request", request);
      await logActivity(currentUser.id, "Approval Requested", `Change role for ${existingUser.name} to ${role}`);

      return res.json({ message: "Role change requires super admin approval", requestId: request._id });
    } else {
      return res.status(403).json({ message: "Only an admin or super admin can change a user's role." });
    }
  }

  Object.keys(safeFields).forEach(
    (key) => (safeFields[key] === undefined || safeFields[key] === null) && delete safeFields[key]
  );

  let modifiedCount = 0;
  if (Object.keys(safeFields).length > 0) {
    const result = await userService.updateById(id, safeFields);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    modifiedCount = result.modifiedCount;
  }

  const io = getIO();
  if (io && modifiedCount > 0) io.emit("notify_user_updated");

  await logActivity(
    currentUser.id,
    "Updated User",
    `Updated user: ${existingUser.name} (${existingUser.email})`
  );
  res.json({ message: "User updated successfully" });
});

export const fetchAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
  const skip = (page - 1) * limit;
  const filter: any = {};
  const role = req.query.role as string;
  if (role && role !== "all" && role !== "") filter.role = role;
  filter.$or = [{ deleted: { $exists: false } }, { deleted: false }];

  const totalUsers = await userService.countDocuments(filter);
  const users = await userService.findMany(filter, {
    projection: { password: 0, headers: 0, emailVerified: 0 },
    sort: { createdAt: -1 },
    skip,
    limit,
  });

  res.json({
    res: users,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalData: totalUsers,
      limit,
    },
  });
});

// New unified project creation – replaced both old createProject functions
export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  const { clientId, name, requirements } = req.body;

  const result = await projectService.createProjectForClient({
    clientId,
    name,
    requirements,
    creatorId: currentUser.id,
  });

  const io = getIO();
  if (io) io.emit("project_created", { clientId, name });

  res.json(result);
});

export const toggleBanUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = getParamString(req.params.userId);
  if (!userId) return res.status(400).json({ message: "Missing userId" });
  const { banned } = req.body;
  const currentUser = (req as any).user;

  const targetUser = await userService.findById(userId);
  if (!targetUser) return res.status(404).json({ message: "User not found" });

  if (currentUser.role === "superadmin") {
    await userService.updateById(userId, { banned });
    const action = banned ? "Ban User" : "Unban User";
    const details = `${banned ? "Banned" : "Unbanned"} user: ${targetUser.name} (${targetUser.email})`;
    await logActivity(currentUser.id, action, details);
    const io = getIO();
    if (io) io.emit("notify_user_updated");
    return res.json({ success: true, message: `User ${banned ? "banned" : "unbanned"} successfully` });
  }

  // Admin needs approval
  const existing = await ApprovalRequest.findOne({
    action: "ban_user",
    targetId: userId,
    status: "pending",
  });
  if (existing) return res.status(400).json({ message: "A pending request already exists for this action." });

  const request = await ApprovalRequest.create({
    requestedBy: currentUser.id,
    requestedByName: currentUser.name,
    requestedByEmail: currentUser.email,
    action: "ban_user",
    targetId: userId,
    targetName: targetUser.name,
    payload: { banned },
  });

  const io = getIO();
  if (io) io.to("superadmin_room").emit("new_approval_request", request);
  await logActivity(currentUser.id, "Approval Requested", `Ban user: ${targetUser.name}`);

  res.json({ message: "Approval request sent to super admin", requestId: request._id });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = getParamString(req.params.userId);
  if (!userId) return res.status(400).json({ message: "Missing userId" });
  const currentUser = (req as any).user;

  const targetUser = await userService.findById(userId);
  if (!targetUser) return res.status(404).json({ message: "User not found" });

  if (currentUser.role === "superadmin") {
    await userService.updateById(userId, { deleted: true });
    await logActivity(currentUser.id, "Delete User", `Deleted user: ${targetUser.name} (${targetUser.email})`);
    const io = getIO();
    if (io) io.emit("notify_user_updated");
    return res.json({ success: true, message: "User deleted successfully" });
  }

  const existing = await ApprovalRequest.findOne({
    action: "delete_user",
    targetId: userId,
    status: "pending",
  });
  if (existing) return res.status(400).json({ message: "A pending request already exists for this action." });

  const request = await ApprovalRequest.create({
    requestedBy: currentUser.id,
    requestedByName: currentUser.name,
    requestedByEmail: currentUser.email,
    action: "delete_user",
    targetId: userId,
    targetName: targetUser.name,
  });

  const io = getIO();
  if (io) io.to("superadmin_room").emit("new_approval_request", request);
  await logActivity(currentUser.id, "Approval Requested", `Delete user: ${targetUser.name}`);

  res.json({ message: "Approval request sent to super admin", requestId: request._id });
});