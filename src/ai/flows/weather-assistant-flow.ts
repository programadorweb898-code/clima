'use server';
/**
 * @fileOverview A weather assistant AI flow that can answer questions about the weather.
 *
 * - weatherAssistant - A function that handles weather-related questions.
 * - WeatherAssistantInput - The input type for the weatherAssistant function.
 * - WeatherAssistantOutput - The return type for the weatherAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getRealWeather } from './get-real-weather';
import { RealWeatherInputSchema, RealWeatherOutputSchema, type RealWeatherOutput } from '@/types/weather-api-types';
import { countries } from '@/lib/countries';

const WeatherAssistantInputSchema = z.object({
  query: z.string().describe('The user\'s question about the weather.'),
  lang: z.enum(['en', 'es']).optional().default('en'),
  history: z.array(z.any()).optional().describe('The chat history.'),
  currentCountry: z.string().optional().describe('The country the user is currently viewing.'),
});
export type WeatherAssistantInput = z.infer<typeof WeatherAssistantInputSchema>;

const WeatherAssistantOutputSchema = z.object({
  answer: z.string().describe('The AI\'s answer to the user\'s question.'),
  targetCountry: z.string().optional().describe('If the user asks about a specific country, this is that country.'),
});
export type WeatherAssistantOutput = z.infer<typeof WeatherAssistantOutputSchema>;

// Tool to get weather information for a specific country
const getWeatherTool = ai.defineTool(
  {
    name: 'getWeather',
    description: 'Get the current weather and 7-day forecast for a specific country.',
    inputSchema: RealWeatherInputSchema,
    outputSchema: RealWeatherOutputSchema,
  },
  async (input) => {
    return getRealWeather(input);
  }
);

// Tool for clothing recommendations
const getClothingRecommendationTool = ai.defineTool(
  {
    name: 'getClothingRecommendation',
    description: 'Get clothing recommendations based on the current weather.',
    inputSchema: z.object({
      temperature: z.number(),
      conditions: z.string(),
      lang: z.enum(['en', 'es']).optional().default('en'),
    }),
    outputSchema: z.string(),
  },
  async ({ temperature, conditions, lang }) => {
    const languageText = lang === 'es' ? 'Spanish (español)' : 'English';
    const recommendationPrompt = `Based on a temperature of ${temperature}°C and weather conditions described as "${conditions}", provide a brief, friendly clothing recommendation. The user is asking what to wear right now. You MUST respond in ${languageText}. Your entire response must be in ${languageText}.`;
    
    const llmResponse = await ai.generate(recommendationPrompt);
    
    return llmResponse.text;
  }
);

const weatherAssistantFlow = ai.defineFlow(
  {
    name: 'weatherAssistantFlow',
    inputSchema: WeatherAssistantInputSchema,
    outputSchema: WeatherAssistantOutputSchema,
  },
  async ({ query, lang, history, currentCountry }) => {
    const translatedCountries = Array.isArray(countries) ? countries.map(c => ({ value: c.value, label: c.label[lang] })) : [];

    const languageInstruction = lang === 'es' 
      ? 'IMPORTANTE: Debes responder SIEMPRE en español. Todas tus respuestas deben estar completamente en español.'
      : 'IMPORTANT: You must ALWAYS respond in English. All your responses must be completely in English.';

    const fullPrompt = `You are a friendly and helpful weather assistant.

${languageInstruction}

Current language: ${lang}
${currentCountry ? `The user is currently viewing the weather for: ${currentCountry}.` : ''}

Available tools: getWeather, getClothingRecommendation.

Analyze the user's question.
- If they ask for the weather in a specific place, use the getWeather tool. Even if they mention a city, find the country and use that. For example, if they say "Paris", you should look for "France".
- If they ask for clothing advice, use the getClothingRecommendation tool with the current weather data. If you don't have it, get it first with the getWeather tool for the current country.
- If they ask a general question comparing weather (e.g., "is it warmer than yesterday?"), you'll need to call the getWeather tool to get the data you need to answer. You have access to the 7-day forecast.
- After using a tool, formulate a natural language response to the user based on the tool's output IN THE LANGUAGE SPECIFIED (${lang}).
- If the user's query mentions a country, you must set the 'targetCountry' field in the final output to the english name of that country so the app can navigate. You have a list of available countries. If the user asks about "Spain", you must return "Spain".

List of available countries (use the 'value' for API calls, which is the English name):
${JSON.stringify(translatedCountries.slice(0, 50))}... and more.

Remember: Your entire response must be in ${lang === 'es' ? 'Spanish (español)' : 'English'}.

User's question: ${query}
`;

    const llmResponse = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: fullPrompt,
      tools: [getWeatherTool, getClothingRecommendationTool],
      output: {
        format: 'json',
        schema: WeatherAssistantOutputSchema,
      },
    });

    const output = llmResponse.output;
    if (!output) {
      return { answer: lang === 'es' ? 'Lo siento, no pude procesar tu solicitud.' : 'Sorry, I could not process your request.' };
    }
    
    // Ensure we return the english name of the country for navigation
    if (output.targetCountry) {
        const countryInfo = translatedCountries.find(c => c.label.toLowerCase() === output.targetCountry!.toLowerCase() || c.value.toLowerCase() === output.targetCountry!.toLowerCase());
        if (countryInfo) {
            output.targetCountry = countryInfo.value;
        } else {
           // If we can't find it, unset it to avoid navigation errors
           output.targetCountry = undefined;
        }
    }
    
    return output;
  }
);

export async function weatherAssistant(input: WeatherAssistantInput): Promise<WeatherAssistantOutput> {
    return weatherAssistantFlow(input);
}
