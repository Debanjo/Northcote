import { asyncHandler } from "../utils/asyncHandler.js";
import { chatService } from "../services/chatService.js";
import type { Request, Response } from "express";

const getParam = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

// Admin/superadmin can read any thread for support/moderation; everyone else
// must be a participant in the conversation they're asking about.
const CHAT_OVERSIGHT_ROLES = ["admin", "superadmin"];

export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const userId1 = getParam(req.params.userId1);
  const userId2 = getParam(req.params.userId2);
  if (!userId1 || !userId2) {
    return res.status(400).json({ message: "Missing user IDs" });
  }
  const currentUser = (req as any).user;
  const isParticipant = currentUser.id === userId1 || currentUser.id === userId2;
  if (!isParticipant && !CHAT_OVERSIGHT_ROLES.includes(currentUser.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  const messages = await chatService.getMessages(userId1, userId2);
  res.json(messages);
});

export const getUserConversations = asyncHandler(async (req: Request, res: Response) => {
  const userId = getParam(req.params.userId);
  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }
  const currentUser = (req as any).user;
  if (currentUser.id !== userId && !CHAT_OVERSIGHT_ROLES.includes(currentUser.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  const conversations = await chatService.getUserConversations(userId);
  res.json(conversations);
});

export const markMessagesAsRead = asyncHandler(async (req: Request, res: Response) => {
  const { senderId, receiverId } = req.body;
  const currentUser = (req as any).user;
  if (currentUser.id !== receiverId) {
    return res.status(403).json({ message: "Forbidden" });
  }
  await chatService.markRead(senderId, receiverId);
  res.json({ success: true });
});