import { asyncHandler } from "../utils/asyncHandler.js";
import ApprovalRequest from "../models/ApprovalRequest.js";
import { logActivity } from "../lib/activity.js";
import { getIO } from "../lib/socket.js";
import { executeApprovedAction } from "./approvalExecutor.js";
import type { Request, Response } from "express";

export const createApprovalRequest = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  const { action, targetId, targetName, payload } = req.body;

  if (currentUser.role === "superadmin") {
    return res.status(400).json({ message: "Super admin doesn't need approval" });
  }

  const existing = await ApprovalRequest.findOne({
    action,
    targetId,
    status: "pending",
  });
  if (existing) {
    return res.status(400).json({ message: "A pending request already exists for this action." });
  }

  const request = await ApprovalRequest.create({
    requestedBy: currentUser.id,
    requestedByName: currentUser.name,
    requestedByEmail: currentUser.email,
    action,
    targetId,
    targetName,
    payload,
  });

  const io = getIO();
  io.to("superadmin_room").emit("new_approval_request", request);

  await logActivity(currentUser.id, "Approval Requested", `${action} for ${targetName}`);

  res.status(201).json(request);
});

export const getPendingRequests = asyncHandler(async (req: Request, res: Response) => {
  const requests = await ApprovalRequest.find({ status: "pending" }).sort({ createdAt: -1 });
  res.json(requests);
});

export const processApprovalRequest = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { approved, comment } = req.body;
  const superAdmin = (req as any).user;

  const request = await ApprovalRequest.findById(id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  if (request.status !== "pending") return res.status(400).json({ message: "Request already processed" });

  request.status = approved ? "approved" : "rejected";
  request.superAdminId = superAdmin.id;
  request.superAdminName = superAdmin.name;
  await request.save();

  if (approved) {
    await executeApprovedAction(request);
  }

  const io = getIO();
  io.emit(`approval_${request.requestedBy}`, {
    requestId: request._id,
    status: request.status,
    comment,
  });

  await logActivity(
    superAdmin.id,
    approved ? "Approved Request" : "Rejected Request",
    `${request.action} for ${request.targetName}`
  );

  res.json({ success: true, request });
});