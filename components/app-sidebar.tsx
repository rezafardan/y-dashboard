"use client";

import * as React from "react";
import { Home, FileText, Users, Command, LifeBuoy, Send } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      title: "Blogs",
      url: "#",
      icon: FileText,
      items: [
        {
          title: "Add New Blog",
          url: "/blogs/create",
        },
        {
          title: "Blog Lists",
          url: "/blogs",
        },
        {
          title: "Add New Category",
          url: "/blogs/categories/create",
        },
        {
          title: "Blog Categories Lists",
          url: "/blogs/categories",
        },
      ],
    },
    {
      title: "Users",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Add New User",
          url: "/users/create",
        },
        {
          title: "User Lists",
          url: "/users",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Title</span>
                  <span className="truncate text-xs">Prototype</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
