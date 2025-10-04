'use server';

/**
 * @fileOverview Fetches real-time weather data from WeatherAPI.com.
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
  lang: z.enum(['en', 'es']).optional().default('en'),
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
  date: z.string(),
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

const API_KEY = process.env.WEATHERAPI_API_KEY;
const WEATHER_URL = 'https://api.weatherapi.com/v1/forecast.json';

const getRealWeatherFlow = ai.defineFlow(
  {
    name: 'getRealWeatherFlow',
    inputSchema: RealWeatherInputSchema,
    outputSchema: RealWeatherOutputSchema,
  },
  async ({ country, lang }) => {
    if (!API_KEY) {
      throw new Error('WeatherAPI.com API key is not set.');
    }

    // Get weather data (current and forecast)
    // We request 8 days to get today + the next 7 days for the forecast.
    const weatherResponse = await fetch(`${WEATHER_URL}?key=${API_KEY}&q=${country}&days=8&aqi=no&alerts=no&lang=${lang}`);
    if (!weatherResponse.ok) {
        const errorData = await weatherResponse.json();
        throw new Error(errorData.error.message || 'Failed to fetch weather data.');
    }
    const weatherData = (await weatherResponse.json()) as any;
    
    // Format current weather data
    const current = {
      temperature: Math.round(weatherData.current.temp_c),
      humidity: weatherData.current.humidity,
      windSpeed: Math.round(weatherData.current.wind_kph),
      conditions: weatherData.current.condition.text,
      country: weatherData.location.name,
    };

    // Format forecast data for the next 7 days
    const forecast = weatherData.forecast.forecastday.slice(1, 8).map((day: any) => ({
      date: day.date,
      high: Math.round(day.day.maxtemp_c),
      low: Math.round(day.day.mintemp_c),
      precipitation: Math.round(day.day.daily_chance_of_rain),
      conditions: day.day.condition.text,
    }));
    
    return { current, forecast };
  }
);

export async function getRealWeather(input: RealWeatherInput): Promise<RealWeatherOutput> {
  return getRealWeatherFlow(input);
}
