import { asyncHandler } from "../utils/asyncHandler.js";
import { invoiceService } from "../services/invoiceService.js";
import mongoose from "mongoose";
import { userService } from "../services/userService.js";
import type { Request, Response } from "express";

const getParam = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

export const getMyActiveInvoice = asyncHandler(async (req: Request, res: Response) => {
  const currentUserId = (req as any).user.id;
  const invoice = await invoiceService.getActiveInvoice(currentUserId);
  res.status(200).json(invoice);
});

export const getBillingHistory = asyncHandler(async (req: Request, res: Response) => {
  const currentUserId = (req as any).user.id;
  const invoices = await invoiceService.getBillingHistory(currentUserId);
  res.status(200).json(invoices);
});

export const allBilling = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const { invoices, total, totalPages } = await invoiceService.listAll(page, limit);

  const userCollection = mongoose.connection.collection("user");
  const users = await userCollection
    .find({ role: "client" }, { projection: { password: 0 } })
    .toArray();
  const userMap = new Map(users.map(u => [u._id.toString(), u]));

  const enriched = invoices.map(inv => ({
    ...inv,
    user: userMap.get(inv.clientId.toString()) || null,
  }));

  res.json({
    res: enriched,
    pagination: {
      currentPage: page,
      totalPages,
      totalData: total,
      limit,
    },
  });
});

export const markInvoiceAsPaid = asyncHandler(async (req: Request, res: Response) => {
  const id = getParam(req.params.id);
  if (!id) return res.status(400).json({ message: "Missing invoice id" });
  const userId = (req as any).user.id;
  const invoice = await invoiceService.markAsPaid(id, userId);
  res.json(invoice);
});

export const addCharge = asyncHandler(async (req: Request, res: Response) => {
  const { clientId, description, priceInCents } = req.body;
  const userId = (req as any).user.id;
  const invoice = await invoiceService.addCharge(clientId, description, priceInCents, userId);
  res.status(201).json(invoice);
});