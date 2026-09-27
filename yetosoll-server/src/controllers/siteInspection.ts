import { asyncHandler } from "../utils/asyncHandler.js";
import SiteInspection from "../models/siteInspection.js";
import { logActivity } from "../lib/activity.js";
import { getIO } from "../lib/socket.js";
import type { Request, Response } from "express";

export const createInspection = asyncHandler(async (req: Request, res: Response) => {
  const { projectId, inspectionType, location, imageUrl } = req.body;
  const currentUserId = (req as any).user?.id;

  const inspection = await SiteInspection.create({
    project: projectId,
    inspectionType,
    location,
    imageUrl,
    status: "pending",
    uploadedBy: currentUserId,
  });

  const io = getIO();
  io?.emit("inspection_added");

  await logActivity(currentUserId, "Created Inspection", `Inspection ${inspectionType} for project ${projectId}`);

  res.status(201).json(inspection);
});

export const getProjectInspections = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const inspections = await SiteInspection.find({ project: projectId }).sort({ createdAt: -1 });
  res.status(200).json(inspections);
});

export const updateInspection = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { inspectorNotes, status } = req.body;
  const updated = await SiteInspection.findByIdAndUpdate(
    id,
    { $set: { inspectorNotes, status } },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Inspection not found" });

  const io = getIO();
  io?.emit("inspection_updated", updated);

  await logActivity((req as any).user.id, "Updated Inspection", `Inspection ${id} updated`);
  res.status(200).json(updated);
});