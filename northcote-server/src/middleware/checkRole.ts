import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import type { Request, Response, NextFunction } from "express";

export type Role =
  | "all"
  | "admin"
  | "superadmin"
  | "project_manager"
  | "supervisor"
  | "engineer"
  | "client";

export const checkRole = (allowedRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // requireAuth (which runs ahead of checkRole on every route) already
      // resolved the session — including via its Bearer-token fallback,
      // which a fresh cookie-only getSession() call here would miss entirely.
      let user = (req as any).user;

      if (!user) {
        const session = await auth.api.getSession({
          headers: fromNodeHeaders(req.headers),
        });
        if (!session) return res.status(401).json({ message: "Unauthorized" });
        user = session.user;
        (req as any).user = user;
      }

      if (!allowedRoles.includes((user as any).role)) {
        return res.status(403).json({ message: "Forbidden: Insufficient Permissions" });
      }

      next();
    } catch (error) {
      console.error("Error checking role:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
};