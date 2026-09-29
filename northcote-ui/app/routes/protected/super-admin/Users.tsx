import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Loader from "@/components/global/Loader";
import CustomPagination from "@/components/global/CustomPagination";
import ImpersonateModal from "./ImpersonateModal.js";

const fetchUsers = async (page: number, search: string) => {
  const res = await fetch(
    `${API_URL}/super-admin/users?page=${page}&limit=10&search=${search}`,
    { credentials: "include" }
  );
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export default function SuperAdminUsers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["super-admin-users", page, search],
    queryFn: () => fetchUsers(page, search),
  });

  if (isLoading) return <Loader label="Loading users..." />;

  const users = data?.users || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / (data?.limit || 10));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-black">All Users</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-64 bg-white border-gray-200"
          />
        </div>
      </div>

      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">System Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Banned</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-gray-400">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user: any) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.image} />
                            <AvatarFallback className="bg-yellow-100 text-yellow-800">
                              {user.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.banned ? (
                          <Badge variant="destructive">Banned</Badge>
                        ) : (
                          <Badge variant="outline">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {/* ✅ Pass userId and userName props correctly */}
                        <ImpersonateModal userId={user._id} userName={user.name} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <CustomPagination
              loading={isLoading}
              totalPages={totalPages}
              currentPage={page}
              setPage={setPage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}