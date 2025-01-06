"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

import { useAuth } from "@/context/AuthContext";

export function ConditionalSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // Gunakan LayoutDashboard jika user login
    return (
      <SidebarProvider>
        <AppSidebar>{children}</AppSidebar>
      </SidebarProvider>
    );
  }

  // Render langsung tanpa LayoutDashboard jika user tidak login
  return <>{children}</>;
}
