import dotenv from "dotenv";
dotenv.config();

import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { serve } from "inngest/express";
import { createServer } from "http";
import { createRouteHandler } from "uploadthing/express";

import { connectDB } from "./config/db.js";
import { auth } from "./lib/auth.js";
import userRouter from "./routes/user.js";
import activityLogRouter from "./routes/activity.js";
import notificationRouter from "./routes/notification.js";
import inspectionRouter from "./routes/siteInspection.js";
import invoiceRouter from "./routes/invoice.js";
import projectRouter from "./routes/project.js";
import milestoneRouter from "./routes/milestone.js";
import documentRouter from "./routes/document.js";
import chatRouter from "./routes/chat.js";
import settingRouter from "./routes/setting.js";
import superAdminRouter from "./routes/superAdmin.js";
import approvalRouter from "./routes/approval.js";
import reviewsRouter from "./routes/reviews.js";
import uploadthingRouter from "./routes/uploadthing.js";

import { inngest } from "./inngest/client.js";
import { assignProjectTeam, addChargeToInvoice } from "./inngest/functions.js";
import { getIO, initSocket } from "./lib/socket.js";
import { uploadRouter } from "./lib/uploadthing.js";
import { maintenanceMiddleware } from "./middleware/maintenance.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app: Application = express();
const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

initSocket(httpServer);
app.set("io", getIO());

const allowedOrigins = ["https://northcote-two.vercel.app/"];
if (process.env.CORS_ORIGIN) {
  allowedOrigins.push(process.env.CORS_ORIGIN);
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Fix SameSite/Partitioned cookies for cross-origin (prod only — frontend and
// backend are on different domains there; on localhost this breaks cookie
// storage since Secure cookies require HTTPS)
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    const originalSetHeader = res.setHeader;
    res.setHeader = function (name: string, value: string | string[]) {
      if (name.toLowerCase() === "set-cookie") {
        const fixCookie = (cookie: string) =>
          cookie
            .replace(/SameSite=\w+/i, "SameSite=None")
            .replace(/;\s*Secure/gi, "") + "; Secure; Partitioned";
        value = Array.isArray(value) ? value.map(fixCookie) : fixCookie(value as string);
      }
      return originalSetHeader.call(this, name, value);
    };
    next();
  });
}

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (_req: Request, res: Response) => {
  res.send("Yetosol API");
});

app.all("/api/auth/*splat", toNodeHandler(auth));
app.get("/api/me", async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});

app.use("/api", maintenanceMiddleware);
app.use("/api/users", userRouter);
app.use("/api/activity-logs", activityLogRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/inspections", inspectionRouter);
app.use("/api/invoices", invoiceRouter);
app.use("/api/projects", projectRouter);
app.use("/api/milestones", milestoneRouter);
app.use("/api/documents", documentRouter);
app.use("/api/chat", chatRouter);
app.use("/api/settings", settingRouter);
app.use("/api/super-admin", superAdminRouter);
app.use("/api/approval", approvalRouter);
app.use("/api/reviews", reviewsRouter);

app.use(
  "/api/inngest",
  serve({ client: inngest, functions: [assignProjectTeam, addChargeToInvoice] })
);

app.use(
  "/api/uploadthing",
  createRouteHandler({ router: uploadRouter })
);

app.use("/api/uploadthing/delete", uploadthingRouter);

// Central error handler – after all routes
app.use(errorHandler);

connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`DB connection failed: ${error.message}`);
  });