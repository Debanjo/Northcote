import { asyncHandler } from "../utils/asyncHandler.js";
import { activityService } from "../services/activityService.js";
import type { Request, Response } from "express";

export const addActivityLog = asyncHandler(async (req: Request, res: Response) => {
  const { action, details } = req.body;
  const currentUserId = (req as any).user.id;
  await activityService.log(currentUserId, action, details);
  res.status(201).json({ message: "Activity logged successfully" });
});

export const getActivityLogs = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
  const data = await activityService.getLogs(page, limit);
  res.json(data);
});