'use client';
import type { WeatherCondition } from '@/types';
import { Sun, Cloud, CloudRain, Snowflake } from 'lucide-react';

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

interface WeatherIconProps {
  conditions: WeatherCondition;
  className?: string;
}

export function WeatherIcon({ conditions, className }: WeatherIconProps) {
  const renderIcon = () => {
    switch (conditions) {
      case 'Sunny':
        return <AnimatedSun />;
      case 'Cloudy':
        return <AnimatedCloud />;
      case 'Rainy':
        return <AnimatedRain />;
      case 'Snowy':
        return <AnimatedSnow />;
      default:
        return <AnimatedCloud />;
    }
  };

  return <div className={className}>{renderIcon()}</div>;
}
