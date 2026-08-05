"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronDown,
  ChevronRight,
  LogOut,
  Plus,
  Settings,
  User,
  Sparkles,
  Clock,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNavItems, bottomNavItems } from "@/config/navigation";

export function AppSidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = React.useState<string[]>(() => {
    const initialExpanded: string[] = [];
    mainNavItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some((child) =>
          pathname?.startsWith(child.href)
        );
        if (hasActiveChild) {
          initialExpanded.push(item.title);
        }
      }
    });
    return initialExpanded;
  });

  const getItemsThatShouldExpand = React.useCallback((currentPath: string) => {
    const shouldExpand: string[] = [];
    mainNavItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some((child) =>
          currentPath?.startsWith(child.href)
        );
        if (hasActiveChild) {
          shouldExpand.push(item.title);
        }
      }
    });
    return shouldExpand;
  }, []);

  const isInitialMount = React.useRef(true);

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const shouldExpand = getItemsThatShouldExpand(pathname || '');
    
    setExpandedItems((prev) => {
      const newExpanded = [...prev];
      let changed = false;
      
      shouldExpand.forEach((item) => {
        if (!newExpanded.includes(item)) {
          newExpanded.push(item);
          changed = true;
        }
      });
      
      return changed ? newExpanded : prev;
    });
  }, [pathname, getItemsThatShouldExpand]);

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname?.startsWith(href) || pathname === href;
  };

  // Format today's date
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <Sidebar
      className="border-r border-gray-200/50 dark:border-gray-800/50"
      style={
        {
          "--sidebar-width": "260px",
          "--sidebar-width-mobile": "280px",
        } as React.CSSProperties
      }
    >
      {/* Header with Apple Wallet style */}
      <SidebarHeader className="border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight">
              Loaz Learning
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formattedDate}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button className="relative rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              <Bell className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-medium text-white">
                3
              </span>
            </button>
          </div>
        </div>

        {/* Quick Add Button - Like Notion */}
        <div className="px-2 pb-3">
          <button className="flex w-full items-center gap-2 rounded-xl bg-linear-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:from-blue-500/20 hover:to-purple-500/20 transition-all">
            <Plus className="h-4 w-4 text-blue-500" />
            <span>Quick Add Event</span>
            <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
              ⌘K
            </span>
          </button>
        </div>
      </SidebarHeader>

      {/* Content with Navigation */}
      <SidebarContent className="py-2">
        {/* Today's Overview - Like Apple Wallet */}
        <div className="mx-3 mb-4 rounded-xl bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-3 border border-blue-100/50 dark:border-blue-800/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Today&apos;s Schedule
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                3 Events
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-6 w-6 rounded-full border-2 border-white dark:border-gray-800 bg-linear-to-br from-blue-400 to-purple-400"
                  />
                ))}
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
            <Clock className="h-3 w-3" />
            <span>Next: Math 101 at 10:00 AM</span>
          </div>
        </div>

        {/* Main Navigation - Menggunakan render prop */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.children ? (
                    <>
                      <SidebarMenuButton
                        onClick={() => toggleExpand(item.title)}
                        className={cn(
                          "hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all",
                          isActive(item.href) &&
                            "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <SidebarMenuBadge className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            {item.badge}
                          </SidebarMenuBadge>
                        )}
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 transition-transform",
                            expandedItems.includes(item.title) && "rotate-90"
                          )}
                        />
                      </SidebarMenuButton>
                      {expandedItems.includes(item.title) && (
                        <SidebarMenuSub>
                          {item.children.map((child) => {
                            const isChildActive = isActive(child.href);
                            return (
                              <SidebarMenuSubItem key={child.title}>
                                <SidebarMenuSubButton
                                  className={cn(
                                    "hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all",
                                    isChildActive &&
                                      "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                  )}
                                  render={
                                    <Link href={child.href} className="flex items-center gap-2 w-full">
                                      <child.icon className="h-3 w-3" />
                                      <span>{child.title}</span>
                                    </Link>
                                  }
                                />
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      )}
                    </>
                  ) : (
                    <SidebarMenuButton
                      className={cn(
                        "hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all",
                        isActive(item.href) &&
                          "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      )}
                      render={
                        <Link href={item.href} className="flex items-center gap-2 w-full">
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <SidebarMenuBadge className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                              {item.badge}
                            </SidebarMenuBadge>
                          )}
                        </Link>
                      }
                    />
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* AI Assistant - Notion Style */}
        <div className="mx-3 my-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-800/30 p-3 hover:shadow-md transition-all">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-purple-500 to-pink-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                AI Assistant
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Ask about your schedule
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </SidebarContent>

      {/* Footer - Like Apple Wallet */}
      <SidebarFooter className="border-t border-gray-200/50 dark:border-gray-800/50">
        <SidebarMenu>
          {bottomNavItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className={cn(
                  "hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all",
                  isActive(item.href) &&
                    "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                )}
                render={
                  <Link href={item.href} className="flex items-center gap-2 w-full">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                }
              />
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full">
                <div className="flex items-center gap-2 w-full rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all cursor-pointer">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/avatars/user.jpg" alt="User" />
                    <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-500 text-white text-xs">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex-1 text-sm">John Doe</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 rounded-xl border-gray-200/50 dark:border-gray-700/50"
              >
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}