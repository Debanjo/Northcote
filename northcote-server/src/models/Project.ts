import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  clientId: string;
  name: string;
  location?: string;
  category?: string;
  year?: string;
  description?: string;
  image?: string;
  status: "active" | "on_hold" | "completed" | "cancelled";
  startDate: Date;
  estimatedCompletion?: Date;
  progress: number;
  requirements: string[];
  assignedManagerId?: string;
  assignedManagerName?: string;
  assignedSupervisorId?: string;
  assignedSupervisorName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema(
  {
    clientId: { type: String, required: true },
    name: { type: String, required: true },
    location: { type: String },
    category: { type: String },
    year: { type: String },
    description: { type: String },
    image: { type: String },
    status: {
      type: String,
      enum: ["active", "on_hold", "completed", "cancelled"],
      default: "active",
    },
    startDate: { type: Date, default: Date.now },
    estimatedCompletion: { type: Date },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    requirements: [{ type: String }],
    assignedManagerId: { type: String },
    assignedManagerName: { type: String },
    assignedSupervisorId: { type: String },
    assignedSupervisorName: { type: String },
  },
  { timestamps: true }
);

ProjectSchema.index({ clientId: 1, status: 1 });
ProjectSchema.index({ assignedManagerId: 1 });
ProjectSchema.index({ assignedSupervisorId: 1 });

export default mongoose.model<IProject>("Project", ProjectSchema);