import mongoose, { Schema, Document } from "mongoose";

export interface IMilestone extends Document {
  projectId: string;
  name: string;
  dueDate: Date;
  status: "pending" | "in_progress" | "completed";
  order: number;
  evidenceUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneSchema = new Schema(
  {
    projectId: { type: String, required: true },
    name: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
    },
    order: { type: Number, default: 0 },
    evidenceUrls: [{ type: String }],
  },
  { timestamps: true }
);

MilestoneSchema.index({ projectId: 1, order: 1 });

export default mongoose.model<IMilestone>("Milestone", MilestoneSchema);