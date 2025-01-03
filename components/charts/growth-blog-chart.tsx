"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

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
import { getAllBlogsService } from "@/services/blogServices";
import useSWR from "swr";
// const chartData = [
//   { month: "January", desktop: 186, posts: 80 },
//   { month: "February", desktop: 305, posts: 200 },
//   { month: "March", desktop: 237, posts: 120 },
//   { month: "April", desktop: 73, posts: 190 },
//   { month: "May", desktop: 209, posts: 130 },
//   { month: "June", desktop: 214, posts: 140 },
// ];

const chartConfig = {
  posts: {
    label: "Posts per Day",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function GrowthBlogChart() {
  const { data: blogs, error } = useSWR("/api/blog", getAllBlogsService);

  if (error) return <div>Error loading data.</div>;
  if (!blogs) return <div>Loading...</div>;

  // Format data untuk chart (mengelompokkan berdasarkan hari)
  const chartData = blogs.reduce((acc, blog) => {
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
    <Card>
      <CardHeader>
        <CardTitle>New Blog Growth (filter by date created)</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 10,
              left: 12,
              right: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("id-ID", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />

            <Line
              dataKey="posts"
              type="natural"
              stroke="var(--color-posts)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-posts)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}
