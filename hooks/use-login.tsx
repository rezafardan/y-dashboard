"use client";

// COMPONENT
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

// CONTEXT
import { useAuth } from "@/context/AuthContext";

export function ConditionalSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <SidebarProvider>
        <AppSidebar>{children}</AppSidebar>
      </SidebarProvider>
    );
  }

  return <>{children}</>;
}
