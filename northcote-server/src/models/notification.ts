import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: "system" | "assignment" | "inspection" | "alert" | "message"; // ✅ Added "message"
  isRead: boolean;
  link?: string;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["system", "assignment", "inspection", "alert", "message"],
      default: "system",
    },
    isRead: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true }
);

NotificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

export default mongoose.model<INotification>("Notification", NotificationSchema);