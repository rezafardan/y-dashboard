"use client";

import { GrowthBlogByCategoryChart } from "@/components/charts/growth-blog-by-category-chart";
import { GrowthBlogChart } from "@/components/charts/growth-blog-chart";
import { VisitorChart } from "@/components/charts/visitor-chart";
import { TotalBlogChart } from "@/components/charts/total-blog-chart";
import LayoutDashboard from "@/components/dashboar-layout";

export default function Dashboard() {
  return (
    <div className="flex w-full items-center justify-center">
      <LayoutDashboard>
        <div className="flex gap-4 mb-2 ">
          <VisitorChart />
          <GrowthBlogByCategoryChart />
        </div>
        <div className="flex gap-4">
          <TotalBlogChart />
          <GrowthBlogChart />
        </div>
      </LayoutDashboard>
    </div>
  );
}
