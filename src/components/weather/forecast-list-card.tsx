'use client';
import { useContext } from 'react';
import type { ForecastDay } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ForecastDayCard } from './forecast-day-card';
import { LanguageContext } from '@/context/language-context';

interface ForecastListCardProps {
  data: ForecastDay[];
}

export function ForecastListCard({ data }: ForecastListCardProps) {
  const { translations } = useContext(LanguageContext);
  return (
    <Card className="bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline">{translations.forecastTitle}</CardTitle>
        <CardDescription>{translations.forecastSubtitle}</CardDescription>
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
