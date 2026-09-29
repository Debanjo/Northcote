import mongoose, { Schema, Document } from "mongoose";

export interface ISiteInspection extends Document {
  project: mongoose.Types.ObjectId;
  uploadedBy: string;
  inspectionType: string;
  location?: string;
  imageUrl?: string;
  inspectorNotes?: string;
  status: "pending" | "inspected" | "approved";
  createdAt: Date;
  updatedAt: Date;
}

const SiteInspectionSchema: Schema = new Schema(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project" },
    uploadedBy: { type: String, required: true },
    inspectionType: { type: String, required: true },
    location: { type: String },
    imageUrl: { type: String },
    inspectorNotes: { type: String },
    status: {
      type: String,
      enum: ["pending", "inspected", "approved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

SiteInspectionSchema.index({ project: 1, createdAt: -1 });

export default mongoose.model<ISiteInspection>("SiteInspection", SiteInspectionSchema);