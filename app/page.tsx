"use client";

// CHARTS COMPONENT
import { VisitorChart } from "@/components/charts/visitor-chart";
import { GrowthBlogByCategoryChart } from "@/components/charts/growth-blog-by-category-chart";
import { TotalBlogChart } from "@/components/charts/total-blog-chart";
import { GrowthBlogChart } from "@/components/charts/growth-blog-chart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Card>
          <CardHeader className="flex items-center justify-center font-bold text-center">
            This is a demo page with fake data, explore and try several features
            wisely, because the production uses free services, some features
            cannot be used, for example uploading images
          </CardHeader>
        </Card>
      </div>
      <VisitorChart />
      <GrowthBlogByCategoryChart />
      <TotalBlogChart />
      <GrowthBlogChart />
    </div>
  );
}
