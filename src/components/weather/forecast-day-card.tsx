'use client';
import type { ForecastDay } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { WeatherIcon } from './weather-icon';
import { Umbrella } from 'lucide-react';

interface ForecastDayCardProps {
  data: ForecastDay;
}

export function ForecastDayCard({ data }: ForecastDayCardProps) {
  return (
    <Card className="flex flex-col items-center p-3 text-center">
      <p className="font-bold font-headline">{data.day}</p>
      <WeatherIcon conditions={data.conditions} className="w-12 h-12 my-2" />
      <div className="text-sm">
        <span className="font-semibold text-primary">{data.high}°</span>
        <span className="text-muted-foreground"> / {data.low}°</span>
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
        <Umbrella className="size-3" />
        <span>{data.precipitation}%</span>
      </div>
    </Card>
  );
}
