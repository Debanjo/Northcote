import UserManagement from "@/components/users/UserManagement";

export function meta() {
  return [{ title: "Project Managers | Yetosol" }];
}

export default function ProjectManagers() {
  return (
    <UserManagement
      role="project_manager"
      title="Project Managers"
      description="Manage project manager accounts and assignments."
    />
  );
}