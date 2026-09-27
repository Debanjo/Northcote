import { Users, Hammer, Calendar, UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

const formatTrend = (current: number, previous: number) => {
  if (previous === 0) {
    return { value: current > 0 ? "+100%" : "0%", isUp: current > 0 };
  }
  const percentage = ((current - previous) / previous) * 100;
  const isUp = percentage >= 0;
  return {
    value: `${isUp ? "+" : ""}${percentage.toFixed(1)}%`,
    isUp,
  };
};

const StatsCards = ({ data }: { data: User[] }) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const totalCurrent = data.length;
  const totalPrevious = data.filter((u) => new Date(u.createdAt) < thirtyDaysAgo).length;
  const totalTrend = formatTrend(totalCurrent, totalPrevious);

  const activeCurrent = data.filter((u) => u.status === "active").length;
  const activePrevious = data.filter(
    (u) => u.status === "active" && new Date(u.createdAt) < thirtyDaysAgo
  ).length;
  const activeTrend = formatTrend(activeCurrent, activePrevious);

  const newCurrent = data.filter((u) => new Date(u.createdAt) >= thirtyDaysAgo).length;
  const newPrevious = data.filter((u) => {
    const date = new Date(u.createdAt);
    return date >= sixtyDaysAgo && date < thirtyDaysAgo;
  }).length;
  const newTrend = formatTrend(newCurrent, newPrevious);

  const isClient = data[0]?.role === "client";
  const managersCurrent = data.filter((u) => u.role === "project_manager").length;
  const managersPrevious = data.filter(
    (u) => u.role === "project_manager" && new Date(u.createdAt) < thirtyDaysAgo
  ).length;
  const managersTrend = formatTrend(managersCurrent, managersPrevious);

  const statsData = [
    {
      label: isClient ? "Total Clients" : "Total Staff",
      value: totalCurrent.toLocaleString(),
      trend: totalTrend.value,
      trendUp: totalTrend.isUp,
      icon: Users,
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-100",
    },
    {
      label: isClient ? "Active Projects" : "Active Staff",
      value: activeCurrent.toLocaleString(),
      trend: activeTrend.value,
      trendUp: activeTrend.isUp,
      icon: Hammer,
      iconColor: "text-light-blue-600",
      iconBg: "bg-light-blue-100",
    },
    {
      label: "New This Month",
      value: newCurrent.toLocaleString(),
      trend: newTrend.value,
      trendUp: newTrend.isUp,
      icon: Calendar,
      iconColor: "text-black",
      iconBg: "bg-gray-100",
    },
    {
      label: "Project Managers",
      value: managersCurrent.toLocaleString(),
      trend: managersTrend.value,
      trendUp: managersTrend.isUp,
      icon: UserCheck,
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {statsData.map((stat, index) => (
        <Card key={index} className="border-0 shadow-sm rounded-lg bg-white">
          <CardContent className="p-3 sm:p-4 md:p-5">
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <div className={cn("p-2 sm:p-2.5 rounded-xl", stat.iconBg)}>
                <stat.icon className={cn("w-5 h-5 sm:w-6 sm:h-6", stat.iconColor)} />
              </div>
              <div
                className={cn(
                  "px-2 py-1 rounded-full text-xs font-bold",
                  stat.trendUp
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                )}
              >
                {stat.trend}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                {stat.label}
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-black tracking-tight">
                {stat.value}
              </h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;