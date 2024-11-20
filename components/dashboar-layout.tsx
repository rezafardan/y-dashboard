import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./ui/mode-toggle";
import BreadcrumbResponsive from "./ui/breadcrumb-responsive";

export default function LayoutDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="overflow-x-hidden transition-[margin] md:overflow-y-hidden md:pt-0 h-full">
        <header className="flex gap-2 justify-between px-4 py-2">
          <div className="flex gap-2 items-center">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 h-4 hidden md:block"
            />
            <BreadcrumbResponsive />
          </div>

          <ModeToggle />
        </header>

        <div className="mx-4">
          <Separator />
        </div>

        <main className="flex flex-col justify-start gap-2 p-4 w-full">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
