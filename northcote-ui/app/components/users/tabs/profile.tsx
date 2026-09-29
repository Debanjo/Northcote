import {
  User,
  Mail,
  Calendar,
  Hammer,
  Building2,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { User as UserType } from "@/types";

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg shadow-sm border border-gray-100 bg-white dark:border-zinc-800 dark:bg-zinc-950 truncate">
      <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-md">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="text-sm font-semibold text-black dark:text-white mt-0.5">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}

export default function Profile({ user }: { user: UserType }) {
  const isClient = user.role === "client";
  const isProjectManager = user.role === "project_manager";
  const isStaff = ["project_manager", "supervisor", "engineer"].includes(user.role);

  // Safely format requirements: handle string, array, or undefined
  const formatRequirements = (req: any): string => {
    if (!req) return "None specified";
    if (Array.isArray(req)) return req.join(", ");
    if (typeof req === "string") return req;
    return "None specified";
  };

  // Safely format skills
  const formatSkills = (skills: any): string => {
    if (!skills) return "None listed";
    if (Array.isArray(skills)) return skills.join(", ");
    if (typeof skills === "string") return skills;
    return "None listed";
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <InfoItem icon={Mail} label="Email" value={user.email} />
      <InfoItem
        icon={Calendar}
        label="Joined"
        value={new Date(user.createdAt).toLocaleDateString()}
      />

      {isClient ? (
        <>
          <InfoItem
            icon={Building2}
            label="Current Project"
            value={user.currentProject || "None"}
          />
          <InfoItem icon={User} label="Client Notes" value={user.clientNotes || "No notes"} />
          <InfoItem
            icon={Hammer}
            label="Project Requirements"
            value={formatRequirements(user.requirements)}
          />
        </>
      ) : isStaff ? (
        <>
          <InfoItem
            icon={Building2}
            label="Department"
            value={user.department || "General"}
          />
          <InfoItem
            icon={Wrench}
            label="Trade / Specialization"
            value={user.trade || "Not specified"}
          />
          <InfoItem
            icon={Hammer}
            label="Skills"
            value={formatSkills(user.skills)}
          />
          {isProjectManager && (
            <InfoItem
              icon={Calendar}
              label="Availability"
              value={user.availability ? "Available" : "Unavailable"}
            />
          )}
        </>
      ) : (
        // Admin or other roles
        <InfoItem
          icon={Building2}
          label="Department"
          value={user.department || "Administration"}
        />
      )}
    </div>
  );
}