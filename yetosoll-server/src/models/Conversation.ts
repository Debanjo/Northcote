import mongoose, { Schema, Document } from "mongoose";

export interface IConversation extends Document {
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema(
  {
    participants: [{ type: String, required: true }],
    lastMessage: { type: String },
    lastMessageAt: { type: Date },
  },
  { timestamps: true }
);

ConversationSchema.index({ participants: 1, lastMessageAt: -1 });

export default mongoose.model<IConversation>("Conversation", ConversationSchema);