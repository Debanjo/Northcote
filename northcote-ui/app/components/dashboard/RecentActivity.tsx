import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getActivityLogs } from "@/lib/api";
import {
  FileText,
  UserPlus,
  Activity,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const getActionConfig = (action: string) => {
  const a = action.toLowerCase();
  if (a.includes("admit") || a.includes("register") || a.includes("create")) {
    return {
      icon: UserPlus,
      color: "bg-orange-100 text-orange-600",
    };
  }
  if (a.includes("lab") || a.includes("x-ray") || a.includes("inspection") || a.includes("analyze") || a.includes("milestone")) {
    return {
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
    };
  }
  if (a.includes("discharge") || a.includes("paid") || a.includes("complete")) {
    return {
      icon: CheckCircle2,
      color: "bg-green-100 text-green-600",
    };
  }
  if (a.includes("error") || a.includes("ban") || a.includes("delete")) {
    return {
      icon: AlertCircle,
      color: "bg-red-100 text-red-600",
    };
  }
  return {
    icon: Activity,
    color: "bg-gray-100 text-gray-600",
  };
};

export function RecentActivity() {
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const limit = 5; // items per page

  const { data, isLoading, isError } = useQuery({
    queryKey: ["activities-log", page],
    queryFn: () => getActivityLogs({ page, limit }),
    placeholderData: (previousData) => previousData,
  });

  const logs = data?.res || [];
  const pagination = data?.pagination;

  const handleItemClick = (log: any) => {
    setSelectedLog(log);
    setModalOpen(true);
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
      </div>
    );
  }

  if (isError)
    return (
      <p className="text-xs text-red-500 text-center">
        Error loading activities.
      </p>
    );

  return (
    <>
      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="text-center py-10">
            <Activity className="h-8 w-8 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400 italic">
              No recent activity found.
            </p>
          </div>
        ) : (
          logs.map((log) => {
            const { icon: Icon, color } = getActionConfig(log.action);
            return (
              <div
                key={log._id}
                className="flex gap-4 group transition-all cursor-pointer hover:bg-gray-50 p-2 rounded-lg -mx-2"
                onClick={() => handleItemClick(log)}
              >
                <div
                  className={cn(
                    "p-2.5 rounded-xl shrink-0 h-10 w-10 flex items-center justify-center transition-transform group-hover:scale-110",
                    color
                  )}
                >
                  <Icon size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {log.action}
                    </p>
                    <span className="text-[10px] font-bold text-gray-400 uppercase shrink-0 mt-0.5">
                      {formatDistanceToNow(new Date(log.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate leading-relaxed">
                    <span className="font-semibold text-gray-700">
                      {log.user?.name || "Unknown User"}
                    </span>
                    {log.details ? ` • ${log.details}` : ""}
                  </p>
                </div>
              </div>
            );
          })
        )}

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="h-7 w-7 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToPage(page + 1)}
                disabled={page === pagination.totalPages}
                className="h-7 w-7 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* View All Link */}
        <div className="text-center pt-2">
          <Link
            to="/activities-log"
            className="inline-flex items-center text-xs font-medium text-light-blue-600 hover:text-light-blue-700"
          >
            View All Activities <ExternalLink className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Activity Detail Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          {selectedLog && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-black flex items-center gap-2">
                  {(() => {
                    const { icon: Icon } = getActionConfig(selectedLog.action);
                    return <Icon className="h-5 w-5" />;
                  })()}
                  {selectedLog.action}
                </DialogTitle>
                <DialogDescription className="text-gray-500">
                  Full details of this activity
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedLog.user?.image || ""} />
                    <AvatarFallback className="bg-yellow-100 text-yellow-800">
                      {selectedLog.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-bold text-black">{selectedLog.user?.name || "Unknown User"}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="capitalize">
                        {selectedLog.user?.role || "user"}
                      </Badge>
                      {selectedLog.user?.email && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {selectedLog.user.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">Details</p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {selectedLog.details || "No additional details provided."}
                  </p>
                </div>

                <div className="text-sm text-gray-500 space-y-1">
                  <p>
                    <span className="font-medium">Performed:</span>{" "}
                    {format(new Date(selectedLog.createdAt), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                  </p>
                  <p>
                    <span className="font-medium">Relative:</span>{" "}
                    {formatDistanceToNow(new Date(selectedLog.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}