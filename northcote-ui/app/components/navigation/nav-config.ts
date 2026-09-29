import type { Role } from "@/types";
import {
  LayoutDashboard,
  Users,
  Hammer,
  ClipboardCheck,
  FileText,
  Settings2,
  Receipt,
  FolderKanban,
  Shield,
  Upload,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon?: any;
  allowedRoles: Role[];
  items?: {
    title: string;
    url: string;
    allowedRoles?: Role[];
  }[];
}

export const navConfig: {
  navMain: NavItem[];
  navAdmin: NavItem[];
  navSecondary: NavItem[];
} = {
  navMain: [
    //  SUPER ADMIN SECTION (visible only to superadmin)
    {
      title: "Super Admin",
      url: "/super-admin",
      icon: Shield,
      allowedRoles: ["superadmin"],
      items: [
        { title: "Dashboard", url: "/super-admin" },
        { title: "All Users", url: "/super-admin/users" },
        { title: "Audit Logs", url: "/super-admin/audit" },
        { title: "System Health", url: "/super-admin/health" },
        { title: "Approvals", url: "/super-admin/approvals" },
      ],
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      allowedRoles: ["admin", "superadmin", "project_manager", "supervisor", "engineer", "client"],
    },
    {
      title: "Projects",
      url: "/projects",
      icon: FolderKanban,
      allowedRoles: ["admin", "superadmin", "project_manager", "supervisor"],
      items: [
        { title: "All Projects", url: "/projects" },
      ],
    },
    //  Upload Project (admin / superadmin only)
    {
      title: "Upload Project",
      url: "/upload-project",
      icon: Upload,
      allowedRoles: ["admin", "superadmin"],
    },
    {
      title: "Clients",
      url: "/clients",
      icon: Users,
      allowedRoles: ["admin", "superadmin", "project_manager", "supervisor"],
      items: [
        { title: "All Clients", url: "/clients" },
      ],
    },
    {
      title: "Project Managers",
      url: "/project-managers",
      icon: Hammer,
      allowedRoles: ["admin", "superadmin"],
      items: [
        { title: "All Managers", url: "/project-managers" },
      ],
    },
    {
      title: "Supervisors",
      url: "/supervisors",
      icon: ClipboardCheck,
      allowedRoles: ["admin", "superadmin", "project_manager"],
      items: [
        { title: "All Supervisors", url: "/supervisors" },
      ],
    },
    {
      title: "Financial Records",
      url: "/financial-history",
      icon: Receipt,
      allowedRoles: ["admin", "superadmin", "project_manager"],
      items: [
        { title: "All Records", url: "/financial-history" },
      ],
    },
    {
      title: "Activity Logs",
      url: "/activities-log",
      icon: FileText,
      allowedRoles: ["admin", "superadmin"],
      items: [
        { title: "All Activity", url: "/activities-log" },
      ],
    },
  ],
  navAdmin: [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      allowedRoles: ["admin", "superadmin"],
      items: [
        { title: "General", url: "/settings/general" },
        { title: "Roles & Permissions", url: "/settings/roles" },
      ],
    },
  ],
  navSecondary: [],
};

export function getRouteConfig(path: string, items: NavItem[]): NavItem | null {
  for (const item of items) {
    if (item.url === path) return item;
    if (item.items) {
      const found = item.items.find((sub) => sub.url === path);
      if (found) {
        return {
          ...found,
          allowedRoles: found.allowedRoles || item.allowedRoles,
        } as NavItem;
      }
    }
  }
  return null;
}