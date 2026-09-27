import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Role, User } from "@/types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Mail, Lock, Building2, Hammer, UserIcon, Pencil } from "lucide-react";
import { CustomInput } from "@/components/global/CustomInput";
import { CustomSelect } from "@/components/global/CustomSelect";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, type UserValues, TRADE_OPTIONS, DEPARTMENT_OPTIONS, STATUS_OPTIONS } from "./create-user-schema.js";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { createActivityLog, createUserProject, updateUser } from "@/lib/api";
import { getSocket } from "@/lib/socket";

interface UserModalProps {
  role: Role;
  user?: User;
  loading?: boolean;
}

const CreateUserModal = ({ role, user, loading }: UserModalProps) => {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const isEdit = !!user;
  const roleLabel = role.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());

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
    mutationFn: createUserProject,
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

    if (role === "project_manager" || role === "supervisor" || role === "engineer") {
      payload.trade = data.trade;
      payload.department = data.department;
      payload.skills = typeof data.skills === "string" ? (data.skills as string).split(",").map(s => s.trim()) : data.skills;
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
          clientId: createdUser.user.id,
          name: data.projectName || `${data.name}'s Project`,
          requirements: typeof data.requirements === "string" ? (data.requirements as string).split(",").map(s => s.trim()) : data.requirements || [],
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

  const isLoading = loading || isCreating || updateMutation.isPending || activityMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="outline" disabled={loading} size="sm" className="h-8 px-2 sm:px-3 text-xs">
            <Pencil className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Edit
          </Button>
        ) : (
          <Button className="gap-1 sm:gap-2 bg-yellow-500 text-black hover:bg-yellow-400 h-9 sm:h-10 px-3 sm:px-4 text-sm">
            <Plus size={16} /> Add {roleLabel}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-lg md:max-w-xl max-h-[90vh] overflow-y-auto bg-white p-4 sm:p-6 rounded-xl">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-lg sm:text-xl font-bold text-black">
            {isEdit ? "Edit" : "Add New"} {roleLabel}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {isEdit
              ? `Update details for ${user?.name}.`
              : `Enter details to create a new ${roleLabel} account.`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          <CustomInput
            control={form.control}
            name="name"
            label="Full Name"
            placeholder="John Doe"
            startIcon={<UserIcon size={18} />}
          />
          <CustomInput
            control={form.control}
            name="email"
            label="Email Address"
            type="email"
            placeholder="john@yetosol.com"
            startIcon={<Mail size={18} />}
          />
          <CustomInput
            control={form.control}
            name="password"
            label={isEdit ? "New Password (Optional)" : "Password"}
            type="password"
            placeholder={isEdit ? "Leave blank to keep current" : "••••••••"}
            startIcon={<Lock size={18} />}
          />

          {(role === "project_manager" || role === "supervisor" || role === "engineer") && (
            <>
              <CustomSelect
                control={form.control}
                name="trade"
                label="Trade / Specialization"
                placeholder="Select Trade"
                options={TRADE_OPTIONS}
              />
              <CustomInput
                control={form.control}
                name="department"
                label="Department"
                placeholder="e.g., Civil, Electrical"
                startIcon={<Building2 size={18} />}
              />
              <CustomInput
                control={form.control}
                name="skills"
                label="Skills (comma-separated)"
                placeholder="concrete, steel, scheduling"
                startIcon={<Hammer size={18} />}
              />
              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="availability"
                  {...form.register("availability")}
                  className="rounded border-gray-300 h-4 w-4"
                />
                <label htmlFor="availability" className="text-sm">Available for assignment</label>
              </div>
            </>
          )}

          {role === "client" && (
            <>
              <CustomInput
                control={form.control}
                name="clientNotes"
                label="Client Notes"
                placeholder="Special requirements..."
              />
              {!isEdit && (
                <>
                  <div className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      id="createProject"
                      {...form.register("createProject")}
                      className="rounded border-gray-300 h-4 w-4"
                    />
                    <label htmlFor="createProject" className="text-sm">Create project immediately</label>
                  </div>
                  {form.watch("createProject") && (
                    <>
                      <CustomInput
                        control={form.control}
                        name="projectName"
                        label="Project Name"
                        placeholder="Skyline Tower"
                      />
                      <CustomInput
                        control={form.control}
                        name="requirements"
                        label="Requirements (comma-separated)"
                        placeholder="concrete, electrical, plumbing"
                      />
                    </>
                  )}
                </>
              )}
            </>
          )}

          <CustomSelect
            control={form.control}
            name="status"
            label="Status"
            placeholder="Select Status"
            options={STATUS_OPTIONS}
          />

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-yellow-500 text-black hover:bg-yellow-400">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Update" : "Create"} Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserModal;