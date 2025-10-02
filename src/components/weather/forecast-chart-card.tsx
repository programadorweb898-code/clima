'use client';
import type { ForecastDay } from '@/types';
import { Bar, BarChart, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

interface ForecastChartCardProps {
  data: ForecastDay[];
}

const chartConfig = {
  temperature: {
    label: 'Temp.',
  },
  high: {
    label: 'High',
    color: 'hsl(var(--chart-2))',
  },
  low: {
    label: 'Low',
    color: 'hsl(var(--chart-1))',
  },
  precipitation: {
    label: 'Precipitation',
    color: 'hsl(var(--muted-foreground))',
  },
} satisfies ChartConfig;

export function ForecastChartCard({ data }: ForecastChartCardProps) {
  return (
    <Card className="bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline">7-Day Forecast</CardTitle>
        <CardDescription>Highs, lows, and precipitation chance</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <ComposedChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--foreground))" unit="°" />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" unit="%" />
            <Tooltip
              content={<ChartTooltipContent indicator="dot" />}
              cursor={{ fill: 'hsl(var(--accent) / 0.1)' }}
            />
            <Line type="monotone" dataKey="high" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} yAxisId="left" name="High" />
            <Line type="monotone" dataKey="low" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} yAxisId="left" name="Low" />
            <Bar dataKey="precipitation" fill="hsl(var(--muted))" radius={4} barSize={20} yAxisId="right" name="Precipitation" />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
