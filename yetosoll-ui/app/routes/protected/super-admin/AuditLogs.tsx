import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getActivityLogs } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Loader from "@/components/global/Loader";
import CustomPagination from "@/components/global/CustomPagination";

export default function SuperAdminAuditLogs() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ["audit-logs", page],
    queryFn: () => getActivityLogs({ page, limit }),
  });

  if (isLoading) return <Loader label="Loading audit logs..." />;

  const logs = data?.res || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-black">Advanced Audit Logs</h1>
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">System-Wide Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table className="min-w-[1000px]">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-gray-400">
                      No logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log: any) => (
                    <TableRow key={log._id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(log.createdAt), "MMM dd, yyyy HH:mm")}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{log.user?.name}</span>
                          <span className="text-xs text-gray-500">{log.user?.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {log.user?.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-light-blue-600">
                        {log.action}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{log.details || "—"}</TableCell>
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
}