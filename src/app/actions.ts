'use server';

import { summarizeCurrentWeather } from '@/ai/flows/summarize-current-weather';
import { getRealWeather } from '@/ai/flows/get-real-weather';
import { countries } from '@/lib/countries';
import { weatherAssistant, WeatherAssistantInput } from '@/ai/flows/weather-assistant-flow';
import type { Message } from '@/components/weather/weather-assistant';

export async function getWeatherData(country: string, lang: 'en' | 'es' = 'en') {
  try {
    const normalizedCountry = countries.find(c => c.value.toLowerCase() === country.toLowerCase());

    if (!normalizedCountry) {
      throw new Error('Country not found.');
    }

    // Get real weather data
    const weatherResult = await getRealWeather({ country: normalizedCountry.value, lang });
    
    // Get summary from AI
    const summaryResult = await summarizeCurrentWeather({
      country: normalizedCountry.label[lang],
      temperature: weatherResult.current.temperature,
      humidity: weatherResult.current.humidity,
      windSpeed: weatherResult.current.windSpeed,
      conditions: weatherResult.current.conditions,
      lang: lang,
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

export async function getAssistantResponse(input: WeatherAssistantInput, history: Message[]) {
    try {
        const historyForAI = history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            content: [{ text: msg.content }],
        }));

        const result = await weatherAssistant({ ...input, history: historyForAI });
        return { success: true, data: result };

    } catch(error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to get assistant response.';
        return { success: false, error: errorMessage };
    }
}
