'use server';

import { summarizeCurrentWeather } from '@/ai/flows/summarize-current-weather';
import { getRealWeather } from '@/ai/flows/get-real-weather';
import { countries } from '@/lib/countries';

export async function getWeatherData(country: string) {
  try {
    const normalizedCountry = countries.find(c => c.toLowerCase() === country.toLowerCase());

    if (!normalizedCountry) {
      throw new Error('Country not found.');
    }

    // Get real weather data
    const weatherResult = await getRealWeather({ country: normalizedCountry });
    
    // Get summary from AI
    const summaryResult = await summarizeCurrentWeather({
      country: normalizedCountry,
      temperature: weatherResult.current.temperature,
      humidity: weatherResult.current.humidity,
      windSpeed: weatherResult.current.windSpeed,
      conditions: weatherResult.current.conditions,
    });

    return {
      success: true,
      data: {
        current: {
          ...weatherResult.current,
          summary: summaryResult.summary,
        },
        forecast: weatherResult.forecast,
      },
    };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch weather data.';
    return { success: false, error: errorMessage };
  }
}
