import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateUserModal from "@/components/users/CreateUserModal";
import type { Role } from "@/types";
import { Plus, ChevronDown } from "lucide-react";

const QuickActions = ({ role }: { role: Role | null | undefined }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!role || role === "client") return null;

  // Desktop inline buttons (shown on large screens)
  const DesktopActions = () => (
    <div className="hidden lg:flex items-center gap-2">
      {["admin", "superadmin"].includes(role) && (
        <>
          <CreateUserModal role="project_manager" />
          <CreateUserModal role="supervisor" />
        </>
      )}
      {["admin", "superadmin", "project_manager"].includes(role) && (
        <Button
          onClick={() => navigate("/upload-project")}
          className="bg-yellow-500 text-black hover:bg-yellow-400 gap-2"
        >
          <Plus size={16} /> New Project
        </Button>
      )}
      {role === "project_manager" && <CreateUserModal role="client" />}
      {["supervisor", "engineer"].includes(role) && (
        <CreateUserModal role="client" />
      )}
    </div>
  );

  // Mobile/Tablet dropdown (shown on small & medium screens)
  const MobileDropdown = () => (
    <div className="block lg:hidden">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 border-gray-300 w-full sm:w-auto">
            <Plus size={16} />
            Quick Actions
            <ChevronDown size={16} className="opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white">
          {["admin", "superadmin"].includes(role) && (
            <>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <CreateUserModal role="project_manager" />
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <CreateUserModal role="supervisor" />
              </DropdownMenuItem>
            </>
          )}
          {["admin", "superadmin", "project_manager"].includes(role) && (
            <DropdownMenuItem
              onClick={() => {
                navigate("/upload-project");
                setOpen(false);
              }}
            >
              <Plus size={14} className="mr-2" /> New Project
            </DropdownMenuItem>
          )}
          {role === "project_manager" && (
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <CreateUserModal role="client" />
            </DropdownMenuItem>
          )}
          {["supervisor", "engineer"].includes(role) && (
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <CreateUserModal role="client" />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <>
      <DesktopActions />
      <MobileDropdown />
    </>
  );
};

export default QuickActions;