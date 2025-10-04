'use client';

import { useState, useEffect, useTransition } from 'react';
import type { WeatherData } from '@/types';
import { getWeatherData } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { countries } from '@/lib/countries';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader } from 'lucide-react';
import { CurrentWeatherCard } from './current-weather-card';
import { ForecastListCard } from './forecast-list-card';
import { WorldMapCard } from './world-map-card';
import { Card, CardContent } from '../ui/card';

export function WeatherDashboard() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [country, setCountry] = useState('United States');

  const fetchWeather = (targetCountry: string) => {
    startTransition(async () => {
      const result = await getWeatherData(targetCountry);
      if (result.success && result.data) {
        setWeatherData(result.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
        if (!weatherData) setCountry(''); // Clear country if initial fetch fails
      }
    });
  };

  useEffect(() => {
    if (country) {
      fetchWeather(country);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (formData: FormData) => {
    const searchCountry = formData.get('country') as string;
    if (searchCountry) {
      setCountry(searchCountry);
      fetchWeather(searchCountry);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <header className="text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Global Weather Watch
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">Your interactive world weather dashboard.</p>
      </header>

      <form action={handleSearch} className="flex gap-2 max-w-md mx-auto">
        <Input
          type="search"
          name="country"
          placeholder="Search for a country..."
          className="bg-card/80 focus:ring-accent"
          list="country-list"
          defaultValue={country}
        />
        <datalist id="country-list">
          {countries.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <Button type="submit" variant="default" className="bg-primary hover:bg-primary/90" disabled={isPending}>
          {isPending ? <Loader className="animate-spin" /> : <Search />}
          <span className="sr-only">Search</span>
        </Button>
      </form>

      {isPending && !weatherData && (
        <div className="flex-center flex-col gap-4 text-center p-16">
          <Loader className="size-12 animate-spin text-primary" />
          <p className="font-headline text-2xl">Fetching weather data...</p>
          <p className="text-muted-foreground">Please wait a moment.</p>
        </div>
      )}

      {weatherData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          <div className="lg:col-span-2 space-y-6">
            <CurrentWeatherCard data={weatherData.current} />
            <ForecastListCard data={weatherData.forecast} />
          </div>
          <div className="lg:col-span-1">
            <WorldMapCard />
          </div>
        </div>
      )}

      {!isPending && !weatherData && (
        <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
                <p className="font-headline text-xl">Welcome!</p>
                <p className="text-muted-foreground mt-2">Search for a country to get started and see the latest weather conditions.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
