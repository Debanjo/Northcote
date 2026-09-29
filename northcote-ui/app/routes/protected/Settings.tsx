import { Outlet, NavLink } from "react-router";
import { Card } from "@/components/ui/card";
import { Settings2, Shield, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsLayout() {
  const navItems = [
    {
      to: "/settings/general",
      label: "General",
      icon: Settings2,
      description: "Company profile, branding, and preferences",
    },
    {
      to: "/settings/roles",
      label: "Roles & Permissions",
      icon: Shield,
      description: "Manage role definitions and access levels",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-black">Settings</h1>
        <p className="text-gray-500">Manage your system configuration.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  cn(
                    "flex items-start gap-3 p-4 rounded-xl border transition-all",
                    isActive
                      ? "bg-yellow-50 border-yellow-300 shadow-sm"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  )
                }
              >
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    "bg-light-blue-100 text-light-blue-600"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-black">{item.label}</h3>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </NavLink>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <Card className="bg-white border border-gray-200 shadow-sm p-6">
            <Outlet />
          </Card>
        </div>
      </div>
    </div>
  );
}