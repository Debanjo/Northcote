import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getMyActiveInvoice,
  getBillingHistory,
  allBilling,
  markInvoiceAsPaid,
  addCharge,
} from "../controllers/invoice.js";
import { checkRole } from "../middleware/checkRole.js";

const invoiceRouter = Router();

invoiceRouter.get(
  "/my-active-invoice",
  requireAuth,
  checkRole(["client", "admin", "superadmin"]),
  getMyActiveInvoice
);
invoiceRouter.get(
  "/",
  requireAuth,
  checkRole(["admin", "superadmin", "project_manager"]),
  allBilling
);
invoiceRouter.get("/history", requireAuth, getBillingHistory);
invoiceRouter.post(
  "/:id/pay",
  requireAuth,
  checkRole(["admin", "superadmin"]),
  markInvoiceAsPaid
);
invoiceRouter.post(
  "/charge",
  requireAuth,
  checkRole(["admin", "superadmin", "project_manager"]),
  addCharge
);

export default invoiceRouter;