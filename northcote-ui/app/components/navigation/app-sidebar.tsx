"use client";
import { Link, useLocation } from "react-router";
import { Activity, ChevronRight } from "lucide-react";
import { NavUser } from "@/components/navigation/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { authClient } from "@/lib/auth-client";
import { navConfig } from "./nav-config.js";
import type { Role } from "@/types";

interface NavItem {
  title: string;
  url: string;
  icon?: React.ElementType;
  allowedRoles: Role[];
  items?: {
    title: string;
    url: string;
    allowedRoles?: Role[];
  }[];
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation();
  const { data: session } = authClient.useSession();
  const userRole = (session?.user?.role as Role) || "client";

  const filterNav = (items: NavItem[]) => {
    return items.filter((item) => item.allowedRoles.includes(userRole));
  };
  const filteredMain = filterNav(navConfig.navMain);
  const filteredAdmin = filterNav(navConfig.navAdmin);

  const isGroupActive = (items: { url: string }[] = []) => {
    return items.some((item) => item.url === pathname);
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-gray-200 bg-white" {...props}>
      <SidebarHeader className="px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="group-data-[collapsible=icon]:justify-center! group-data-[collapsible=icon]:p-2!"
            >
              <Link to="/dashboard">
                <div className="bg-yellow-500 text-black flex aspect-square size-8 items-center justify-center rounded-lg shadow-sm">
                  <Activity className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-bold text-black">Yetosol</span>
                  <span className="truncate text-xs text-gray-500">
                    {userRole.replace("_", " ")} Portal
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2">
        {filteredMain.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-500 text-xs font-semibold uppercase tracking-wider px-3">
              Platform
            </SidebarGroupLabel>
            <SidebarMenu>
              {filteredMain.map((item) => {
                const isActive = isGroupActive(item.items);
                const hasSubItems = item.items && item.items.length > 0;

                if (hasSubItems) {
                  return (
                    <Collapsible
                      key={item.title}
                      asChild
                      defaultOpen={isActive}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            isActive={isActive}
                            size="lg"
                            className="group-data-[collapsible=icon]:justify-center! text-gray-700 hover:bg-gray-50 data-[active=true]:bg-yellow-50 data-[active=true]:text-yellow-800 data-[active=true]:border-l-3 data-[active=true]:border-yellow-500"
                          >
                            {item.icon && <item.icon />}
                            <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => {
                              const isChildActive = pathname === subItem.url;
                              return (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isChildActive}
                                    className="my-1 text-gray-600 hover:bg-gray-100 data-[active=true]:bg-light-blue-50 data-[active=true]:text-light-blue-800 data-[active=true]:border-l-2 data-[active=true]:border-light-blue-500"
                                  >
                                    <Link to={subItem.url}>
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                } else {
                  // Render as direct link without collapsible
                  const isDirectActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={isDirectActive}
                        size="lg"
                        className="group-data-[collapsible=icon]:justify-center! text-gray-700 hover:bg-gray-50 data-[active=true]:bg-yellow-50 data-[active=true]:text-yellow-800 data-[active=true]:border-l-3 data-[active=true]:border-yellow-500"
                      >
                        <Link to={item.url}>
                          {item.icon && <item.icon />}
                          <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
              })}
            </SidebarMenu>
          </SidebarGroup>
        )}
        {filteredAdmin.length > 0 && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="text-gray-500 text-xs font-semibold uppercase tracking-wider px-3">
              Administration
            </SidebarGroupLabel>
            <SidebarMenu>
              {filteredAdmin.map((item) => {
                const isActive = isGroupActive(item.items);
                const hasSubItems = item.items && item.items.length > 0;

                if (hasSubItems) {
                  return (
                    <Collapsible
                      key={item.title}
                      asChild
                      defaultOpen={isActive}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            isActive={isActive}
                            size="lg"
                            className="group-data-[collapsible=icon]:justify-center! text-gray-700 hover:bg-gray-50 data-[active=true]:bg-yellow-50 data-[active=true]:text-yellow-800 data-[active=true]:border-l-3 data-[active=true]:border-yellow-500"
                          >
                            {item.icon && <item.icon />}
                            <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => {
                              const isChildActive = pathname === subItem.url;
                              return (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isChildActive}
                                    className="my-1 text-gray-600 hover:bg-gray-100 data-[active=true]:bg-light-blue-50 data-[active=true]:text-light-blue-800 data-[active=true]:border-l-2 data-[active=true]:border-light-blue-500"
                                  >
                                    <Link to={subItem.url}>
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                } else {
                  // Render as direct link without collapsible
                  const isDirectActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={isDirectActive}
                        size="lg"
                        className="group-data-[collapsible=icon]:justify-center! text-gray-700 hover:bg-gray-50 data-[active=true]:bg-yellow-50 data-[active=true]:text-yellow-800 data-[active=true]:border-l-3 data-[active=true]:border-yellow-500"
                      >
                        <Link to={item.url}>
                          {item.icon && <item.icon />}
                          <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
              })}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      {session?.user && (
        <SidebarFooter className="border-t border-gray-200 p-2">
          <NavUser
            user={{
              name: session?.user?.name!,
              email: session?.user?.email!,
              avatar: session?.user?.image!,
            }}
          />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}