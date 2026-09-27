import { authClient } from "@/lib/auth-client";
import type { Role, User, UserStatus } from "@/types";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActivityLog, getUsers, toggleBanUser, deleteUser as apiDeleteUser } from "@/lib/api";
import Loader from "@/components/global/Loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { STATUS_CONFIG } from "./statusBadge.js";
import { toast } from "sonner";
import GlobalSearch from "@/components/global/GlobalSearch";
import CustomPagination from "@/components/global/CustomPagination";
import CreateUserModal from "./CreateUserModal.js";
import { getSocket } from "@/lib/socket";
import { DetailsSheet } from "./DetailsSheet.js";
import StatsCards from "@/components/global/StatsCards";

interface UserManagementProps {
  role: Role;
  title: string;
  description: string;
}

const UserManagement = ({ role, title, description }: UserManagementProps) => {
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToModify, setUserToModify] = useState<User | null>(null);

  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["users", role, page],
    queryFn: () => getUsers({ role, page, limit: 10 }),
  });

  const users = data?.res || [];
  const pagination = data?.pagination;

  useEffect(() => {
    const socket = getSocket();
    if (!socket.connected) socket.connect();

    const handleUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    };

    socket.on("notify_user_updated", handleUpdate);
    socket.on("notify_user_created", handleUpdate);
    socket.on("project_created", handleUpdate);
    socket.on("project_updated", handleUpdate);

    return () => {
      socket.off("notify_user_updated", handleUpdate);
      socket.off("notify_user_created", handleUpdate);
      socket.off("project_created", handleUpdate);
      socket.off("project_updated", handleUpdate);
    };
  }, [queryClient]);

  const activityMutation = useMutation({
    mutationFn: createActivityLog,
    onError: (error) => console.log("Activity Log Error:", error),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader label={`Loading ${title}...`} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <h1 className="text-xl font-bold text-red-500">Failed to load data.</h1>
      </div>
    );
  }

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const openBanDialog = (user: User) => {
    setUserToModify(user);
    setBanDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setUserToModify(user);
    setDeleteDialogOpen(true);
  };

  const confirmBanAction = async () => {
    if (!userToModify) return;
    try {
      setLoading(true);
      await toggleBanUser(userToModify._id, !userToModify.banned);
      toast.success(`User ${!userToModify.banned ? "banned" : "unbanned"} successfully`);
      refetch();
    } catch (error) {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
      setBanDialogOpen(false);
      setUserToModify(null);
    }
  };

  const confirmDeleteAction = async () => {
    if (!userToModify) return;
    try {
      setLoading(true);
      await apiDeleteUser(userToModify._id);
      toast.success("User deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setUserToModify(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <StatsCards data={users} />
      <DetailsSheet
        user={selectedUser}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />

      <AlertDialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <AlertDialogContent className="max-w-md bg-white rounded-2xl shadow-xl border border-gray-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black text-black">
              {userToModify?.banned ? "Unban User" : "Ban User"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to {userToModify?.banned ? "unban" : "ban"}{" "}
              <span className="font-semibold text-black">{userToModify?.name}</span> ({userToModify?.email})?
              {!userToModify?.banned && (
                <p className="mt-3 text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
                  Banned users cannot log in to the platform.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBanAction}
              className={
                userToModify?.banned
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }
            >
              {userToModify?.banned ? "Unban User" : "Ban User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md bg-white rounded-2xl shadow-xl border border-gray-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black text-black">
              Delete User
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-black">{userToModify?.name}</span> ({userToModify?.email})?
              <p className="mt-3 text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
                This action cannot be undone. All data associated with this user will be lost.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAction}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 sm:p-6">
          <div>
            <CardTitle className="text-black text-lg sm:text-xl">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <GlobalSearch search={search} setSearch={setSearch} title={`Search ${title}`} />
            <CreateUserModal role={role} />
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          <div className="rounded-md border border-gray-200 overflow-x-auto">
            <Table className="min-w-[700px] md:min-w-full">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="whitespace-nowrap font-bold text-gray-700">Name</TableHead>
                  <TableHead className="whitespace-nowrap font-bold text-gray-700">Email</TableHead>
                  {role === "project_manager" && (
                    <TableHead className="whitespace-nowrap font-bold text-gray-700">Trade</TableHead>
                  )}
                  {role === "client" && (
                    <TableHead className="whitespace-nowrap font-bold text-gray-700">Project</TableHead>
                  )}
                  <TableHead className="whitespace-nowrap font-bold text-gray-700">Status</TableHead>
                  <TableHead className="text-right whitespace-nowrap font-bold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-gray-400">
                      No records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium py-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Avatar className="h-7 w-7 sm:h-8 sm:w-8 shrink-0">
                            <AvatarImage src={user.image || ""} />
                            <AvatarFallback className="text-xs sm:text-sm bg-yellow-100 text-yellow-800">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate max-w-[120px] sm:max-w-none">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="truncate max-w-[150px] sm:max-w-none">{user.email}</TableCell>
                      {role === "project_manager" && (
                        <TableCell>
                          <Badge variant="secondary" className="text-xs whitespace-nowrap">
                            {user.trade || "General"}
                          </Badge>
                        </TableCell>
                      )}
                      {role === "client" && (
                        <TableCell className="truncate max-w-[100px] sm:max-w-none">
                          {user.currentProject || "—"}
                        </TableCell>
                      )}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs whitespace-nowrap ${STATUS_CONFIG[user.status as UserStatus]?.color}`}
                        >
                          {STATUS_CONFIG[user.status as UserStatus]?.label || user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 sm:px-3 text-xs"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsSheetOpen(true);
                            }}
                          >
                            View
                          </Button>
                          <CreateUserModal role={role} user={user} loading={loading} />
                          {session?.user.role === "admin" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 sm:px-3 text-xs"
                                onClick={() => openBanDialog(user)}
                                disabled={loading}
                              >
                                {user.banned ? "Unban" : "Ban"}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="h-8 px-2 sm:px-3 text-xs"
                                onClick={() => openDeleteDialog(user)}
                                disabled={loading}
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <CustomPagination
              loading={isLoading}
              totalPages={pagination?.totalPages || 0}
              currentPage={pagination?.currentPage || 0}
              setPage={setPage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;