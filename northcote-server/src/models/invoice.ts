import mongoose, { Schema, Document } from "mongoose";

export interface IInvoice extends Document {
  clientId: string;
  status: "draft" | "pending" | "paid";
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  totalAmount: number;
  createdAt: Date;
}

const InvoiceSchema = new Schema(
  {
    clientId: { type: String, required: true },
    status: {
      type: String,
      enum: ["draft", "pending", "paid"],
      default: "draft",
    },
    items: [
      {
        description: String,
        quantity: Number,
        unitPrice: Number,
        totalPrice: Number,
      },
    ],
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

InvoiceSchema.index({ clientId: 1, status: 1 });

export default mongoose.model<IInvoice>("Invoice", InvoiceSchema);