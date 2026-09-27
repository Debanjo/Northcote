import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import mongoose from "mongoose";

export const chatService = {
    getMessages(userId1: string, userId2: string) {
        return Message.find({
            $or: [
                { senderId: userId1, receiverId: userId2 },
                { senderId: userId2, receiverId: userId1 },
            ],
        }).sort({ createdAt: 1 }).lean();
    },

    async getUserConversations(userId: string) {
        const conversations = await Conversation.find({ participants: userId })
            .sort({ lastMessageAt: -1 })
            .lean();

        const otherUserIds = [
            ...new Set(
                conversations
                    .map((conv) => conv.participants.find((p: string) => p !== userId))
                    .filter((id): id is string => Boolean(id))
            ),
        ];

        const userCollection = mongoose.connection.collection("user");
        const users = otherUserIds.length
            ? await userCollection
                .find(
                    { _id: { $in: otherUserIds.map((id) => new mongoose.Types.ObjectId(id)) } },
                    { projection: { name: 1, email: 1, image: 1, role: 1 } }
                )
                .toArray()
            : [];
        const userMap = new Map(users.map((u) => [u._id.toString(), u]));

        return conversations.map((conv) => {
            const otherUserId = conv.participants.find((p: string) => p !== userId);
            return { ...conv, otherUser: (otherUserId && userMap.get(otherUserId)) || null };
        });
    },

    async markRead(senderId: string, receiverId: string) {
        await Message.updateMany(
            { senderId, receiverId, read: false },
            { read: true }
        );
    },

    async unreadCount(userId: string) {
        return Message.countDocuments({ receiverId: userId, read: false });
    },
};