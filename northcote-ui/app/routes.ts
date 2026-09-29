import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  // Public landing page
  index("routes/LandingPage.tsx"),

  // Authentication
  route("login", "routes/Login.tsx"),
  route("register", "routes/Register.tsx"),
  route("forgot-password", "routes/ForgotPassword.tsx"),
  route("reset-password", "routes/ResetPassword.tsx"),

  // Maintenance page (public)
  route("maintenance", "routes/Maintenance.tsx"),

  // Protected application routes
  layout("routes/protected/layout.tsx", [
    // Core dashboard
    route("dashboard", "routes/protected/Dashboard.tsx"),

    // Project management
    route("projects", "routes/protected/Projects.tsx"),

    //  Upload project (admin / superadmin only)
    route("upload-project", "routes/protected/UploadProject.tsx"),

    // User directories
    route("clients", "routes/protected/Clients.tsx"),
    route("project-managers", "routes/protected/ProjectManagers.tsx"),
    route("supervisors", "routes/protected/Supervisors.tsx"),
    route("admins", "routes/protected/Admins.tsx"),

    // System pages
    route("activities-log", "routes/protected/ActivitiesLog.tsx"),
    route("financial-history", "routes/protected/FinancialHistory.tsx"),

    // User profile
    route("profile/:id", "routes/protected/Profile.tsx"),

    // Settings (nested)
    route("settings", "routes/protected/Settings.tsx", [
      route("general", "routes/protected/settings/General.tsx"),
      route("roles", "routes/protected/settings/Roles.tsx"),
    ]),

    //  Super Admin Routes
    route("super-admin", "routes/protected/super-admin/Dashboard.tsx"),
    route("super-admin/users", "routes/protected/super-admin/Users.tsx"),
    route("super-admin/audit", "routes/protected/super-admin/AuditLogs.tsx"),
    route("super-admin/health", "routes/protected/super-admin/Health.tsx"),
    route("super-admin/approvals", "routes/protected/super-admin/Approvals.tsx"),
  ]),

  // Catch-all 404
  route("*", "routes/NotFound.tsx"),
] satisfies RouteConfig;