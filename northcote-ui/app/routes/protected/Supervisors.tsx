import UserManagement from "@/components/users/UserManagement";

export function meta() {
  return [{ title: "Supervisors | NorthCote" }];
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