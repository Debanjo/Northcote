import mongoose, { Schema, Document } from "mongoose";

export interface IDocument extends Document {
  projectId: string;
  name: string;
  type: "contract" | "change_order" | "drawing" | "permit" | "other";
  fileUrl?: string;
  status: "draft" | "pending" | "approved" | "signed";
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema(
  {
    projectId: { type: String, required: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["contract", "change_order", "drawing", "permit", "other"],
      default: "other",
    },
    fileUrl: { type: String },
    status: {
      type: String,
      enum: ["draft", "pending", "approved", "signed"],
      default: "draft",
    },
  },
  { timestamps: true }
);

DocumentSchema.index({ projectId: 1 });

export default mongoose.model<IDocument>("Document", DocumentSchema);