import { asyncHandler } from "../utils/asyncHandler.js";
import Project from "../models/Project.js";
import ActivityLog from "../models/activityLog.js";
import Invoice from "../models/invoice.js";
import mongoose from "mongoose";
import crypto from "crypto";
import { userService } from "../services/userService.js";
import { logActivity } from "../lib/activity.js";
import type { Request, Response } from "express";

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getSystemAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const totalUsers = await userService.countDocuments();
  const activeUsers = await userService.countDocuments({ status: "active" });
  const totalProjects = await Project.countDocuments();
  const activeProjects = await Project.countDocuments({ status: "active" });
  const totalRevenue = await Invoice.aggregate([
    { $match: { status: "paid" } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);
  const recentActivity = await ActivityLog.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  res.json({
    users: { total: totalUsers, active: activeUsers },
    projects: { total: totalProjects, active: activeProjects },
    revenue: totalRevenue[0]?.total || 0,
    recentActivity,
  });
});

export const getAllUsersExtended = asyncHandler(async (req: Request, res: Response) => {
  const { role, status, banned, search, page: rawPage = 1, limit: rawLimit = 20 } = req.query;
  const page = Math.max(1, parseInt(String(rawPage)) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(rawLimit)) || 20));
  const filter: any = {};
  if (role) filter.role = role;
  if (status) filter.status = status;
  if (banned !== undefined) filter.banned = banned === "true";
  if (search) {
    const safeSearch = escapeRegExp(String(search));
    filter.$or = [
      { name: { $regex: safeSearch, $options: "i" } },
      { email: { $regex: safeSearch, $options: "i" } },
    ];
  }

  const total = await userService.countDocuments(filter);
  const users = await userService.findMany(filter, {
    projection: { password: 0 },
    sort: { createdAt: -1 },
    skip: (page - 1) * limit,
    limit,
  });

  res.json({ users, total, page, limit });
});

export const impersonateUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
  if (!userId) return res.status(400).json({ message: "Missing userId" });
  const superAdmin = (req as any).user;
  if (superAdmin.role !== "superadmin") return res.status(403).json({ message: "Forbidden" });

  const targetUser = await userService.findById(userId);
  if (!targetUser) return res.status(404).json({ message: "User not found" });

  if (["admin", "superadmin"].includes(targetUser.role)) {
    return res.status(403).json({ message: "Cannot impersonate an admin or super admin account" });
  }

  const token = crypto.randomUUID();
  await mongoose.connection.collection("session").insertOne({
    token,
    userId: targetUser._id.toString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await logActivity(
    superAdmin.id,
    "Impersonated User",
    `Impersonated user: ${targetUser.name} (${targetUser.email})`
  );

  res.json({ token, message: "Impersonation session created" });
});

export const getSystemHealth = asyncHandler(async (req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  const memoryUsage = process.memoryUsage();
  const uptime = process.uptime();
  res.json({
    database: dbStatus,
    memory: {
      rss: Math.round(memoryUsage.rss / 1024 / 1024) + " MB",
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + " MB",
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + " MB",
    },
    uptime: Math.round(uptime) + " seconds",
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || "development",
  });
});