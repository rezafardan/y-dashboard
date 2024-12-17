import LayoutDashboard from "@/components/dashboar-layout";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <LayoutDashboard>{children}</LayoutDashboard>
    </>
  );
}
