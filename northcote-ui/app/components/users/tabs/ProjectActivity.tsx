import { useQuery } from "@tanstack/react-query";
import { getActivityLogs } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, UserPlus, CheckCircle2, AlertCircle, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import type { User } from "@/types";

const getActionConfig = (action: string) => {
  const a = action.toLowerCase();
  if (a.includes("create") || a.includes("project")) {
    return { icon: FileText, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" };
  }
  if (a.includes("assign") || a.includes("team")) {
    return { icon: UserPlus, color: "bg-light-blue-100 text-light-blue-800 dark:bg-light-blue-900/30 dark:text-light-blue-400" };
  }
  if (a.includes("complete") || a.includes("paid")) {
    return { icon: CheckCircle2, color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" };
  }
  return { icon: Activity, color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400" };
};

export default function History({ user }: { user: User }) {
  const { data, isLoading } = useQuery({
    queryKey: ["activities-log", user._id],
    queryFn: () => getActivityLogs({ page: 1, limit: 20 }),
  });

  const logs = data?.res || [];
  const userLogs = logs.filter((log) => 
    log.details?.includes(user._id) || log.details?.includes(user.name)
  );

  if (isLoading) return <div className="py-4 text-center text-gray-500">Loading activity...</div>;

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-sm bg-white dark:bg-zinc-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-black dark:text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-yellow-500" />
            Project Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userLogs.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No recent activity.</p>
          ) : (
            <div className="space-y-3">
              {userLogs.slice(0, 10).map((log) => {
                const { icon: Icon, color } = getActionConfig(log.action);
                return (
                  <div key={log._id} className="flex gap-3">
                    <div className={cn("p-2 rounded-lg shrink-0", color)}>
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-black dark:text-white">{log.action}</p>
                        <span className="text-[10px] text-gray-400">
                          {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {log.user?.name} • {log.details}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}