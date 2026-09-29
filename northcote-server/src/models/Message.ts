import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

MessageSchema.index({ senderId: 1, receiverId: 1, createdAt: 1 });

export default mongoose.model<IMessage>("Message", MessageSchema);