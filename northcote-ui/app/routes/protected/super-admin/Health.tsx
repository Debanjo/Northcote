import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, Database, Cpu, Clock, HardDrive, Activity } from "lucide-react";
import Loader from "@/components/global/Loader";

export default function SystemHealth() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["system-health"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/super-admin/health`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch health data");
      return res.json();
    },
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  if (isLoading) return <Loader label="Loading system health..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-black">System Health</h1>
        <Badge
          variant="outline"
          className="cursor-pointer hover:bg-gray-100"
          onClick={() => refetch()}
        >
          <Activity className="h-3 w-3 mr-1" />
          Refresh
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Database Status */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <Database className="h-5 w-5 text-yellow-600" />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Badge
                variant={data?.database === "connected" ? "default" : "destructive"}
                className={data?.database === "connected" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
              >
                {data?.database || "Unknown"}
              </Badge>
              <span className="text-sm text-gray-500">
                {data?.database === "connected" ? "MongoDB is operational" : "Database connection failed"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Memory Usage */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <Cpu className="h-5 w-5 text-light-blue-600" />
              Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">RSS (Resident Set Size):</span>
                <span className="font-medium text-black">{data?.memory?.rss || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Heap Total:</span>
                <span className="font-medium text-black">{data?.memory?.heapTotal || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Heap Used:</span>
                <span className="font-medium text-black">{data?.memory?.heapUsed || "N/A"}</span>
              </div>
              {/* Memory usage bar */}
              {data?.memory?.heapTotal && data?.memory?.heapUsed && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Heap Utilization</span>
                    <span>
                      {Math.round((parseInt(data.memory.heapUsed) / parseInt(data.memory.heapTotal)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-light-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(parseInt(data.memory.heapUsed) / parseInt(data.memory.heapTotal)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Uptime */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <Clock className="h-5 w-5 text-yellow-600" />
              Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-black">{data?.uptime || "N/A"}</p>
            <p className="text-sm text-gray-500 mt-1">Server running since last restart</p>
          </CardContent>
        </Card>

        {/* Node.js Info */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <Server className="h-5 w-5 text-light-blue-600" />
              Node.js Environment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Version:</span>
                <span className="font-medium text-black">{data?.nodeVersion || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Environment:</span>
                <Badge variant="outline" className="capitalize">
                  {data?.environment || "N/A"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disk Space (Mock - can be added to backend later) */}
        <Card className="bg-white border border-gray-200 shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <HardDrive className="h-5 w-5 text-yellow-600" />
              Additional Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              More system metrics can be added here (CPU load, disk usage, active connections, etc.)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}