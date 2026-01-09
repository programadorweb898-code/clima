'use server';

/**
 * @fileOverview Summarizes the current weather conditions for a given country.
 *
 * - summarizeCurrentWeather - A function that summarizes the current weather conditions.
 * - SummarizeCurrentWeatherInput - The input type for the summarizeCurrentWeather function.
 * - SummarizeCurrentWeatherOutput - The return type for the summarizeCurrentWeather function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCurrentWeatherInputSchema = z.object({
  country: z.string().describe('The country for which to summarize the weather.'),
  temperature: z.number().describe('The current temperature in Celsius.'),
  humidity: z.number().describe('The current humidity percentage.'),
  windSpeed: z.number().describe('The current wind speed in kilometers per hour.'),
  conditions: z.string().describe('A description of the current weather conditions.'),
  lang: z.enum(['en', 'es']).optional().default('en'),
});
export type SummarizeCurrentWeatherInput = z.infer<typeof SummarizeCurrentWeatherInputSchema>;

const SummarizeCurrentWeatherOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the current weather conditions.'),
});
export type SummarizeCurrentWeatherOutput = z.infer<typeof SummarizeCurrentWeatherOutputSchema>;

export async function summarizeCurrentWeather(input: SummarizeCurrentWeatherInput): Promise<SummarizeCurrentWeatherOutput> {
  return summarizeCurrentWeatherFlow(input);
}

const summarizeCurrentWeatherPrompt = ai.definePrompt({
  name: 'summarizeCurrentWeatherPrompt',
  input: {schema: SummarizeCurrentWeatherInputSchema},
  output: {schema: SummarizeCurrentWeatherOutputSchema},
  prompt: `You must respond in {{lang}} language ONLY. If {{lang}} is 'es', respond in Spanish. If {{lang}} is 'en', respond in English.

Summarize the current weather conditions for {{country}} in a single, concise sentence.

Current Conditions:
- Temperature: {{temperature}}°C
- Humidity: {{humidity}}%
- Wind Speed: {{windSpeed}} km/h
- Conditions: {{conditions}}

Remember: Your response MUST be entirely in {{lang}} language.

Summary: `,
});

const summarizeCurrentWeatherFlow = ai.defineFlow(
  {
    name: 'summarizeCurrentWeatherFlow',
    inputSchema: SummarizeCurrentWeatherInputSchema,
    outputSchema: SummarizeCurrentWeatherOutputSchema,
  },
  async input => {
    const {output} = await summarizeCurrentWeatherPrompt(input);
    return output!;
  }
);
