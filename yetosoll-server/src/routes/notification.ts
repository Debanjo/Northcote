import { Router } from "express";
import Notification from "../models/notification.js";
import { requireAuth } from "../middleware/auth.js";

const notificationRouter = Router();

notificationRouter.get("/", requireAuth, async (req, res) => {
  try {
    const currentUserId = (req as any).user.id;
    const notifications = await Notification.find({ user: currentUserId })
      .sort({ createdAt: -1 })
      .limit(20);
    const unreadCount = await Notification.countDocuments({
      user: currentUserId,
      isRead: false,
    });
    res.json({ notifications, unreadCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

notificationRouter.post("/:id/read", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = (req as any).user.id;
    const updated = await Notification.findOneAndUpdate(
      { _id: id, user: currentUserId },
      { isRead: true }
    );
    if (!updated) return res.status(404).json({ message: "Notification not found" });
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default notificationRouter;