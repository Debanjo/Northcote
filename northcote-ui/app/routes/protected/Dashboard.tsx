import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { getUsers } from "@/lib/api";
import Loader from "@/components/global/Loader";
import type { Role } from "@/types";
import QuickActions from "@/components/dashboard/QuickActions";
import StatsCards from "@/components/global/StatsCards";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import ActiveProjectsBoard from "@/components/dashboard/ActiveProjectsBoard";
import ClientDashboard from "@/components/dashboard/ClientDashboard";
import { Sun, Moon, Coffee, Sunset } from "lucide-react";

export function meta() {
  return [{ title: "Dashboard | NorthCote" }];
}

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return { greeting: "Good Morning", icon: Coffee, iconColor: "text-amber-500" };
  } else if (hour >= 12 && hour < 17) {
    return { greeting: "Good Afternoon", icon: Sun, iconColor: "text-yellow-500" };
  } else if (hour >= 17 && hour < 21) {
    return { greeting: "Good Evening", icon: Sunset, iconColor: "text-orange-500" };
  } else {
    return { greeting: "Good Night", icon: Moon, iconColor: "text-indigo-500" };
  }
};

export default function Dashboard() {
  const { data: session, isPending: isAuthLoading } = authClient.useSession();
  const user = session?.user;

  const { data: userData, isLoading: isDataLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: () => getUsers({ role: "client", limit: 100 }),
    enabled: user?.role !== "client",
  });

  if (isAuthLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <Loader label="Preparing Dashboard..." />
      </div>
    );
  }

  if (user?.role === "client") {
    return <ClientDashboard />;
  }

  if (isDataLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <Loader label="Loading dashboard data..." />
      </div>
    );
  }

  const isAdmin = user?.role === "admin";
  const { greeting, icon: GreetingIcon, iconColor } = getTimeBasedGreeting();

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
            NorthCote Dashboard
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <GreetingIcon className={`h-5 w-5 ${iconColor}`} />
            <p className="text-sm sm:text-base text-gray-600">
              {greeting}, <span className="font-semibold text-black">{user?.name}</span>
            </p>
          </div>
        </div>
        <QuickActions role={user?.role as Role} />
      </div>

      <StatsCards data={userData?.res || []} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-8 space-y-6 lg:space-y-8">
          {isAdmin && (
            <section className="bg-white border border-gray-200 p-4 sm:p-6 rounded-xl shadow-sm">
              <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 text-black">
                Revenue Overview
              </h3>
              <RevenueChart />
            </section>
          )}
        </div>

        {isAdmin && (
          <div className="lg:col-span-4 space-y-6 lg:space-y-8">
            <section className="bg-white border border-gray-200 p-4 sm:p-6 rounded-xl shadow-sm">
              <h3 className="text-base sm:text-lg font-bold mb-4 text-black">
                Recent Activity
              </h3>
              <RecentActivity />
            </section>
          </div>
        )}
      </div>

      <section className="bg-white border border-gray-200 p-4 sm:p-6 rounded-xl shadow-sm overflow-hidden">
        <ActiveProjectsBoard />
      </section>
    </div>
  );
}