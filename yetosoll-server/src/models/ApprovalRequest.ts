import mongoose, { Schema, Document } from "mongoose";

export interface IApprovalRequest extends Document {
  requestedBy: string;           // admin user ID
  requestedByName: string;
  requestedByEmail: string;
  action: "delete_user" | "ban_user" | "delete_project" | "change_role";
  targetId: string;              // user ID or project ID
  targetName: string;
  payload: any;                  // additional data needed to execute
  status: "pending" | "approved" | "rejected";
  superAdminId?: string;         // who approved/rejected
  superAdminName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApprovalRequestSchema = new Schema(
  {
    requestedBy: { type: String, required: true },
    requestedByName: { type: String, required: true },
    requestedByEmail: { type: String, required: true },
    action: {
      type: String,
      enum: ["delete_user", "ban_user", "delete_project", "change_role"],
      required: true,
    },
    targetId: { type: String, required: true },
    targetName: { type: String, required: true },
    payload: { type: Schema.Types.Mixed },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    superAdminId: { type: String },
    superAdminName: { type: String },
  },
  { timestamps: true }
);

ApprovalRequestSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model<IApprovalRequest>("ApprovalRequest", ApprovalRequestSchema);