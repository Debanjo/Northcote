import { useState, useCallback } from "react";
import { UploadDropzone, type UploadResponse } from "@/lib/uploadthing";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { createInspection, deleteFile } from "@/lib/api";
import { Camera, Loader2, X, Upload, Eye, ImageIcon } from "lucide-react";

interface SiteInspectionUploadModalProps {
  projectId: string;
}

export default function SiteInspectionUploadModal({ projectId }: SiteInspectionUploadModalProps) {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      inspectionType: "",
      location: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: createInspection,
    onSuccess: () => {
      toast.success("Site inspection recorded successfully");
      setOpen(false);
      reset();
      setImageUrl("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to record inspection");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      setImageUrl("");
      toast.success("Image removed");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove image");
    },
  });

  const handleRemoveImage = useCallback(() => {
    if (imageUrl) {
      deleteMutation.mutate({ fileUrl: imageUrl });
    }
  }, [imageUrl, deleteMutation]);

  const onSubmit = (data: any) => {
    if (!imageUrl) {
      toast.error("Please upload a site photo first");
      return;
    }
    createMutation.mutate({
      projectId,
      inspectionType: data.inspectionType,
      location: data.location,
      imageUrl,
    });
  };

  // Handle successful upload
  const handleUploadComplete = (res: UploadResponse[]) => {
    setIsUploading(false);
    if (res && res.length > 0 && res[0].url) {
      setImageUrl(res[0].url);
      toast.success("Photo uploaded successfully");
    } else {
      toast.error("Upload failed - no URL returned");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) {
          reset();
          setImageUrl("");
        }
        setOpen(isOpen);
      }}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2 bg-light-blue-50 dark:bg-light-blue-900/20 border-light-blue-200 dark:border-light-blue-800">
            <Camera className="h-4 w-4" />
            Upload Site Photo
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-black">New Site Inspection</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Image Upload Section */}
            <div className="space-y-3">
              <Label className="text-black font-medium">Site Photo</Label>
              
              {!imageUrl ? (
                <>
                  <UploadDropzone
                    endpoint="imageUploader"
                    onUploadBegin={() => setIsUploading(true)}
                    onClientUploadComplete={handleUploadComplete}
                    onUploadError={(error) => {
                      setIsUploading(false);
                      toast.error(`Upload failed: ${error.message}`);
                    }}
                    headers={async () => {
                      const session = await authClient.getSession();
                      return {
                        Authorization: `Bearer ${session.data?.session.token}`,
                      };
                    }}
                    className="border-2 border-dashed border-gray-200 rounded-xl ut-label:text-light-blue-600 ut-button:bg-yellow-500 ut-button:text-black ut-button:hover:bg-yellow-400"
                  />
                  {isUploading && (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />
                      <span className="ml-2 text-sm text-gray-600">Uploading...</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-3">
                  {/* Image Preview */}
                  <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-light-blue-200">
                    <img
                      src={imageUrl}
                      alt="Site preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        (e.target as HTMLImageElement).src = '';
                        toast.error("Failed to load image preview");
                      }}
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white"
                        onClick={() => setPreviewOpen(true)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleRemoveImage}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" /> Photo ready – fill details below
                  </p>
                </div>
              )}
            </div>

            {/* Inspection Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="inspectionType" className="text-black font-medium">
                  Inspection Type *
                </Label>
                <Input
                  id="inspectionType"
                  placeholder="e.g., Foundation, Electrical, Plumbing"
                  disabled={createMutation.isPending}
                  className="mt-1"
                  {...register("inspectionType", { required: "Inspection type is required" })}
                />
                {errors.inspectionType && (
                  <p className="text-xs text-red-500 mt-1">{errors.inspectionType.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="location" className="text-black font-medium">
                  Location / Area *
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., Site Area A, Basement Level"
                  disabled={createMutation.isPending}
                  className="mt-1"
                  {...register("location", { required: "Location is required" })}
                />
                {errors.location && (
                  <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>
                )}
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || isUploading || !imageUrl}
                className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Inspection
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Full‑screen image preview modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl bg-black/95 border-0 p-1">
          <button
            onClick={() => setPreviewOpen(false)}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
          >
            <X className="h-5 w-5" />
          </button>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Full preview"
              className="w-full h-auto max-h-[85vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}