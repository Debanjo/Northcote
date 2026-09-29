import type { Request, Response, NextFunction } from "express";

export const requireSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;
  if (!user || user.role !== "superadmin") {
    return res.status(403).json({ message: "Super admin access required" });
  }
  next();
};