import { asyncHandler } from "../utils/asyncHandler.js";
import { milestoneService } from "../services/milestoneService.js";
import { getIO } from "../lib/socket.js";
import Project from "../models/Project.js";
import type { Request, Response } from "express";

const getParam = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

export const getProjectMilestones = asyncHandler(async (req: Request, res: Response) => {
  const projectId = getParam(req.params.projectId);
  if (!projectId) return res.status(400).json({ message: "Missing projectId" });
  const currentUser = (req as any).user;

  if (currentUser.role === "client") {
    const project = await Project.findById(projectId).select("clientId").lean();
    if (!project || project.clientId !== currentUser.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  const milestones = await milestoneService.getByProject(projectId);
  res.json(milestones);
});

export const createMilestone = asyncHandler(async (req: Request, res: Response) => {
  // Already handles array/undefined, but we can still use getParam for consistency
  const projectId = getParam(req.params.projectId);
  if (!projectId) return res.status(400).json({ message: "Missing projectId" });

  const milestone = await milestoneService.create(projectId, req.body);
  const io = getIO();
  io?.emit("milestone_created", { projectId, milestone });
  res.status(201).json(milestone);
});

export const updateMilestone = asyncHandler(async (req: Request, res: Response) => {
  const id = getParam(req.params.id);
  if (!id) return res.status(400).json({ message: "Missing milestone id" });
  const userId = (req as any).user.id;
  const milestone = await milestoneService.update(id, req.body, userId);
  const io = getIO();
  io?.emit("milestone_updated", { projectId: milestone.projectId, milestone });
  res.json(milestone);
});

export const deleteMilestone = asyncHandler(async (req: Request, res: Response) => {
  const id = getParam(req.params.id);
  if (!id) return res.status(400).json({ message: "Missing milestone id" });
  const deleted = await milestoneService.delete(id);
  const io = getIO();
  io?.emit("milestone_deleted", { projectId: deleted.projectId, milestoneId: id });
  res.json({ success: true });
});