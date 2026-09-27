import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import {
  getUserById,
  getMyActiveInvoice,
  getBillingHistory,
} from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  User,
  Receipt,
  History,
  CheckCircle2,
  Building2,
  Hammer,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { STATUS_CONFIG } from "@/components/users/statusBadge";
import Loader from "@/components/global/Loader";

export function meta() {
  return [{ title: "User Profile | Yetosol" }];
}

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const loggedInUser = session?.user;

  const targetUserId = id || loggedInUser?.id;
  const isViewingOwnProfile = loggedInUser?.id === targetUserId;
  const isAdmin = loggedInUser?.role === "admin";

  const { data: profileUser, isLoading: profileLoading } = useQuery({
    queryKey: ["user", targetUserId],
    queryFn: () => getUserById(targetUserId!),
    enabled: !!targetUserId,
  });

  const isClient = profileUser?.role === "client";
  const isStaff = ["project_manager", "supervisor", "engineer"].includes(profileUser?.role);

  const { data: invoice, isLoading: invoiceLoading } = useQuery({
    queryKey: ["my-invoice", targetUserId],
    queryFn: getMyActiveInvoice,
    enabled: !!targetUserId && isClient && (isViewingOwnProfile || isAdmin),
  });

  const { data: billingHistory, isLoading: historyLoading } = useQuery({
    queryKey: ["billing-history", targetUserId],
    queryFn: () => getBillingHistory(targetUserId!),
    enabled: !!targetUserId && isClient && (isViewingOwnProfile || isAdmin),
  });

  if (sessionLoading || profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-white">
        <Loader label="Loading profile..." />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-red-500 font-bold">
        User not found.
      </div>
    );
  }

  const statusConf =
    STATUS_CONFIG[profileUser.status as any] || STATUS_CONFIG["active"];

  const formatNaira = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount / 100);

  // Safe formatter for requirements field (can be string, array, or undefined)
  const formatRequirements = (req: any): string => {
    if (!req) return "None";
    if (Array.isArray(req)) return req.join(", ");
    return String(req);
  };

  // Safe formatter for skills field
  const formatSkills = (skills: any): string => {
    if (!skills) return "None listed";
    if (Array.isArray(skills)) return skills.join(", ");
    return String(skills);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 mt-6 pb-20">
      <h1 className="text-3xl font-bold tracking-tight text-black">
        {isViewingOwnProfile ? "My Profile" : `${profileUser.name}'s Profile`}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT COLUMN: IDENTITY */}
        <Card className="col-span-1 bg-white border border-gray-200 shadow-sm h-min">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4 border-4 border-white shadow-sm">
              <AvatarImage src={profileUser.image} />
              <AvatarFallback className="text-2xl bg-yellow-100 text-yellow-800">
                {profileUser.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold text-black">{profileUser.name}</h2>
            <p className="text-sm text-gray-500 mb-4">{profileUser.email}</p>
            <div className="flex gap-2">
              <Badge variant="secondary" className="capitalize bg-gray-100 text-gray-700">
                {profileUser.role?.replace("_", " ")}
              </Badge>
              <Badge variant="outline" className={statusConf.color}>
                {statusConf.label}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT COLUMN: DETAILS & BILLING */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          {/* Details Section */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-black">
                <User className="h-5 w-5 text-yellow-600" />
                {isClient ? "Project Context" : "Professional Info"}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-y-4 text-sm">
              {isClient ? (
                <>
                  <DetailItem
                    icon={<Building2 className="h-4 w-4" />}
                    label="Current Project"
                    value={profileUser.currentProject || "None"}
                  />
                  <DetailItem
                    icon={<Hammer className="h-4 w-4" />}
                    label="Requirements"
                    value={formatRequirements(profileUser.requirements)}
                  />
                  <div className="col-span-2">
                    <DetailItem
                      icon={<Wrench className="h-4 w-4" />}
                      label="Client Notes"
                      value={profileUser.clientNotes || "No notes"}
                    />
                  </div>
                </>
              ) : isStaff ? (
                <>
                  <DetailItem
                    icon={<Building2 className="h-4 w-4" />}
                    label="Department"
                    value={profileUser.department}
                  />
                  <DetailItem
                    icon={<Wrench className="h-4 w-4" />}
                    label="Trade"
                    value={profileUser.trade || "General"}
                  />
                  <div className="col-span-2">
                    <DetailItem
                      icon={<Hammer className="h-4 w-4" />}
                      label="Skills"
                      value={formatSkills(profileUser.skills)}
                    />
                  </div>
                </>
              ) : (
                <DetailItem
                  icon={<Building2 className="h-4 w-4" />}
                  label="Department"
                  value={profileUser.department || "Administration"}
                />
              )}
            </CardContent>
          </Card>

          {/* ACTIVE BILLING (Current Invoice) */}
          {isClient && (isViewingOwnProfile || isAdmin) && (
            <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden border-l-4 border-l-yellow-500">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Receipt className="h-5 w-5 text-yellow-600" />
                    <div>
                      <CardTitle className="text-base text-black">
                        Current Balance
                      </CardTitle>
                      <CardDescription className="text-xs text-gray-500">
                        Active project charges
                      </CardDescription>
                    </div>
                  </div>
                  {invoice && (
                    <span className="text-xl font-black text-black">
                      {formatNaira(invoice.totalAmount)}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {invoiceLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="animate-spin h-5 w-5 text-gray-300" />
                  </div>
                ) : !invoice ? (
                  <p className="text-center text-gray-500 text-sm py-2">
                    No active charges.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {invoice.items?.slice(0, 3).map((item: any, i: number) => (
                        <div
                          key={i}
                          className="flex justify-between text-xs text-gray-500"
                        >
                          <span>{item.description}</span>
                          <span>{formatNaira(item.totalPrice)}</span>
                        </div>
                      ))}
                      {invoice.items?.length > 3 && (
                        <p className="text-xs text-gray-400 italic">
                          +{invoice.items.length - 3} more items
                        </p>
                      )}
                    </div>
                    {invoice.status === "paid" ? (
                      <Badge className="w-full justify-center py-2 bg-green-100 text-green-700 border-green-200">
                        <CheckCircle2 size={14} className="mr-1" /> Payment Completed
                      </Badge>
                    ) : (
                      <Button
                        className="w-full bg-light-blue-600 hover:bg-light-blue-700 text-white"
                        onClick={() => toast.info("Payment processing coming soon")}
                      >
                        <Receipt className="mr-2 h-4 w-4" />
                        Request Payment
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* BILLING HISTORY */}
          {isClient && (isViewingOwnProfile || isAdmin) && (
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-black">
                  <History className="h-5 w-5 text-gray-500" />
                  Billing History
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Records of your previous settled invoices.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {historyLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="animate-spin h-5 w-5 text-gray-300" />
                  </div>
                ) : !billingHistory || billingHistory.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-4 italic border border-dashed border-gray-200 rounded-lg">
                    No previous payments found.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {billingHistory.map((pastInv: any) => (
                      <div
                        key={pastInv._id}
                        className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-full text-green-600">
                            <CheckCircle2 size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-black">
                              {formatNaira(pastInv.totalAmount)}
                            </p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                              Paid on{" "}
                              {new Date(pastInv.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7 px-2 text-light-blue-600 hover:text-light-blue-700"
                          onClick={() => toast.info("Invoice details coming soon")}
                        >
                          Details
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

function DetailItem({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div>
      <span className="text-gray-400 text-[11px] uppercase font-bold tracking-wider flex items-center gap-1">
        {icon}
        {label}
      </span>
      <p className="font-semibold text-black mt-0.5">{value || "N/A"}</p>
    </div>
  );
}

export default Profile;