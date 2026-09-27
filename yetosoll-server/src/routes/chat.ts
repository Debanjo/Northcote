import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getMessages, getUserConversations, markMessagesAsRead } from "../controllers/chat.js";
import Message from "../models/Message.js";

const chatRouter = Router();

chatRouter.get("/messages/:userId1/:userId2", requireAuth, getMessages);
chatRouter.get("/conversations/:userId", requireAuth, getUserConversations);
chatRouter.post("/read", requireAuth, markMessagesAsRead);

//  Unread message count
chatRouter.get("/unread/:userId", requireAuth, async (req, res) => {
  try {
    const count = await Message.countDocuments({ 
      receiverId: req.params.userId, 
      read: false 
    });
    res.json({ count });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default chatRouter;