import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadDropzone, type UploadResponse } from "@/lib/uploadthing";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2, Upload, X, ArrowLeft, ShieldAlert } from "lucide-react";
import { createProject } from "@/lib/api";
import Loader from "@/components/global/Loader";

const projectSchema = z.object({
  name: z.string().min(2, "Project name is required"),
  location: z.string().min(2, "Location is required"),
  category: z.enum(["building", "civil", "redevelopment", "geotechnical"]),
  year: z.string().min(4, "Year is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function UploadProject() {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      location: "",
      category: "building",
      year: new Date().getFullYear().toString(),
      description: "",
    },
  });

  // Show loader while checking authentication
  if (isPending) {
    return <Loader label="Loading..." />;
  }

  // Access control – only admin / superadmin
  const allowedRoles = ["admin", "superadmin"];
  if (!session || !allowedRoles.includes(session.user?.role || "")) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md border border-sky-200 shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="bg-sky-100 p-3 rounded-full w-fit mx-auto mb-4">
              <ShieldAlert className="h-12 w-12 text-sky-600" />
            </div>
            <h2 className="text-2xl font-black text-black mb-2">Access Denied</h2>
            <p className="text-gray-500 mb-6">
              Only administrators can upload projects. Please contact a system administrator if you need access.
            </p>
            <Button asChild className="bg-yellow-500 text-black hover:bg-yellow-400">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onSubmit = async (data: ProjectFormValues) => {
    if (!imageUrl) {
      toast.error("Please upload a project image");
      return;
    }

    setIsSubmitting(true);
    try {
      await createProject({
        name: data.name,
        location: data.location,
        category: data.category,
        year: data.year,
        description: data.description,
        image: imageUrl,
        requirements: [],
        clientId: session.user.id,
      });
      toast.success("Project uploaded successfully!");
      navigate("/projects");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-6"
      >
        <div className="bg-sky-500 p-1 rounded">
          <ArrowLeft className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm">Back to Projects</span>
      </Link>

      <Card className="bg-white border border-sky-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-black text-black">
            Upload New Project
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Project Name */}
            <div>
              <Label htmlFor="name" className="text-black font-medium">
                Project Name *
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="e.g., Skyline Tower"
                className="mt-1"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="text-black font-medium">
                Location *
              </Label>
              <Input
                id="location"
                {...register("location")}
                placeholder="e.g., 42 Allen Avenue, Ikeja"
                className="mt-1"
              />
              {errors.location && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Category & Year */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-black font-medium">Category *</Label>
                <Select
                  value={watch("category")}
                  onValueChange={(val) => setValue("category", val as any)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="building">
                      Building Construction
                    </SelectItem>
                    <SelectItem value="civil">Civil Works</SelectItem>
                    <SelectItem value="redevelopment">
                      Redevelopment
                    </SelectItem>
                    <SelectItem value="geotechnical">Geotechnical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="year" className="text-black font-medium">
                  Year *
                </Label>
                <Input
                  id="year"
                  {...register("year")}
                  placeholder="e.g., 2024"
                  className="mt-1"
                />
                {errors.year && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.year.message}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-black font-medium">
                Description *
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Describe the project scope, features, and achievements..."
                rows={4}
                className="mt-1"
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <Label className="text-black font-medium">
                Project Image *
              </Label>
              <p className="text-xs text-gray-500 mb-2">
                Upload a compelling photo of the project.
              </p>

              {!imageUrl ? (
                <UploadDropzone
                  endpoint="imageUploader"
                  onClientUploadComplete={(res: UploadResponse[]) => {
                    setImageUrl(res[0].url);
                    toast.success("Image uploaded");
                  }}
                  onUploadError={(error) => {
                    toast.error(error.message);
                  }}
                  headers={async () => {
                    const session = await authClient.getSession();
                    return {
                      Authorization: `Bearer ${session.data?.session.token}`,
                    };
                  }}
                  className="border-2 border-dashed border-sky-200 rounded-xl ut-label:text-sky-600 ut-allowed-content:text-sky-700"
                />
              ) : (
                <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-sky-200">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setImageUrl("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting || !imageUrl}
              className="w-full bg-yellow-500 text-black hover:bg-yellow-400 font-bold py-6"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Upload className="mr-2 h-5 w-5" />
              )}
              Upload Project
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}