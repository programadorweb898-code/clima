'use client';
import { Sun, Cloud, CloudRain, Snowflake, CloudLightning, CloudDrizzle, Tornado, Haze } from 'lucide-react';

const AnimatedSun = () => (
  <Sun className="size-full text-yellow-400" style={{ animation: 'spin 10s linear infinite' }} />
);

const AnimatedCloud = () => (
  <Cloud className="size-full text-gray-400" style={{ animation: 'bob 6s ease-in-out infinite' }} />
);

const AnimatedRain = () => (
  <div className="relative size-full">
    <Cloud className="size-full text-gray-500" style={{ animation: 'bob 7s ease-in-out infinite' }} />
    <div className="absolute top-1/2 left-1/4 w-1/2 h-1/2">
      <span className="absolute block w-0.5 h-2 bg-blue-400 rounded-full" style={{ left: '20%', animation: 'fall 1s linear infinite', animationDelay: '0s' }} />
      <span className="absolute block w-0.5 h-3 bg-blue-400 rounded-full" style={{ left: '50%', animation: 'fall 1.2s linear infinite', animationDelay: '0.3s' }} />
      <span className="absolute block w-0.5 h-2 bg-blue-400 rounded-full" style={{ left: '80%', animation: 'fall 0.9s linear infinite', animationDelay: '0.5s' }} />
    </div>
  </div>
);

const AnimatedSnow = () => (
  <div className="relative size-full">
     <Cloud className="size-full text-gray-400" style={{ animation: 'bob 8s ease-in-out infinite' }} />
     <div className="absolute top-1/2 left-1/4 w-1/2 h-1/2 text-white">
        <Snowflake className="absolute size-3" style={{ left: '10%', animation: 'fall 2s linear infinite', animationDelay: '0s' }}/>
        <Snowflake className="absolute size-4" style={{ left: '40%', animation: 'fall 2.5s linear infinite', animationDelay: '0.8s' }}/>
        <Snowflake className="absolute size-3" style={{ left: '70%', animation: 'fall 1.8s linear infinite', animationDelay: '1.2s' }}/>
        <Snowflake className="absolute size-2" style={{ left: '90%', animation: 'fall 2.2s linear infinite', animationDelay: '1.5s' }}/>
     </div>
  </div>
);

// New icons based on OpenWeatherMap conditions
const conditionMap: { [key: string]: React.ComponentType } = {
  'Thunderstorm': () => <CloudLightning className="size-full text-yellow-300" />,
  'Drizzle': () => <CloudDrizzle className="size-full text-blue-200" />,
  'Rain': AnimatedRain,
  'Snow': AnimatedSnow,
  'Mist': () => <Haze className="size-full text-gray-300" />,
  'Smoke': () => <Haze className="size-full text-gray-400" />,
  'Haze': () => <Haze className="size-full text-gray-300" />,
  'Dust': () => <Haze className="size-full text-yellow-600/50" />,
  'Fog': () => <Haze className="size-full text-gray-300" />,
  'Sand': () => <Haze className="size-full text-yellow-600/50" />,
  'Ash': () => <Haze className="size-full text-gray-500" />,
  'Squall': () => <Wind className="size-full text-gray-400" />,
  'Tornado': () => <Tornado className="size-full text-gray-600" />,
  'Clear': AnimatedSun,
  'Clouds': AnimatedCloud,
};

// Fallback for previous simple conditions
const legacyConditionMap: { [key: string]: React.ComponentType } = {
    'Sunny': AnimatedSun,
    'Cloudy': AnimatedCloud,
    'Rainy': AnimatedRain,
    'Snowy': AnimatedSnow
};

interface WeatherIconProps {
  conditions: string;
  className?: string;
}

export function WeatherIcon({ conditions, className }: WeatherIconProps) {
  const IconComponent = conditionMap[conditions] || legacyConditionMap[conditions] || AnimatedCloud;

  return <div className={className}><IconComponent /></div>;
}

// Dummy Wind component if not imported from lucide
const Wind = (props: any) => (
  <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
  </svg>
);
