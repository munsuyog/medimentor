"use client";

import {
  Calendar,
  ChevronUp,
  Home,
  Inbox,
  Search,
  Settings,
  User2,
  Bell,
  BarChart2,
  Users,
  HelpCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useState } from "react";

// Menu items with grouping and badges
const menuGroups = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "#",
        icon: Home,
      },
      {
        title: "Analytics",
        url: "#",
        icon: BarChart2,
        badge: "New",
      },
    ],
  },
  {
    label: "Workspace",
    items: [
      {
        title: "Inbox",
        url: "#",
        icon: Inbox,
        badge: "3",
      },
      {
        title: "Calendar",
        url: "#",
        icon: Calendar,
      },
      {
        title: "Team",
        url: "#",
        icon: Users,
      },
    ],
  },
  {
    label: "Tools",
    items: [
      {
        title: "Search",
        url: "#",
        icon: Search,
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings,
      },
      {
        title: "Help Center",
        url: "#",
        icon: HelpCircle,
      },
    ],
  },
];

export function AppSidebar() {
  const { toggleSidebar, state } = useSidebar();
  const [isDropDownOpen, setDropDownOpen] = useState(false);
  const [notifications, setNotifications] = useState(2); // Example notification count

  const handleSidebarClose = () => {
    if (state === "expanded" && !isDropDownOpen) {
      toggleSidebar();
    }
  };

  const handleSidebarOpen = () => {
    if (state === "collapsed") {
      toggleSidebar();
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      onMouseEnter={handleSidebarOpen}
      onMouseLeave={handleSidebarClose}
      className="border-r border-gray-200 bg-white shadow-sm"
    >
      <SidebarContent>
        <SidebarGroup className="p-4">
          <SidebarGroupContent>
            <div className="flex items-center space-x-2">
              <Image
                src="/horizontal-logo.jpg"
                alt="logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="font-semibold text-gray-900">SaaS Name</span>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {menuGroups.map((group, index) => (
          <SidebarGroup key={group.label} className={index !== 0 ? "mt-6" : ""}>
            <SidebarGroupLabel className="px-4 text-xs font-medium text-gray-500">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="group relative flex items-center rounded-lg px-3 py-2 hover:bg-gray-100"
                    >
                      <a href={item.url} className="flex w-full items-center">
                        <item.icon className="h-5 w-5 text-gray-500 group-hover:text-gray-900" />
                        <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                          {item.title}
                        </span>
                        {item.badge && (
                          <Badge
                            variant={item.badge === "New" ? "default" : "secondary"}
                            className="ml-auto"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 bg-gray-50">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu onOpenChange={setDropDownOpen}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="flex w-full items-center px-3 py-2 hover:bg-gray-100">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                    <User2 className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-700">John Doe</p>
                    <p className="text-xs text-gray-500">Premium Plan</p>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4 text-gray-500" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem className="flex items-center">
                  <User2 className="mr-2 h-4 w-4" />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center">
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                  {notifications > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {notifications}
                    </Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center text-red-600">
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}