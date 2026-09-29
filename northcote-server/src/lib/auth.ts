import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env from the project root BEFORE anything else
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

console.log("MONGO_URI loaded in auth.ts:", process.env.MONGO_URI ? "Yes" : "No");

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { admin } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error("MONGO_URI is not defined in environment variables.");
}

if (!mongoUri.startsWith("mongodb://") && !mongoUri.startsWith("mongodb+srv://")) {
  throw new Error(`Invalid MONGO_URI format. Expected "mongodb://" or "mongodb+srv://"`);
}

const client = new MongoClient(mongoUri);
const db = client.db();

const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:5000";
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const isProduction = process.env.NODE_ENV === "production";

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL,
  trustedOrigins: [frontendUrl],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      // No transactional email provider is wired up yet. Logging the raw
      // token/URL is fine for local dev, but in production it lets anyone
      // with log/hosting-dashboard access take over any account — replace
      // this with a real email send (and drop this log) before relying on
      // password reset in production.
      if (isProduction) {
        console.log(`Password reset requested for ${user.email}`);
      } else {
        console.log(`🔐 [dev only] Reset password link for ${user.email}: ${url}`);
      }
    },
  },
 
  advanced: {
    cookies: {
      sessionToken: {
        attributes: {
          sameSite: isProduction ? "none" : "lax",
          secure: isProduction,
        },
      },
    },
  },
  plugins: [
    admin({
      defaultRole: "client",
      adminRole: ["admin", "superadmin"],
    }),
  ],
  user: {
    additionalFields: {
      trade: { type: "string", required: false },
      department: { type: "string", required: false },
      gender: { type: "string", required: false },
      availability: { type: "boolean", required: false, defaultValue: true },
      skills: { type: "string[]", required: false },
      projectHistory: { type: "string", required: false },
      clientNotes: { type: "string", required: false },
      status: { type: "string", required: false, defaultValue: "active" },
      changeOrders: { type: "string[]", required: false },
      projects: { type: "string[]" },
    },
  },
});