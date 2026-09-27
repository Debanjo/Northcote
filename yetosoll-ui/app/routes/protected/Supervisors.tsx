import UserManagement from "@/components/users/UserManagement";

export function meta() {
  return [{ title: "Supervisors | Yetosol" }];
}

export default function Supervisors() {
  return (
    <UserManagement
      role="supervisor"
      title="Supervisors Directory"
      description="Manage and track site supervisors."
    />
  );
}