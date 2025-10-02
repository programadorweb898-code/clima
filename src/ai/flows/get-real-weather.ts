'use server';

/**
 * @fileOverview Fetches real-time weather data from OpenWeatherMap API.
 * 
 * - getRealWeather - A function that fetches current weather and forecast data.
 * - RealWeatherInput - The input type for the getRealWeather function.
 * - RealWeatherOutput - The return type for the getRealWeather function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import fetch from 'node-fetch';

const RealWeatherInputSchema = z.object({
  country: z.string().describe('The country to fetch weather for.'),
});
export type RealWeatherInput = z.infer<typeof RealWeatherInputSchema>;

const CurrentWeatherSchema = z.object({
  temperature: z.number(),
  humidity: z.number(),
  windSpeed: z.number(),
  conditions: z.string(),
  country: z.string(),
});

const ForecastDaySchema = z.object({
  day: z.string(),
  high: z.number(),
  low: z.number(),
  precipitation: z.number(),
  conditions: z.string(),
});

const RealWeatherOutputSchema = z.object({
  current: CurrentWeatherSchema,
  forecast: z.array(ForecastDaySchema),
});
export type RealWeatherOutput = z.infer<typeof RealWeatherOutputSchema>;

const API_KEY = process.env.OPENWEATHER_API_KEY;
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/onecall';

const getRealWeatherFlow = ai.defineFlow(
  {
    name: 'getRealWeatherFlow',
    inputSchema: RealWeatherInputSchema,
    outputSchema: RealWeatherOutputSchema,
  },
  async ({ country }) => {
    if (!API_KEY) {
      throw new Error('OpenWeatherMap API key is not set.');
    }

    // 1. Geocode country name to lat/lon
    const geoResponse = await fetch(`${GEO_URL}?q=${country}&limit=1&appid=${API_KEY}`);
    if (!geoResponse.ok) throw new Error('Failed to geocode country.');
    const geoData = (await geoResponse.json()) as any[];
    if (!geoData || geoData.length === 0) throw new Error(`Could not find location for ${country}.`);
    const { lat, lon } = geoData[0];

    // 2. Get weather data
    const weatherResponse = await fetch(`${WEATHER_URL}?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`);
    if (!weatherResponse.ok) throw new Error('Failed to fetch weather data.');
    const weatherData = (await weatherResponse.json()) as any;

    // 3. Format data
    const current = {
      temperature: Math.round(weatherData.current.temp),
      humidity: weatherData.current.humidity,
      windSpeed: Math.round(weatherData.current.wind_speed * 3.6), // m/s to km/h
      conditions: weatherData.current.weather[0].main,
      country,
    };

    const forecast = weatherData.daily.slice(1, 8).map((day: any) => ({
      day: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
      high: Math.round(day.temp.max),
      low: Math.round(day.temp.min),
      precipitation: Math.round((day.pop || 0) * 100),
      conditions: day.weather[0].main,
    }));
    
    return { current, forecast };
  }
);

export async function getRealWeather(input: RealWeatherInput): Promise<RealWeatherOutput> {
  return getRealWeatherFlow(input);
}
