import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Info } from "lucide-react";

const roles = [
  {
    name: "Admin",
    role: "admin",
    description: "Full system access, manage users, settings, and all projects",
    permissions: ["All permissions"],
    color: "bg-red-100 text-red-800",
  },
  {
    name: "Project Manager",
    role: "project_manager",
    description: "Create and manage projects, assign teams, view financials",
    permissions: ["Manage projects", "Assign staff", "View financials", "Upload documents"],
    color: "bg-blue-100 text-blue-800",
  },
  {
    name: "Supervisor",
    role: "supervisor",
    description: "Oversee site operations, upload inspections, manage milestones",
    permissions: ["Upload inspections", "Manage milestones", "View assigned projects"],
    color: "bg-green-100 text-green-800",
  },
  {
    name: "Engineer",
    role: "engineer",
    description: "View project details, add technical notes, review documents",
    permissions: ["View projects", "Add inspection notes", "Review documents"],
    color: "bg-purple-100 text-purple-800",
  },
  {
    name: "Client",
    role: "client",
    description: "View own project dashboard, message team, view documents and financials",
    permissions: ["View own project", "Message team", "View documents", "View invoices"],
    color: "bg-gray-100 text-gray-800",
  },
];

export default function RolesSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-black">Roles & Permissions</h2>
        <p className="text-sm text-gray-500">View role definitions and access levels in the system.</p>
      </div>

      <div className="bg-light-blue-50 border border-light-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-light-blue-600 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-700">
          Roles are managed by the system administrator. To change permissions or assign roles, please edit the user's profile in the respective user management section.
        </p>
      </div>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-black flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-600" />
            System Roles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.role}>
                  <TableCell>
                    <Badge className={role.color}>{role.name}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">{role.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((perm, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="outline" disabled className="border-gray-300 text-gray-500">
          Edit roles (coming soon)
        </Button>
      </div>
    </div>
  );
}