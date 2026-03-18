"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "A bar chart";

const chartData = [
  { day: "Monday", workout: 0 },
  { day: "Tuesday", workout: 45 },
  { day: "Wednesday", workout: 0 },
  { day: "Thursday", workout: 0 },
  { day: "Friday", workout: 120 },
  { day: "Saterday", workout: 0 },
  { day: "Sunday", workout: 0 },
];

const chartConfig = {
  workout: {
    label: "Workout A",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type WidgetWidth =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12";

const widthMap = {
  "1": "col-span-1",
  "2": "col-span-2",
  "3": "col-span-3",
  "4": "col-span-4",
  "5": "col-span-5",
  "6": "col-span-6",
  "7": "col-span-7",
  "8": "col-span-8",
  "9": "col-span-9",
  "10": "col-span-10",
  "11": "col-span-11",
  "12": "col-span-12",
};

export function ChartBarDefault({ widgetWidth }: { widgetWidth: WidgetWidth }) {
  return (
    <Card className={widthMap[widgetWidth]}>
      <CardHeader>
        <CardTitle>Bar Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-[4/1]">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="workout" fill="var(--color-workout)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
