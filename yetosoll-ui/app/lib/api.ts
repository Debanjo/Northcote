// yetosoll-ui/app/lib/api.ts
import type { PaginatedResponse, Role, User, SiteInspection, ActivityLog, Invoice } from "@/types";

export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api";

// ============== HELPER: Fetch with auth and maintenance handling ==============
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  // Safely attach the token only if running in a browser
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth-token");
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (res.status === 503) {
    if (typeof window !== "undefined" && !window.location.pathname.includes("/maintenance")) {
      window.location.href = "/maintenance";
    }
    throw new Error("System under maintenance");
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Request failed with status ${res.status}`);
  }

  return res.json();
};

// ============== USER MANAGEMENT ==============
export const getUsers = async (params: {
  role?: Role | "all";
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<User>> => {
  const query = new URLSearchParams({
    ...(params.role && params.role !== "all" && { role: params.role }),
    page: (params.page || 1).toString(),
    limit: (params.limit || 10).toString(),
  }).toString();
  return fetchWithAuth(`${API_URL}/users?${query}`);
};

export const getUserById = async (userId: string) => {
  return fetchWithAuth(`${API_URL}/users/profile/${userId}`);
};

export const updateUser = async ({ userId, userData }: { userId: string; userData: Partial<User> }) => {
  return fetchWithAuth(`${API_URL}/users/update/${userId}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
};

export const toggleBanUser = async (userId: string, banned: boolean) => {
  return fetchWithAuth(`${API_URL}/users/toggle-ban/${userId}`, {
    method: "POST",
    body: JSON.stringify({ banned }),
  });
};

export const deleteUser = async (userId: string) => {
  return fetchWithAuth(`${API_URL}/users/${userId}`, { method: "DELETE" });
};

// ============== PROJECTS ==============
export const createProject = async (data: {
  name: string;
  location: string;
  category: string;
  year: string;
  description: string;
  image: string;
  requirements?: string[];
  clientId?: string;
  estimatedCompletion?: string;
}) => {
  const res = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to create project");
  return res.json();
};

export const createUserProject = async (data: {
  clientId: string;
  name: string;
  requirements?: string[];
}) => {
  const res = await fetch(`${API_URL}/users/project`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to create user project");
  return res.json();
};

export const getAllProjects = async () => {
  return fetchWithAuth(`${API_URL}/projects/all`);
};

export const getClientProject = async (clientId: string) => {
  return fetchWithAuth(`${API_URL}/projects/client/${clientId}`);
};

export const getProjectMilestones = async (projectId: string) => {
  return fetchWithAuth(`${API_URL}/projects/${projectId}/milestones`);
};

export const getProjectDocuments = async (projectId: string) => {
  return fetchWithAuth(`${API_URL}/projects/${projectId}/documents`);
};

export const updateProjectProgress = async (projectId: string, progress: number) => {
  return fetchWithAuth(`${API_URL}/projects/${projectId}/progress`, {
    method: "PUT",
    body: JSON.stringify({ progress }),
  });
};

// ============== MILESTONES (CRUD) ==============
export const createMilestone = async (projectId: string, data: { name: string; dueDate: string; status?: string; evidenceUrls?: string[] }) => {
  return fetchWithAuth(`${API_URL}/projects/${projectId}/milestones`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateMilestone = async (milestoneId: string, data: { name?: string; dueDate?: string; status?: string; evidenceUrls?: string[] }) => {
  return fetchWithAuth(`${API_URL}/milestones/${milestoneId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteMilestone = async (milestoneId: string) => {
  return fetchWithAuth(`${API_URL}/milestones/${milestoneId}`, { method: "DELETE" });
};

// ============== DOCUMENTS (CRUD) ==============
export const createDocument = async (projectId: string, data: { name: string; type: string; fileUrl?: string; status?: string }) => {
  return fetchWithAuth(`${API_URL}/projects/${projectId}/documents`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const deleteDocument = async (documentId: string) => {
  return fetchWithAuth(`${API_URL}/documents/${documentId}`, { method: "DELETE" });
};

// ============== SITE INSPECTIONS ==============
export const getProjectInspections = async (projectId: string): Promise<SiteInspection[]> => {
  return fetchWithAuth(`${API_URL}/inspections/project/${projectId}`);
};

export const createInspection = async (data: { projectId: string; inspectionType: string; location: string; imageUrl: string }) => {
  return fetchWithAuth(`${API_URL}/inspections`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateInspection = async ({ id, data }: { id: string; data: { inspectorNotes?: string; status?: string } }) => {
  return fetchWithAuth(`${API_URL}/inspections/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// ============== ACTIVITY LOGS ==============
export const getActivityLogs = async (params: { page?: number; limit?: number }): Promise<PaginatedResponse<ActivityLog>> => {
  const query = new URLSearchParams({
    page: (params.page || 1).toString(),
    limit: (params.limit || 10).toString(),
  }).toString();
  return fetchWithAuth(`${API_URL}/activity-logs?${query}`);
};

export const createActivityLog = async (data: { userId: string; action: string; details?: string }) => {
  return fetchWithAuth(`${API_URL}/activity-logs/create`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// ============== INVOICES & BILLING ==============
export const getMyActiveInvoice = async () => {
  return fetchWithAuth(`${API_URL}/invoices/my-active-invoice`).catch((err) => {
    if (err.message.includes("404")) return null;
    throw err;
  });
};

export const getBillingHistory = async (_userId?: string) => {
  // The server derives the user from the session; there is no /history/:id route,
  // so the id argument is accepted only for call-site compatibility and ignored.
  return fetchWithAuth(`${API_URL}/invoices/history`);
};

export const getAllInvoices = async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Invoice>> => {
  const query = new URLSearchParams({
    page: (params?.page || 1).toString(),
    limit: (params?.limit || 10).toString(),
  }).toString();
  return fetchWithAuth(`${API_URL}/invoices?${query}`);
};

export const markInvoiceAsPaid = async (invoiceId: string) => {
  return fetchWithAuth(`${API_URL}/invoices/${invoiceId}/pay`, { method: "POST" });
};

export const addCharge = async (data: { clientId: string; description: string; priceInCents: number }) => {
  return fetchWithAuth(`${API_URL}/invoices/charge`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// ============== NOTIFICATIONS ==============
export const fetchNotifications = async () => {
  return fetchWithAuth(`${API_URL}/notifications`);
};

export const markAsRead = async (id: string) => {
  return fetchWithAuth(`${API_URL}/notifications/${id}/read`, { method: "POST" });
};

// ============== FILE UPLOAD ==============
export const deleteFile = async ({ fileUrl }: { fileUrl: string }) => {
  return fetchWithAuth(`${API_URL}/uploadthing/delete`, {
    method: "DELETE",
    body: JSON.stringify({ fileUrl }),
  });
};

// ============== CHAT ==============
export const getUnreadMessageCount = async (userId: string) => {
  return fetchWithAuth(`${API_URL}/chat/unread/${userId}`).then(data => data.count);
};

// ============== SETTINGS ==============
export const getSetting = async (key: string) => {
  return fetchWithAuth(`${API_URL}/settings/${key}`).then(data => data.value);
};

export const setSetting = async (key: string, value: any) => {
  return fetchWithAuth(`${API_URL}/settings/${key}`, {
    method: "PUT",
    body: JSON.stringify({ value }),
  });
};

export const getAllSettings = async () => {
  return fetchWithAuth(`${API_URL}/settings`);
};