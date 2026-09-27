import type { Request, Response, NextFunction } from "express";
import Setting from "../models/Setting.js";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

let cachedMaintenanceMode: boolean | null = null;
let lastCacheTime = 0;
const CACHE_TTL = 5000; // 5 seconds

export const maintenanceMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Always allow public and auth endpoints
    const publicPaths = ["/api/auth", "/api/me", "/api/settings"];
    if (publicPaths.some((path) => req.path.startsWith(path))) {
      return next();
    }

    // Try to get user from request (may be set by requireAuth)
    let user = (req as any).user;
    
    // If not set, fetch session manually using Better Auth
    if (!user) {
      try {
        const session = await auth.api.getSession({
          headers: fromNodeHeaders(req.headers),
        });
        user = session?.user;
        (req as any).user = user; // attach for downstream middleware
      } catch (e) {
        // No valid session – proceed as unauthenticated
      }
    }

    // Admins always bypass maintenance mode
    if (user && ["admin", "superadmin"].includes(user.role)) {
      return next();
    }

    // Check maintenance mode with caching
    const now = Date.now();
    if (cachedMaintenanceMode === null || now - lastCacheTime > CACHE_TTL) {
      const setting = await Setting.findOne({ key: "maintenanceMode" });
      cachedMaintenanceMode = setting?.value === true;
      lastCacheTime = now;
    }

    if (cachedMaintenanceMode) {
      return res.status(503).json({
        message: "The system is currently under maintenance. Please try again later.",
      });
    }

    next();
  } catch (error) {
    console.error("Maintenance middleware error:", error);
    next(); // Fail open to avoid complete blockage
  }
};