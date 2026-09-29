import { asyncHandler } from "../utils/asyncHandler.js";
import { documentService } from "../services/documentService.js";
import { getIO } from "../lib/socket.js";
import Project from "../models/Project.js";
import type { Request, Response } from "express";

const getParam = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

export const getProjectDocuments = asyncHandler(async (req: Request, res: Response) => {
  const projectId = getParam(req.params.projectId);
  if (!projectId) return res.status(400).json({ message: "Missing projectId" });
  const currentUser = (req as any).user;

  if (currentUser.role === "client") {
    const project = await Project.findById(projectId).select("clientId").lean();
    if (!project || project.clientId !== currentUser.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  const docs = await documentService.getByProject(projectId);
  res.json(docs);
});

export const createDocument = asyncHandler(async (req: Request, res: Response) => {
  const projectId = getParam(req.params.projectId);
  if (!projectId) return res.status(400).json({ message: "Missing projectId" });
  const doc = await documentService.create(projectId, req.body);
  const io = getIO();
  io?.emit("document_created", { projectId, document: doc });
  res.status(201).json(doc);
});

export const deleteDocument = asyncHandler(async (req: Request, res: Response) => {
  const id = getParam(req.params.id);
  if (!id) return res.status(400).json({ message: "Missing document id" });
  const doc = await documentService.delete(id);
  const io = getIO();
  io?.emit("document_deleted", { projectId: doc.projectId, documentId: id });
  res.json({ success: true });
});