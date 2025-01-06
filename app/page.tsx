"use client";

// CHARTS COMPONENT
import { VisitorChart } from "@/components/charts/visitor-chart";
import { GrowthBlogByCategoryChart } from "@/components/charts/growth-blog-by-category-chart";
import { TotalBlogChart } from "@/components/charts/total-blog-chart";
import { GrowthBlogChart } from "@/components/charts/growth-blog-chart";

export default function Dashboard() {
  return (
    <div>
      <VisitorChart />
      <GrowthBlogByCategoryChart />
      <TotalBlogChart />
      <GrowthBlogChart />
    </div>
  );
}
