import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

export type UploadResponse = {
  url: string;
  name: string;
  size: number;
  key: string;
};

export const UploadButton = generateUploadButton({
  url: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/uploadthing`,
});

export const UploadDropzone = generateUploadDropzone({
  url: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/uploadthing`,
});
