export type Role =
  | "all"
  | "superadmin"
  | "admin"
  | "project_manager"
  | "supervisor"
  | "engineer"
  | "client";

export type ProjectStatus = "active" | "on_hold" | "completed" | "cancelled";
export type StaffStatus = "active" | "on_leave" | "resigned";
export type UserStatus = ProjectStatus | StaffStatus;

export interface SiteInspection {
  _id: string;
  project: string; // project ID
  inspectionType: string;
  location: string;
  imageUrl: string;
  inspectorNotes?: string;
  status: "pending" | "inspected" | "approved";
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  status: UserStatus;
  banned: boolean;
  trade?: string;          
  department?: string;
  availability?: boolean;
  skills?: string[];
  projectHistory?: string; 
  clientNotes?: string;
  currentProject?: string;   
  requirements?: string[];  
  progress?: number; 
  changeOrders?: string[]; 
  projects?: string[];
  assignedManagerId?: string | null;
  assignedManagerName?: string;
  assignedSupervisorId?: string | null;
  assignedSupervisorName?: string;
  assignmentReasoning?: string;  
}

export interface PaginatedResponse<T> {
  res: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalData: number;
    limit: number;
  };
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "system" | "assignment" | "inspection" | "alert";
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface ActivityLog {
  _id: string;
  user: User;
  action: string;
  details?: string;
  createdAt: Date;
}

export interface Invoice {
  _id: string;
  clientId: string;
  status: "draft" | "pending" | "paid";
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  totalAmount: number;
  createdAt: Date;
  user?: User; // populated on frontend
}