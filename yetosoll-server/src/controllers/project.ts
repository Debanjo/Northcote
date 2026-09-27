import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request, Response } from "express";
import Project from "../models/Project.js";
import { projectService } from "../services/projectService.js";
import { userService } from "../services/userService.js";
import { getIO } from "../lib/socket.js";

const getParam = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

export async function recalculateProjectProgress(projectId: string) {
  return projectService.recalculateProgress(projectId);
}

export const getClientProject = asyncHandler(async (req: Request, res: Response) => {
  const clientId = getParam(req.params.clientId);
  if (!clientId) return res.status(400).json({ message: "Missing clientId" });
  const currentUser = (req as any).user;
  if (currentUser.role === "client" && currentUser.id !== clientId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  // Any status is a real project (on_hold/completed/cancelled shouldn't look
  // like "doesn't exist") — take the most recently touched one for this client.
  const project = await Project.findOne({ clientId }).sort({ updatedAt: -1 });
  if (!project) {
    // Fallback to user document fields if no separate Project exists
    const user = await userService.findById(clientId);
    if (user) {
      return res.json({
        id: user._id,
        name: user.currentProject || "Untitled Project",
        status: user.status || "active",
        startDate: user.createdAt,
        estimatedCompletion: user.estimatedCompletion,
        progress: user.progress || 0,
        requirements: user.requirements || [],
        assignedManagerId: user.assignedManagerId,
        assignedManagerName: user.assignedManagerName,
        assignedSupervisorId: user.assignedSupervisorId,
        assignedSupervisorName: user.assignedSupervisorName,
      });
    }
    return res.status(404).json({ message: "No active project found" });
  }
  res.json(project);
});

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.createProject(req.body);
  const io = getIO();
  if (io) io.emit("project_created", { projectId: project._id, name: project.name });
  res.status(201).json(project);
});

export const updateProjectProgress = asyncHandler(async (req: Request, res: Response) => {
  const id = getParam(req.params.id);
  if (!id) return res.status(400).json({ message: "Missing project id" });
  const { progress } = req.body;

  let project = await Project.findByIdAndUpdate(id, { progress }, { new: true });
  if (!project) {
    // update user document progress
    const result = await userService.updateById(id, { progress });
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Project not found" });
    }
    const updatedUser = await userService.findById(id);
    const io = getIO();
    if (io) io.emit("project_updated", { projectId: id, progress });
    return res.json({ success: true, progress, project: updatedUser });
  }

  const io = getIO();
  if (io) io.emit("project_updated", { projectId: id, progress });
  res.json(project);
});