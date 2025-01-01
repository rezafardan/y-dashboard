"use client";

import { Home, FileText, Users, Command } from "lucide-react";

import { NavMain } from "@/components/nav-main";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const navMain = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    isActive: false,
    items: [],
  },
  {
    title: "Blogs",
    url: "#",
    icon: FileText,
    isActive: true,
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
      {
        title: "Add New Tag",
        url: "/blogs/tags/create",
      },
      {
        title: "Blog Tags Lists",
        url: "/blogs/tags",
      },
    ],
  },
  {
    title: "Users",
    url: "#",
    icon: Users,
    isActive: true,
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
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { role } = useAuth();
  const { isMobile } = useSidebar();

  // Filter menu berdasarkan role
  const filteredNavMain = navMain
    .filter((section) => {
      // Hapus section "Users" jika role bukan ADMINISTRATOR
      if (section.title === "Users" && role !== "ADMINISTRATOR") {
        return false;
      }
      return true;
    })
    .map((section) => {
      if (section.items) {
        if (section.title === "Blogs") {
          return {
            ...section,
            items: section.items.filter((item) => {
              if (role === "ADMINISTRATOR") return true;
              if (
                role === "AUTHOR" &&
                !["/blogs/categories/create", "/blogs/tags/create"].includes(
                  item.url
                )
              )
                return true;
              if (
                role === "EDITOR" &&
                !["/users/create", "/users"].includes(item.url)
              )
                return true;
              return false;
            }),
          };
        }

        if (section.title === "Users") {
          // Memastikan hanya ADMINISTRATOR yang dapat melihat seluruh section ini
          return {
            ...section,
            items: section.items.filter(() => role === "ADMINISTRATOR"),
          };
        }
      }
      return section; // Menampilkan section tanpa perubahan jika tidak ada items
    });

  return (
    <Sidebar variant="sidebar" side={isMobile ? "right" : "left"} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Prototype Dashboard
                  </span>
                  <span className="truncate text-xs">{role}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
      </SidebarContent>
    </Sidebar>
  );
}
