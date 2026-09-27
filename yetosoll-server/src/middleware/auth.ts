import mongoose from "mongoose";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import type { Request, Response, NextFunction } from "express";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // maintenanceMiddleware (mounted globally ahead of every route) may have
    // already resolved the session — reuse it instead of fetching again.
    if ((req as any).user) return next();

    // 1. Try cookie
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session) {
      (req as any).session = session;
      (req as any).user = session.user;
      return next();
    }

    // 2. Fallback: Authorization header. Session tokens are stored/returned as
    // a bare id (see the frontend's localStorage "auth-token"), but the cookie
    // is "id.signature" — better-auth signs it, so splicing the bare id into a
    // synthetic cookie here always fails signature verification. Look the
    // token up directly instead (same approach already used by uploadthing.ts
    // and the impersonation flow for this exact reason).
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const sessionDoc = await mongoose.connection.collection("session").findOne({ token });
      if (sessionDoc && new Date(sessionDoc.expiresAt) > new Date()) {
        const userDoc = await mongoose.connection
          .collection("user")
          .findOne(
            { _id: new mongoose.Types.ObjectId(sessionDoc.userId) },
            { projection: { password: 0 } }
          );
        if (userDoc) {
          // Raw collection reads return `_id` (ObjectId), not the `id` (string)
          // field better-auth's adapter normally maps it to via getSession() —
          // every authorization check in this codebase reads `.id`.
          (req as any).session = sessionDoc;
          (req as any).user = { ...userDoc, id: userDoc._id.toString() };
          return next();
        }
      }
    }

    return res.status(401).json({ message: "Unauthorized" });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};