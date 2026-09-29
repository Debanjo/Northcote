import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, DollarSign, Activity, Server, Shield } from "lucide-react"; 
import { API_URL } from "@/lib/api";
import Loader from "@/components/global/Loader";

const fetchAnalytics = async () => {
  const res = await fetch(`${API_URL}/super-admin/analytics`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
};

export default function SuperAdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["super-admin-analytics"],
    queryFn: fetchAnalytics,
  });

  if (isLoading) return <Loader label="Loading system analytics..." />;

  const formatNaira = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount / 100);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-black flex items-center gap-2">
          <Shield className="h-8 w-8 text-yellow-500" />
          Super Admin Dashboard
        </h1>
        <p className="text-gray-500">Global system overview and controls.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <p className="text-3xl font-black text-black">{data?.users?.total || 0}</p>
            </div>
            <p className="text-sm text-gray-500 mt-2">Total Users</p>
            <p className="text-xs text-green-600">{data?.users?.active || 0} active</p>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-light-blue-100 rounded-xl">
                <Building2 className="h-6 w-6 text-light-blue-600" />
              </div>
              <p className="text-3xl font-black text-black">{data?.projects?.total || 0}</p>
            </div>
            <p className="text-sm text-gray-500 mt-2">Total Projects</p>
            <p className="text-xs text-green-600">{data?.projects?.active || 0} active</p>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-black text-black">{formatNaira(data?.revenue || 0)}</p>
            </div>
            <p className="text-sm text-gray-500 mt-2">Total Revenue</p>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-3xl font-black text-black">{data?.recentActivity?.length || 0}</p>
            </div>
            <p className="text-sm text-gray-500 mt-2">Recent Actions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Recent System Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.recentActivity?.map((log: any) => (
              <div key={log._id} className="py-2 border-b last:border-0">
                <p className="text-sm font-medium">{log.action}</p>
                <p className="text-xs text-gray-500">{log.details}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <Server className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SystemHealthWidget />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SystemHealthWidget() {
  const { data } = useQuery({
    queryKey: ["system-health"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/super-admin/health`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load system health");
      return res.json();
    },
    refetchInterval: 30000,
  });

  if (!data) return <Loader />;

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span>Database:</span>
        <Badge
          variant={data.database === "connected" ? "default" : "destructive"}
          className={data.database === "connected" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
        >
          {data.database}
        </Badge>
      </div>
      <div className="flex justify-between">
        <span>Memory (RSS):</span>
        <span>{data.memory?.rss ?? "—"}</span>
      </div>
      <div className="flex justify-between">
        <span>Uptime:</span>
        <span>{data.uptime}</span>
      </div>
      <div className="flex justify-between">
        <span>Node.js:</span>
        <span>{data.nodeVersion}</span>
      </div>
    </div>
  );
}