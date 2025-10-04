'use client';
import type { ForecastDay } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ForecastDayCard } from './forecast-day-card';

interface ForecastListCardProps {
  data: ForecastDay[];
}

export function ForecastListCard({ data }: ForecastListCardProps) {
  return (
    <Card className="bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline">7-Day Forecast</CardTitle>
        <CardDescription>The upcoming weather for the next week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 md:gap-4">
          {data.map((day) => (
            <ForecastDayCard key={day.day} data={day} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
