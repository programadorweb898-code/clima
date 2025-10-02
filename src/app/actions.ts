'use server';

import { generateMockData } from '@/lib/weather-data';
import { summarizeCurrentWeather } from '@/ai/flows/summarize-current-weather';
import { countries } from '@/lib/countries';

export async function getWeatherData(country: string) {
  try {
    const normalizedCountry = countries.find(c => c.toLowerCase() === country.toLowerCase());

    if (!normalizedCountry) {
      throw new Error('Country not found.');
    }

    const { current, forecast } = generateMockData(normalizedCountry);

    const summaryResult = await summarizeCurrentWeather({
      country: normalizedCountry,
      temperature: current.temperature,
      humidity: current.humidity,
      windSpeed: current.windSpeed,
      conditions: current.conditions,
    });

    return {
      success: true,
      data: {
        current: {
          ...current,
          summary: summaryResult.summary,
          country: normalizedCountry,
        },
        forecast,
      },
    };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch weather data.';
    return { success: false, error: errorMessage };
  }
}
