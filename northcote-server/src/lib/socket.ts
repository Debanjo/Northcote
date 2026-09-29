import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import Notification from "../models/notification.js";

// Define event payload types
interface SendMessagePayload {
  senderId: string;
  receiverId: string;
  content: string;
  senderName?: string;
}

interface MarkReadPayload {
  senderId: string;
  receiverId: string;
}

interface TypingPayload {
  receiverId: string;
  isTyping: boolean;
}

let io: SocketIOServer;
const onlineUsers = new Map<string, string>();

export const ROOMS = {
  SUPERADMIN: "superadmin_room",
  ADMIN: "admin_room",
  PROJECT: "project_room",
};

export const initSocket = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    socket.on("join_role_room", (role: string) => {
      if (role === "superadmin") socket.join(ROOMS.SUPERADMIN);
      else if (role === "admin") socket.join(ROOMS.ADMIN);
      else socket.join(ROOMS.PROJECT);
    });

    socket.on("user_online", (userId: string) => {
      onlineUsers.set(userId, socket.id);
      io.emit("users_online", Array.from(onlineUsers.keys()));
    });

    socket.on("send_message", async (data: SendMessagePayload) => {
      try {
        const { senderId, receiverId, content, senderName } = data;
        const message = await Message.create({ senderId, receiverId, content });

        const participants = [senderId, receiverId].sort();
        await Conversation.findOneAndUpdate(
          { participants },
          { participants, lastMessage: content, lastMessageAt: new Date() },
          { upsert: true }
        );

        await Notification.create({
          user: receiverId,
          title: `New message from ${senderName || "User"}`,
          message: content.length > 50 ? content.substring(0, 47) + "..." : content,
          type: "message",
          link: "/dashboard",
        });

        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("new_message", message);
          io.to(receiverSocketId).emit("new_notification", { type: "message" });
        }

        socket.emit("message_sent", message);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("mark_read", async (payload: MarkReadPayload) => {
      try {
        const { senderId, receiverId } = payload;
        await Message.updateMany({ senderId, receiverId, read: false }, { read: true });
        const senderSocketId = onlineUsers.get(senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit("messages_read", { receiverId });
        }
      } catch (error) {
        console.error("Error marking read:", error);
      }
    });

    socket.on("typing", (payload: TypingPayload) => {
      const { receiverId, isTyping } = payload;
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user_typing", { senderId: socket.id, isTyping });
      }
    });

    socket.on("disconnect", () => {
      for (const [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit("users_online", Array.from(onlineUsers.keys()));
      console.log("🔌 Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};