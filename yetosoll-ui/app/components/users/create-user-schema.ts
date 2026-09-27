import * as z from "zod";

export const TRADE_OPTIONS = [
  { label: "Civil", value: "civil" },
  { label: "Electrical", value: "electrical" },
  { label: "Mechanical", value: "mechanical" },
  { label: "Plumbing", value: "plumbing" },
  { label: "Structural", value: "structural" },
  { label: "General", value: "general" },
];

export const DEPARTMENT_OPTIONS = [
  { label: "Residential", value: "residential" },
  { label: "Commercial", value: "commercial" },
  { label: "Industrial", value: "industrial" },
  { label: "Infrastructure", value: "infrastructure" },
];

export const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "On Leave", value: "on_leave" },
  { label: "Resigned", value: "resigned" },
];

export const userSchema = (isEdit: boolean) => {
  return z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: isEdit
      ? z.string().optional().refine((val) => !val || val.length >= 6, {
          message: "Password must be at least 6 characters",
        })
      : z.string().min(6, "Password must be at least 6 characters"),
    trade: z.string().optional(),
    department: z.string().optional(),
    skills: z.any().optional(),
    availability: z.boolean().optional(),
    status: z.string().optional(),
    clientNotes: z.string().optional(),
    createProject: z.boolean().optional(),
    projectName: z.string().optional(),
    requirements: z.any().optional(),
     estimatedCompletion: z.string().optional(),
  });
};

export type UserValues = z.infer<ReturnType<typeof userSchema>>;