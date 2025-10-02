// This file is no longer used for data generation but is kept for reference 
// or if you want to switch back to mock data.
import type { WeatherCondition, ForecastDay } from '@/types';

const stringToHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
};

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const CONDITIONS: WeatherCondition[] = ['Sunny', 'Cloudy', 'Rainy', 'Snowy'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const generateMockData = (country: string) => {
  const hash = stringToHash(country);

  const currentSeed = seededRandom(hash);
  const current = {
    temperature: Math.floor(seededRandom(currentSeed * 1) * 55) - 15, // -15 to 40 C
    humidity: Math.floor(seededRandom(currentSeed * 2) * 70) + 30, // 30 to 100%
    windSpeed: Math.floor(seededRandom(currentSeed * 3) * 50), // 0 to 50 km/h
    conditions: CONDITIONS[Math.floor(seededRandom(currentSeed * 4) * CONDITIONS.length)] as WeatherCondition,
  };

  const today = new Date().getDay();
  const forecast: ForecastDay[] = Array.from({ length: 7 }, (_, i) => {
    const daySeed = seededRandom(hash + i + 1);
    const low = Math.floor(seededRandom(daySeed * 1) * 45) - 15;
    const high = low + Math.floor(seededRandom(daySeed * 2) * 15);
    const precipitation = Math.floor(seededRandom(daySeed * 3) * 100);
    return {
      day: DAYS[(today + i + 1) % 7],
      low,
      high,
      precipitation,
      conditions: CONDITIONS[Math.floor(seededRandom(daySeed * 4) * CONDITIONS.length)] as WeatherCondition,
    };
  });

  return { current, forecast };
};
