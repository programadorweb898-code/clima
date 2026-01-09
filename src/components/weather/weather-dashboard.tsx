'use client';

import { useState, useEffect, useTransition, useContext, useCallback } from 'react';
import type { WeatherData } from '@/types';
import { getWeatherData } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { countries } from '@/lib/countries';
import { LanguageContext } from '@/context/language-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader } from 'lucide-react';
import { CurrentWeatherCard } from './current-weather-card';
import { ForecastListCard } from './forecast-list-card';
import { Card, CardContent } from '../ui/card';
import { LanguageSwitcher } from './language-switcher';
import { WeatherAssistant } from './weather-assistant';

export function WeatherDashboard() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [country, setCountry] = useState('United States');
  const { translations, lang } = useContext(LanguageContext);

  const fetchWeather = useCallback((targetCountry: string) => {
    startTransition(async () => {
      const result = await getWeatherData(targetCountry, lang);
      if (result.success && result.data) {
        setWeatherData(result.data);
      } else {
        toast({
          variant: 'destructive',
          title: translations.error,
          description: result.error,
        });
        if (!weatherData) setCountry(''); // Clear country if initial fetch fails
      }
    });
  }, [lang, toast, weatherData]);

  useEffect(() => {
    if (country) {
      fetchWeather(country);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, country]);

  const handleSearch = (formData: FormData) => {
    const searchCountry = formData.get('country') as string;
    if (searchCountry) {
      setCountry(searchCountry.trim());
    }
  };

  const handleAssistantCountryChange = useCallback((newCountry: string) => {
    const countryData = countries.find(c => c.value.toLowerCase() === newCountry.toLowerCase());
    if (countryData) {
        setCountry(countryData.value);
    }
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <header className="flex flex-col items-center text-center">
        <div className="w-full flex flex-col md:flex-row items-center justify-center md:justify-between relative gap-4">
          <div className="w-full md:absolute md:inset-0 flex items-center justify-center pointer-events-none">
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              {translations.title}
            </h1>
          </div>
          <div className="w-full flex md:hidden justify-center order-last">
             <LanguageSwitcher />
          </div>
          <div className="hidden md:flex flex-1 justify-end">
             <LanguageSwitcher />
          </div>
        </div>
        <p className="text-muted-foreground text-lg mt-2 text-center">{translations.subtitle}</p>
      </header>


      <form action={handleSearch} className="flex gap-2 max-w-md mx-auto">
        <Input
          type="search"
          name="country"
          placeholder={translations.searchPlaceholder}
          className="bg-card/80 focus:ring-accent"
          list="country-list"
          defaultValue={country}
          key={country} // Force re-render on country change
        />
        <datalist id="country-list">
          {countries.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label[lang]}
            </option>
          ))}
        </datalist>
        <Button type="submit" variant="default" className="bg-primary hover:bg-primary/90" disabled={isPending}>
          {isPending ? <Loader className="animate-spin" /> : <Search />}
          <span className="sr-only">{translations.search}</span>
        </Button>
      </form>

      <WeatherAssistant 
        currentCountry={country}
        onCountryChange={handleAssistantCountryChange}
      />

      {isPending && !weatherData && (
        <div className="flex-center flex-col gap-4 text-center p-16">
          <Loader className="size-12 animate-spin text-primary" />
          <p className="font-headline text-2xl">{translations.fetching}</p>
          <p className="text-muted-foreground">{translations.pleaseWait}</p>
        </div>
      )}

      {weatherData && (
        <div className="space-y-6 animate-in fade-in duration-500">
            <CurrentWeatherCard data={weatherData.current} />
            <ForecastListCard data={weatherData.forecast} />
        </div>
      )}

      {!isPending && !weatherData && country && (
        <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
                <p className="font-headline text-xl">{translations.welcome}</p>
                <p className="text-muted-foreground mt-2">{translations.welcomeMessage}</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
