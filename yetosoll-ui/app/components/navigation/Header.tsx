import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from "react-router";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle.js";
import Notifications from "./Notifications.js";

const Header = () => {
  const { pathname } = useLocation();
  const { data: session, isPending } = authClient.useSession();

  // While session is loading, show a minimal header (no user info)
  if (isPending) {
    return (
      <header className="flex h-14 sm:h-16 items-center gap-2 border-b border-gray-200 w-full px-2 sm:px-3 md:px-4 bg-white">
        <SidebarTrigger className="size-9 text-black hover:bg-gray-100 shrink-0" />
        <Separator orientation="vertical" className="hidden sm:block h-6 bg-gray-200" />
        <div className="flex-1" />
      </header>
    );
  }

  // Safely extract user data with fallbacks
  const user = session?.user;
  const userName = user?.name ?? "Guest";
  const userRole = user?.role;
  const userId = user?.id;

  return (
    <header className="flex h-14 sm:h-16 items-center gap-2 border-b border-gray-200 w-full px-2 sm:px-3 md:px-4 bg-white">
      <SidebarTrigger className="size-9 text-black hover:bg-gray-100 shrink-0" />
      <Separator orientation="vertical" className="hidden sm:block h-6 bg-gray-200" />
      <div className="flex flex-1 items-center justify-between gap-2">
        <div className="flex flex-col space-y-0.5 min-w-0">
          <h1 className="capitalize font-bold text-base sm:text-lg text-black truncate">
            {pathname.split("/").includes("profile")
              ? "Profile"
              : pathname.split("/").pop()?.replace(/-/g, " ") || "Dashboard"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 truncate">
            Welcome back, {userRole === "project_manager" ? "PM " : ""}
            {userName.split(" ")[0]}
          </p>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <ThemeToggle />
          <Separator orientation="vertical" className="hidden md:block h-6 bg-gray-200" />
          {user && <Notifications user={user} />}
          <Separator orientation="vertical" className="hidden md:block h-6 bg-gray-200" />
          {userId ? (
            <Link
              to={`/profile/${userId}`}
              className={
                buttonVariants({ variant: "ghost", size: "sm" }) +
                " flex items-center gap-1 sm:gap-2 rounded-lg px-2 py-5 text-black hover:bg-gray-100"
              }
            >
              <Avatar className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg border border-gray-200">
                <AvatarImage src={user?.image || ""} alt={userName} />
                <AvatarFallback className="rounded-lg bg-yellow-100 text-yellow-800 text-xs sm:text-sm">
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold text-black">{userName}</span>
                <span className="truncate text-xs text-gray-500 capitalize">
                  {userRole?.replace("_", " ")}
                </span>
              </div>
            </Link>
          ) : (
            <div className="h-8 w-8 rounded-lg bg-gray-200 animate-pulse" />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;