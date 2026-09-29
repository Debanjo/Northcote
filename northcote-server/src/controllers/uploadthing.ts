import { asyncHandler } from "../utils/asyncHandler.js";
import { UTApi } from "uploadthing/server";
import type { Request, Response } from "express";

export const utapi = new UTApi();

export const deleteFile = asyncHandler(async (req: Request, res: Response) => {
  const { fileUrl } = req.body;
  if (!fileUrl) {
    return res.status(400).json({ message: "File URL is required" });
  }
  const fileKey = fileUrl.split("/").pop();
  if (!fileKey) {
    return res.status(400).json({ message: "Invalid file URL" });
  }
  await utapi.deleteFiles(fileKey);
  res.json({ message: "File deleted successfully" });
});