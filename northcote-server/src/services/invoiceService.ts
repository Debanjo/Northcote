import Invoice from "../models/invoice.js";
import { AppError } from "../utils/AppError.js";
import { activityService } from "./activityService.js";

export const invoiceService = {
    async getActiveInvoice(clientId: string) {
        const inv = await Invoice.findOne({
            clientId,
            status: { $in: ["draft", "pending"] },
        });
        if (!inv) throw new AppError("No active invoice found", 404);
        return inv;
    },

    async getBillingHistory(clientId: string) {
        return Invoice.find({ clientId, status: "paid" }).sort({ createdAt: -1 }).lean();
    },

    async listAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [invoices, total] = await Promise.all([
            Invoice.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Invoice.countDocuments(),
        ]);
        return { invoices, total, page, limit, totalPages: Math.ceil(total / limit) };
    },

    async markAsPaid(invoiceId: string, userId: string) {
        const invoice = await Invoice.findByIdAndUpdate(
            invoiceId,
            { status: "paid" },
            { new: true }
        );
        if (!invoice) throw new AppError("Invoice not found", 404);
        await activityService.log(userId, "Invoice Paid", `Invoice ${invoiceId} marked as paid`);
        return invoice;
    },

    async addCharge(clientId: string, description: string, priceInCents: number, userId?: string) {
        if (!Number.isInteger(priceInCents) || priceInCents <= 0) {
            throw new AppError("priceInCents must be a positive integer", 400);
        }

        // Atomic upsert — avoids the lost-update race of a separate find + save,
        // and can't create two concurrent "draft" invoices for the same client.
        const invoice = await Invoice.findOneAndUpdate(
            { clientId, status: "draft" },
            {
                $push: { items: { description, quantity: 1, unitPrice: priceInCents, totalPrice: priceInCents } },
                $inc: { totalAmount: priceInCents },
            },
            { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }
        );

        await activityService.log(userId, "Charge Added", `Added charge of ${priceInCents} to client ${clientId}`);
        return invoice;
    },
};