import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getActivityLogs } from "@/lib/api";
import CustomPagination from "@/components/global/CustomPagination";
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
import { format } from "date-fns";
import GlobalSearch from "@/components/global/GlobalSearch";

export function meta() {
  return [{ title: "System Activities | Yetosol" }];
}

const ActivitiesLog = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["activities-log", page],
    queryFn: () => getActivityLogs({ page, limit }),
    placeholderData: (previousData) => previousData,
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <Loader label="Fetching logs..." />
      </div>
    );

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500 font-bold">
        Error loading activity logs.
      </div>
    );
  }

  const logs = data?.res || [];
  const pagination = data?.pagination;

  const filteredLogs = logs?.filter((log) =>
    log?.action.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 sm:p-6">
        <div>
          <CardTitle className="font-bold text-lg sm:text-xl text-black">System Activities</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            A history of all actions performed by users.
          </CardDescription>
        </div>
        <GlobalSearch
          search={search}
          setSearch={setSearch}
          title="Search by action..."
        />
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
        <div className="rounded-md border border-gray-200 overflow-x-auto">
          <Table className="min-w-[900px] md:min-w-full">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-bold text-gray-700 whitespace-nowrap">User</TableHead>
                <TableHead className="font-bold text-gray-700 whitespace-nowrap">Role</TableHead>
                <TableHead className="font-bold text-gray-700 whitespace-nowrap">Action</TableHead>
                <TableHead className="font-bold text-gray-700 whitespace-nowrap">Details</TableHead>
                <TableHead className="font-bold text-gray-700 whitespace-nowrap">Date & Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center h-24 text-gray-400"
                  >
                    No activity logs found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log._id} className="hover:bg-gray-50">
                    <TableCell className="font-medium py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Avatar className="h-7 w-7 sm:h-8 sm:w-8 shrink-0">
                          <AvatarImage src={log.user?.image || ""} />
                          <AvatarFallback className="bg-yellow-100 text-yellow-800 text-xs sm:text-sm">
                            {log.user?.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold text-black truncate">
                            {log.user?.name}
                          </span>
                          <span className="text-[10px] sm:text-xs text-gray-500 truncate">
                            {log.user?.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge variant="secondary" className="capitalize text-[10px] sm:text-xs bg-gray-100 text-gray-700">
                        {log.user?.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="text-sm font-medium text-light-blue-600">
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500 truncate max-w-[150px] sm:max-w-[250px] md:max-w-[300px] block">
                        {log.details || "---"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                      {format(new Date(log.createdAt), "MMM dd, yyyy - hh:mm a")}
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
  );
};

export default ActivitiesLog;