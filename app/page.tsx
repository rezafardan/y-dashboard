"use client";

import { GrowthBlogByCategoryChart } from "@/components/charts/growth-blog-by-category-chart";
import { GrowthBlogChart } from "@/components/charts/growth-blog-chart";
import { VisitorChart } from "@/components/charts/visitor-chart";
import { TotalBlogChart } from "@/components/charts/total-blog-chart";
import LayoutDashboard from "@/components/dashboar-layout";

export default function Dashboard() {
  return (
    <div>
      <LayoutDashboard>
        <VisitorChart />
        <GrowthBlogByCategoryChart />
        <TotalBlogChart />
        <GrowthBlogChart />
      </LayoutDashboard>
    </div>
  );
}
