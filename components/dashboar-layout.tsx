"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./ui/mode-toggle";
import BreadcrumbResponsive from "./ui/breadcrumb-responsive";

import { useAuth } from "@/context/AuthContext";
import { NavUser } from "./nav-user";

export default function LayoutDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, username, profileImage } = useAuth();

  // Fungsi untuk kapitalisasi huruf pertama nama
  const capitalizeName = (name: string | null) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const displayUserName = username ? capitalizeName(username) : "";
  const displayUserRole = role ? role.toUpperCase() : "";
  const userProfileImage = profileImage || "";

  return (
    <SidebarProvider>
      <AppSidebar />

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
    </SidebarProvider>
  );
}
