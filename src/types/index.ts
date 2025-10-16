export type WeatherCondition = string;

export interface CurrentWeather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  conditions: WeatherCondition;
  summary: string;
  country: string;
}

export interface ForecastDay {
  date: string;
  high: number;
  low: number;
  precipitation: number;
  conditions: WeatherCondition;
  // This was 'day' but weatherapi provides 'date'
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: ForecastDay[];
}
