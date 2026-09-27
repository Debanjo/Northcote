import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Plus,
  Building2,
  MapPin,
  Calendar,
  Hammer,
  X,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CustomInput } from "@/components/global/CustomInput";
import { CustomSelect, type SelectOption } from "@/components/global/CustomSelect";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProject, getUsers } from "@/lib/api";
import { UploadDropzone, type UploadResponse } from "@/lib/uploadthing";
import { getSocket } from "@/lib/socket";

const CATEGORY_OPTIONS: SelectOption[] = [
  { label: "Building Construction", value: "building" },
  { label: "Civil Works", value: "civil" },
  { label: "Redevelopment", value: "redevelopment" },
  { label: "Geotechnical", value: "geotechnical" },
];

const projectSchema = z.object({
  clientId: z.string().min(1, "Please select a client"),
  name: z.string().min(2, "Project name is required"),
  location: z.string().min(2, "Location is required"),
  category: z.enum(["building", "civil", "redevelopment", "geotechnical"]),
  year: z.string().min(4, "Year is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  requirements: z.string().optional(),
});

type ProjectValues = z.infer<typeof projectSchema>;

// `role` is retained as an optional, ignored prop only so existing call sites
// (e.g. <CreateProjectModal role="admin" />) continue to type-check.
interface CreateProjectModalProps {
  role?: string;
}

export default function CreateProjectModal(_props: CreateProjectModalProps) {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const queryClient = useQueryClient();

  const form = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      clientId: "",
      name: "",
      location: "",
      category: "building",
      year: new Date().getFullYear().toString(),
      description: "",
      requirements: "",
    },
  });

  // Only fetch clients while the dialog is open.
  const { data: clientsData, isLoading: clientsLoading } = useQuery({
    queryKey: ["clients-list"],
    queryFn: () => getUsers({ role: "client", limit: 100 }),
    enabled: open,
  });

  const clientOptions: SelectOption[] = useMemo(
    () =>
      (clientsData?.res || []).map((c) => ({
        label: c.email ? `${c.name} (${c.email})` : c.name,
        value: c._id,
      })),
    [clientsData]
  );

  useEffect(() => {
    if (open) {
      form.reset({
        clientId: "",
        name: "",
        location: "",
        category: "building",
        year: new Date().getFullYear().toString(),
        description: "",
        requirements: "",
      });
      setImageUrl("");
    }
  }, [open, form]);

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      toast.success("Project created successfully!");
      queryClient.invalidateQueries({ queryKey: ["all-projects"] });
      const socket = getSocket();
      if (!socket.connected) socket.connect();
      socket.emit("notify_project_created");
      setOpen(false);
      form.reset();
      setImageUrl("");
    },
    onError: (error: any) =>
      toast.error(error.message || "Failed to create project"),
  });

  const onSubmit = (data: ProjectValues) => {
    createProjectMutation.mutate({
      name: data.name,
      location: data.location,
      category: data.category,
      year: data.year,
      description: data.description,
      image: imageUrl,
      requirements: data.requirements
        ? data.requirements
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      clientId: data.clientId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1 sm:gap-2 bg-yellow-500 text-black hover:bg-yellow-400 h-9 sm:h-10 px-3 sm:px-4 text-sm">
          <Plus size={16} /> New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-lg sm:max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-xl">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-lg sm:text-xl font-bold text-black dark:text-white">
            Create New Project
          </DialogTitle>
          <DialogDescription className="text-sm">
            Set up a project and assign it to a client.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          <CustomSelect
            control={form.control}
            name="clientId"
            label="Client"
            placeholder={clientsLoading ? "Loading clients..." : "Select a client"}
            options={clientOptions}
            loading={clientsLoading}
          />
          <CustomInput
            control={form.control}
            name="name"
            label="Project Name"
            placeholder="Skyline Tower"
            startIcon={<Building2 size={18} />}
          />
          <CustomInput
            control={form.control}
            name="location"
            label="Location"
            placeholder="42 Allen Avenue, Ikeja"
            startIcon={<MapPin size={18} />}
          />
          <div className="grid grid-cols-2 gap-4">
            <CustomSelect
              control={form.control}
              name="category"
              label="Category"
              placeholder="Select category"
              options={CATEGORY_OPTIONS}
            />
            <CustomInput
              control={form.control}
              name="year"
              label="Year"
              placeholder="2024"
              startIcon={<Calendar size={18} />}
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-sm">
              Description
            </Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Describe the project scope, features, and goals..."
              rows={4}
              className="mt-1"
            />
            {form.formState.errors.description && (
              <p className="text-xs text-red-500 mt-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
          <CustomInput
            control={form.control}
            name="requirements"
            label="Requirements (comma-separated, optional)"
            placeholder="concrete, electrical, plumbing"
            startIcon={<Hammer size={18} />}
          />
          <div>
            <Label className="text-sm">Project Image (optional)</Label>
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
                className="mt-1 border-2 border-dashed border-sky-200 rounded-xl ut-label:text-sky-600 ut-allowed-content:text-sky-700"
              />
            ) : (
              <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-sky-200 mt-1">
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

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createProjectMutation.isPending}
              className="w-full sm:w-auto bg-yellow-500 text-black hover:bg-yellow-400"
            >
              {createProjectMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ============================================================================
 * PREVIOUS WORKFLOW — kept for rollback.
 * ----------------------------------------------------------------------------
 * This component was mislabeled "CreateProjectModal" but actually created a USER
 * ACCOUNT (via authClient.admin.createUser) and only created a project as a side
 * effect when role === "client" AND the "create project immediately" box was
 * ticked. On the Projects page it was rendered as <CreateProjectModal role="admin" />,
 * so clicking "create" provisioned a new ADMIN and never a project.
 *
 * To revert: delete the CreateProjectModal implementation above, uncomment the
 * block below, and restore the imports it needs (Role, User, useForm/userSchema,
 * TRADE_OPTIONS, DEPARTMENT_OPTIONS, STATUS_OPTIONS, Mail/Lock/UserIcon/Pencil,
 * createActivityLog, updateUser).
 * ----------------------------------------------------------------------------

import type { Role, User } from "@/types";
import { Mail, Lock, UserIcon, Pencil } from "lucide-react";
import {
  userSchema,
  type UserValues,
  TRADE_OPTIONS,
  DEPARTMENT_OPTIONS,
  STATUS_OPTIONS,
} from "@/components/users/create-user-schema";
import { createActivityLog, updateUser } from "@/lib/api";

interface UserModalProps {
  role: Role;
  user?: User;
  loading?: boolean;
}

const CreateUserModal = ({ role, user, loading }: UserModalProps) => {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const isEdit = !!user;
  const roleLabel = role
    .replace("_", " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const schema = userSchema(isEdit);
  const form = useForm<UserValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      trade: "",
      department: "",
      skills: [],
      availability: true,
      status: "active",
    },
  });

  useEffect(() => {
    if (open) {
      if (user) {
        form.reset({
          name: user.name,
          email: user.email,
          password: "",
          trade: user.trade || "",
          department: user.department || "",
          skills: user.skills || [],
          availability: user.availability ?? true,
          status: user.status as string,
        });
      } else {
        form.reset({
          name: "",
          email: "",
          password: "",
          trade: "",
          department: "",
          skills: [],
          availability: true,
          status: "active",
        });
      }
    }
  }, [open, user, form, role]);

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => toast.success("Project created and team assigned!"),
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("User updated successfully!");
      setOpen(false);
      form.reset();
    },
    onError: (error) => toast.error(error.message),
  });

  const activityMutation = useMutation({
    mutationFn: createActivityLog,
    onError: (error) => console.log("Activity Log Error:", error),
  });

  const onSubmit = async (data: UserValues) => {
    const payload: any = {
      name: data.name,
      email: data.email,
      role: role,
      status: data.status,
    };

    if (
      role === "project_manager" ||
      role === "supervisor" ||
      role === "engineer"
    ) {
      payload.trade = data.trade;
      payload.department = data.department;
      payload.skills =
        typeof data.skills === "string"
          ? (data.skills as string).split(",").map((s) => s.trim())
          : data.skills;
      payload.availability = data.availability;
    } else if (role === "client") {
      payload.clientNotes = data.clientNotes;
    }

    if (isEdit && user) {
      if (data.password) payload.password = data.password;
      updateMutation.mutate({ userId: user._id, userData: payload });
    } else {
      setIsCreating(true);
      const { error, data: createdUser } = await authClient.admin.createUser({
        name: data.name,
        email: data.email,
        password: data.password!,
        // @ts-ignore
        role: role,
        data: { ...payload },
      });

      if (error) {
        setIsCreating(false);
        throw error;
      }

      if (createdUser && role === "client" && data.createProject) {
        createProjectMutation.mutate({
          name: data.projectName || `${data.name}'s Project`,
          location: "",
          category: "building",
          year: new Date().getFullYear().toString(),
          description: data.clientNotes || "New project",
          image: "",
          requirements:
            typeof data.requirements === "string"
              ? (data.requirements as string).split(",").map((s) => s.trim())
              : data.requirements || [],
          clientId: createdUser.user.id,
          estimatedCompletion: data.estimatedCompletion || undefined,
        });
      }

      const socket = getSocket();
      if (!socket.connected) socket.connect();
      socket.emit("notify_user_created");

      toast.success(`${roleLabel} created successfully!`);
      activityMutation.mutate({
        userId: createdUser.user.id,
        action: "create",
        details: `${roleLabel} account created for ${createdUser.user.name}`,
      });
      setOpen(false);
      form.reset();
      setIsCreating(false);
    }
  };

  // ...JSX omitted in rollback copy; see git history for the full original form.
};

export default CreateUserModal;
 * ==========================================================================*/
