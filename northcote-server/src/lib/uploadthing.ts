import mongoose from "mongoose";
import { createUploadthing, type FileRouter } from "uploadthing/express";

const f = createUploadthing();

export const uploadRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new Error("Unauthorized");
      const token = authHeader.substring(7);
      const session = await mongoose.connection.collection("session").findOne({ token });
      if (!session || new Date(session.expiresAt) < new Date()) {
        throw new Error("Unauthorized");
      }
      return { uploaderId: session.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(` Uploaded by User ID: ${metadata.uploaderId}`);
      return { url: file.url, name: file.name, size: file.size, key: file.key };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;