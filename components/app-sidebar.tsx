"use client";

import Link from "next/link";

// COMPONENT
import {
  Home,
  FileText,
  Users,
  Command,
  BookOpen,
  Settings2,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "./nav-user";
import BreadcrumbResponsive from "./ui/breadcrumb-responsive";
import { Separator } from "./ui/separator";
import { ModeToggle } from "./ui/mode-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

// CONTEXT
import { useAuth } from "@/context/AuthContext";
import { VersionSwitcher } from "./ui/version-switcher";

const docData = { versions: ["1.0.0-beta"] };
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

// INTERFACE SIDEBAR
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  children: React.ReactNode;
}

export function AppSidebar({ children, ...props }: AppSidebarProps) {
  const { id, role, username, profileImage } = useAuth();
  const { isMobile } = useSidebar();

  // MENU FILTER BY ROLE
  const filteredNavMain = navMain
    .filter((section) => {
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
          return {
            ...section,
            items: section.items.filter(() => role === "ADMINISTRATOR"),
          };
        }
      }
      return section;
    });

  const capitalizeName = (name: string | null) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  const displayId = id ? id : "";
  const displayUserName = username ? capitalizeName(username) : "";
  const displayUserRole = role ? role.toUpperCase() : "";
  const userProfileImage = profileImage || "";

  return (
    <>
      {/* SIDEBAR */}
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
        <SidebarFooter>
          <VersionSwitcher
            versions={docData.versions}
            defaultVersion={docData.versions[0]}
            href="/docs"
          />
        </SidebarFooter>
      </Sidebar>

      {/* HEADER TOP */}
      <SidebarInset className="overflow-x-hidden transition-[margin] md:overflow-y-hidden md:pt-0 h-full">
        <header className="flex gap-2 justify-between items-center px-4 py-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex gap-2 items-center">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 h-4 hidden md:block"
            />
            <BreadcrumbResponsive />
          </div>
          <div className="flex items-center gap-2 px-4">
            <ModeToggle />
            <NavUser
              user={{
                id: displayId,
                username: displayUserName,
                role: displayUserRole,
                profileImage: userProfileImage,
              }}
            />
          </div>
        </header>

        <div className="mx-4">
          <Separator />
        </div>

        <main className="flex flex-col justify-start gap-2 p-4 w-full min-h-full">
          {children}
        </main>
      </SidebarInset>
    </>
  );
}
