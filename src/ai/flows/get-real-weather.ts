'use server';

/**
 * @fileOverview Fetches real-time weather data from WeatherAPI.com.
 * 
 * - getRealWeather - A function that fetches current weather and forecast data.
 */

import { ai } from '@/ai/genkit';
import fetch from 'node-fetch';
import { RealWeatherInputSchema, RealWeatherOutputSchema, type RealWeatherInput, type RealWeatherOutput } from '@/types/weather-api-types';

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
    // We request 3 days to get today + the next 2 days for the forecast.
    const weatherResponse = await fetch(`${WEATHER_URL}?key=${API_KEY}&q=${country}&days=3&aqi=no&alerts=no&lang=${lang}`);
    if (!weatherResponse.ok) {
        const errorData = await weatherResponse.json() as any;
        const errorMessage = errorData?.error?.message || `Failed to fetch weather data. Status: ${weatherResponse.status}`;
        throw new Error(errorMessage);
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

    // Format forecast data for the next 2 days
    const forecast = weatherData.forecast.forecastday.slice(1, 3).map((day: any) => ({
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
