import UserManagement from "@/components/users/UserManagement";

export function meta() {
  return [{ title: "Clients | Yetosol" }];
}

export default function Clients() {
  return (
    <UserManagement
      role="client"
      title="Client Directory"
      description="Manage client accounts and project history."
    />
  );
}