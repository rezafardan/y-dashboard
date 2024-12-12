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
import { getAllCategoriesService } from "@/services/categoryServices";

// const chartData = [
//   { category: "SPORT", blogs: 186 },
//   { category: "POLITIC", blogs: 305 },
//   { category: "MUSIC", blogs: 237 },
//   { category: "CULTURE", blogs: 273 },
//   { category: "FOOD", blogs: 209 },
//   { category: "EDUCATION", blogs: 214 },
//   { category: "KIDS", blogs: 494 },
// ];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function GrowthBlogByCategoryChart() {
  const { data: categories, error } = useSWR(
    "/api/category",
    getAllCategoriesService
  );

  if (error) return <div>Error loading data.</div>;
  if (!categories) return <div>Loading...</div>;

  const chartData = categories.reduce((acc, blog) => {
    // Mengambil tanggal posting dalam format yyyy-mm-dd
    const date = new Date(blog.createdAt).toLocaleDateString();

    // Menyusun data untuk jumlah post per hari
    const dayData = acc.find((item) => item.date === date);
    if (dayData) {
      dayData.posts += 1;
    } else {
      acc.push({
        date,
        posts: 1,
      });
    }

    return acc;
  }, [] as { date: string; posts: number }[]);

  chartData.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <Card className="w-4/12">
      <CardHeader className="border-b py-5">
        <CardTitle>Blogs per Category (Dummy Data)</CardTitle>
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
              fillOpacity={0.6}
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
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          January - June 2024
        </div>
      </CardFooter>
    </Card>
  );
}
