"use client";

import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useSWR from "swr";
import { getCategoriesWithBlogCount } from "@/services/categoryServices";

import GlobalSkeleton from "../global-skeleton";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function GrowthBlogByCategoryChart() {
  // Fetch data from API
  const { data, error, isLoading } = useSWR(
    "/api/category",
    getCategoriesWithBlogCount
  );

  if (error) return <div>Error loading data.</div>;
  if (isLoading) return <GlobalSkeleton />;
  if (!data) return <GlobalSkeleton />;

  const chartData =
    data && data.data
      ? data.data
          .filter((category: any) => category._count.Blogs > 0)
          .map((category: any) => ({
            category: category.name,
            blogs: category._count.Blogs,
          }))
      : [];

  const totalBlogs = chartData.reduce(
    (sum: any, item: any) => sum + item.blogs,
    0
  );
  const highestCategory =
    chartData.length > 0
      ? chartData.reduce((prev: any, curr: any) =>
          prev.blogs > curr.blogs ? prev : curr
        ).category
      : "No Data"; // Nilai default jika array kosong

  const highestBlogCount = chartData[0]?.blogs || 0;

  // Placeholder: Anda bisa menghitung tren berdasarkan data historis
  const trending =
    highestBlogCount > 0
      ? Math.round((highestBlogCount / totalBlogs) * 100 * 10) / 10
      : 0;

  // const chartData = categories.reduce((acc, blog) => {
  //   // Mengambil tanggal posting dalam format yyyy-mm-dd
  //   const date = new Date(blog.createdAt).toLocaleDateString();

  //   // Menyusun data untuk jumlah post per hari
  //   const dayData = acc.find((item) => item.date === date);
  //   if (dayData) {
  //     dayData.posts += 1;
  //   } else {
  //     acc.push({
  //       date,
  //       posts: 1,
  //     });
  //   }

  //   return acc;
  // }, [] as { date: string; posts: number }[]);

  // chartData.sort(
  //   (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  // );

  return (
    <Card className="w-full xl:w-2/6 2xl:w-1/4">
      <CardHeader className="border-b py-5 flex items-center">
        <CardTitle className="text-center">Total Blogs per Category</CardTitle>
        <CardDescription>Showing total blog by category</CardDescription>
      </CardHeader>
      <CardContent className="pb-0 my-10">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-video max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="category" />
            <PolarGrid />
            <Radar
              dataKey="blogs"
              fill="var(--color-desktop)"
              fillOpacity={0.5}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {`Highest Category: ${highestCategory}`}{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          {`Total Blogs: ${totalBlogs} | Trending: ${trending}%`}
        </div>
      </CardFooter>
    </Card>
  );
}
