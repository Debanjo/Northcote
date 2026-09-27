import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllInvoices } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Receipt,
  CheckCircle2,
  Banknote,
  Clock,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import CustomPagination from "@/components/global/CustomPagination";
import Loader from "@/components/global/Loader";
import GlobalSearch from "@/components/global/GlobalSearch";
import { toast } from "sonner";

export function meta() {
  return [{ title: "Financial History | Yetosol" }];
}

const FinancialHistory = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-invoices", page],
    queryFn: () => getAllInvoices({ page, limit: 10 }),
    placeholderData: (previousData) => previousData,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader label="Loading Financial Records..." />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="p-10 text-center text-red-500">
        Error loading financial history.
      </div>
    );
  }

  const invoices = data?.res || [];
  const pagination = data?.pagination;

  const filteredInvoices = invoices.filter((inv) =>
    inv.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 gap-1">
            <CheckCircle2 size={12} /> Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 gap-1">
            <Clock size={12} /> Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="gap-1 bg-gray-100 text-gray-700">
            <Receipt size={12} /> Draft
          </Badge>
        );
    }
  };

  const totalBilled = invoices.reduce(
    (sum: number, inv: any) => sum + (inv.totalAmount || 0),
    0
  ) / 100;
  const paidCount = invoices.filter((i: any) => i.status === "paid").length;
  const pendingCount = invoices.filter((i: any) => i.status === "pending").length;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
            Revenue Ledger
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium">
            Detailed tracking of all project financial transactions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div className="p-2 sm:p-2.5 bg-yellow-50 rounded-xl">
                <Banknote size={20} className="text-yellow-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <p className="text-gray-500 text-xs sm:text-sm font-medium">Total Billed</p>
              <h3 className="text-xl sm:text-2xl font-black mt-1 text-black">
                ₦{totalBilled.toLocaleString()}
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start text-emerald-600">
              <div className="p-2 sm:p-2.5 bg-emerald-50 rounded-xl">
                <CheckCircle2 size={20} className="text-emerald-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <p className="text-gray-500 text-xs sm:text-sm font-medium">
                Successfully Paid
              </p>
              <h3 className="text-xl sm:text-2xl font-black mt-1 text-black">
                {paidCount} Invoices
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start text-amber-600">
              <div className="p-2 sm:p-2.5 bg-amber-50 rounded-xl">
                <Clock size={20} className="text-amber-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <p className="text-gray-500 text-xs sm:text-sm font-medium">
                Awaiting Payment
              </p>
              <h3 className="text-xl sm:text-2xl font-black mt-1 text-black">
                {pendingCount} Invoices
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 sm:p-6">
          <div>
            <CardTitle className="text-base sm:text-lg text-black">Recent Invoices</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              View and manage client invoices.
            </CardDescription>
          </div>
          <GlobalSearch
            search={search}
            setSearch={setSearch}
            title="Search client..."
          />
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          <div className="rounded-md border border-gray-200 overflow-x-auto">
            <Table className="min-w-[800px] md:min-w-full">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-75 pl-4 sm:pl-6 font-bold text-gray-700 whitespace-nowrap">Client</TableHead>
                  <TableHead className="font-bold text-center text-gray-700 whitespace-nowrap">Amount</TableHead>
                  <TableHead className="font-bold text-center text-gray-700 whitespace-nowrap">Status</TableHead>
                  <TableHead className="font-bold text-center text-gray-700 whitespace-nowrap">Date</TableHead>
                  <TableHead className="text-right pr-4 sm:pr-6 font-bold text-gray-700 whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-40 text-center text-gray-400 italic"
                    >
                      No invoices found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((inv) => (
                    <TableRow
                      key={inv._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="pl-4 sm:pl-6 py-3 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border border-gray-200 shrink-0">
                            <AvatarImage src={inv.user?.image || ""} />
                            <AvatarFallback className="font-bold text-xs bg-yellow-100 text-yellow-800">
                              {inv.user?.name
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("") || "C"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-black truncate">
                              {inv.user?.name || "Unknown Client"}
                            </span>
                            <span className="text-[10px] sm:text-[11px] text-gray-500 truncate">
                              {inv.user?.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-black text-black text-sm sm:text-base whitespace-nowrap">
                        ₦{(inv.totalAmount / 100).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(inv.status)}
                      </TableCell>
                      <TableCell className="text-center text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                        {inv.createdAt
                          ? format(new Date(inv.createdAt), "MMM dd, yyyy")
                          : "---"}
                      </TableCell>
                      <TableCell className="text-right pr-4 sm:pr-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info("Invoice details coming soon")}
                          className="text-light-blue-600 hover:text-light-blue-700 h-8 px-2 sm:px-3 text-xs"
                        >
                          <Eye size={14} className="sm:mr-1" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
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

export default FinancialHistory;