"use client";

import { MainChart } from "@/components/charts/main-chart";
import { TotalBlogChart } from "@/components/charts/total-blog-chart";
import LayoutDashboard from "@/components/dashboar-layout";

export default function Dashboard() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <LayoutDashboard>
        <div className="flex justify-center items-center gap-4 flex-col">
          <MainChart />
          <TotalBlogChart />
        </div>
      </LayoutDashboard>
    </div>
  );
}
