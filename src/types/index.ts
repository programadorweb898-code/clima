export type WeatherCondition = 'Sunny' | 'Cloudy' | 'Rainy' | 'Snowy';

export interface CurrentWeather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  conditions: WeatherCondition;
  summary: string;
  country: string;
}

export interface ForecastDay {
  day: string;
  high: number;
  low: number;
  precipitation: number;
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: ForecastDay[];
}
