'use client';
import type { CurrentWeather } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherIcon } from './weather-icon';
import { Droplets, Wind } from 'lucide-react';

interface CurrentWeatherCardProps {
  data: CurrentWeather;
}

export function CurrentWeatherCard({ data }: CurrentWeatherCardProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className="bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">{data.country}</CardTitle>
        <CardDescription>{currentDate}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex items-center gap-4">
            <WeatherIcon conditions={data.conditions} className="w-24 h-24" />
            <div>
              <p className="text-6xl font-bold font-headline">{data.temperature}°</p>
              <p className="text-lg text-muted-foreground">{data.conditions}</p>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-base italic">"{data.summary}"</p>
            <div className="flex justify-around text-center">
              <div className="flex flex-col items-center">
                <Droplets className="size-6 text-primary" />
                <p className="font-bold text-lg">{data.humidity}%</p>
                <p className="text-xs text-muted-foreground">Humidity</p>
              </div>
              <div className="flex flex-col items-center">
                <Wind className="size-6 text-primary" />
                <p className="font-bold text-lg">{data.windSpeed} km/h</p>
                <p className="text-xs text-muted-foreground">Wind</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
 