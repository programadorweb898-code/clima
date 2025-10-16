import { z } from 'genkit';

export const RealWeatherInputSchema = z.object({
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

export const RealWeatherOutputSchema = z.object({
  current: CurrentWeatherSchema,
  forecast: z.array(ForecastDaySchema),
});
export type RealWeatherOutput = z.infer<typeof RealWeatherOutputSchema>;
