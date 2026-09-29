import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Clock, Loader2, ShieldAlert } from "lucide-react";
import { format } from "date-fns";
import { useEffect } from "react";
import { getSocket } from "@/lib/socket";

export default function ApprovalsPage() {
  const queryClient = useQueryClient();

  const { data: requests, isLoading, refetch } = useQuery({
    queryKey: ["pending-approvals"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/approval/pending`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch approvals");
      return res.json();
    },
    refetchInterval: 15000, // Background refresh every 15 seconds
  });

  // Real‑time updates via socket
  useEffect(() => {
    const socket = getSocket();
    if (!socket.connected) socket.connect();
    socket.emit("join_superadmin_room");

    const handleNewRequest = () => {
      refetch();
    };

    socket.on("new_approval_request", handleNewRequest);
    return () => {
      socket.off("new_approval_request", handleNewRequest);
    };
  }, [refetch]);

  const processMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      const res = await fetch(`${API_URL}/approval/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to process request");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pending-approvals"] });
      toast.success(`Request ${variables.approved ? "approved" : "rejected"} successfully`);
    },
    onError: () => {
      toast.error("Failed to process request");
    },
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case "delete_user":
        return <Badge className="bg-red-100 text-red-800">Delete User</Badge>;
      case "ban_user":
        return <Badge className="bg-orange-100 text-orange-800">Ban User</Badge>;
      case "delete_project":
        return <Badge className="bg-red-100 text-red-800">Delete Project</Badge>;
      case "change_role":
        return <Badge className="bg-blue-100 text-blue-800">Change Role</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-black flex items-center gap-2">
          <ShieldAlert className="h-8 w-8 text-yellow-500" />
          Approval Requests
        </h1>
        <p className="text-gray-500">Review and manage actions requested by administrators.</p>
      </div>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-black">Pending Actions</CardTitle>
          <CardDescription>These actions require your approval before execution.</CardDescription>
        </CardHeader>
        <CardContent>
          {!requests || requests.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3 opacity-50" />
              <p className="text-gray-500">No pending approval requests.</p>
              <p className="text-sm text-gray-400">All caught up!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req: any) => (
                <div
                  key={req._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4 mb-3 sm:mb-0">
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getActionBadge(req.action)}
                        <span className="text-xs text-gray-400">
                          Request ID: {req._id.slice(-6)}
                        </span>
                      </div>
                      <p className="font-medium text-black">
                        Target: <span className="font-bold">{req.targetName}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Requested by: {req.requestedByName} ({req.requestedByEmail})
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {format(new Date(req.createdAt), "PPP 'at' p")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 self-end sm:self-center">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-300 hover:bg-green-50"
                      onClick={() => processMutation.mutate({ id: req._id, approved: true })}
                      disabled={processMutation.isPending}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => processMutation.mutate({ id: req._id, approved: false })}
                      disabled={processMutation.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}