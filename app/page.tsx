"use client";

// CHARTS COMPONENT
import { VisitorChart } from "@/components/charts/visitor-chart";
import { GrowthBlogByCategoryChart } from "@/components/charts/growth-blog-by-category-chart";
import { TotalBlogChart } from "@/components/charts/total-blog-chart";
import { GrowthBlogChart } from "@/components/charts/growth-blog-chart";
import { Card, CardHeader } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Card>
          <CardHeader className="flex items-center justify-center font-bold text-center text-red-500">
            <div className="mb-2 text-center">
              This is a demo page with fake data, explore and try several
              features wisely, because the production uses free services, some
              features cannot be used, for example uploading images{" "}
            </div>
            <div className="text-xs font-mono text-center">
              ( In the free production by Vercel, it is set that you cannot use
              file management services, therefore the add or delete feature
              cannot be used, wait until the developer changes to VPS)
            </div>
          </CardHeader>
        </Card>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <VisitorChart />
          <GrowthBlogByCategoryChart />
        </div>
        <div className="flex flex-col gap-4 lg:flex-row">
          <TotalBlogChart />
          <GrowthBlogChart />
        </div>
      </div>
    </div>
  );
}
