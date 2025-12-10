'use client';

import { RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CurrentWeather } from '@/lib/weather/weatherService';

interface WeatherSectionProps {
  weather: CurrentWeather | null;
  lastRefresh: Date;
  isRefreshing: boolean;
  onRefreshWeather: () => void;
  getWeatherGradient: () => string;
}

export default function WeatherSection({
  weather,
  lastRefresh,
  isRefreshing,
  onRefreshWeather,
  getWeatherGradient
}: WeatherSectionProps) {
  const t = useTranslations('Weather');
  const tDescriptions = useTranslations('Weather.descriptions');
  const [mounted, setMounted] = useState(false);

  // Only render time on client side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get weather description from translations or fallback to stored description
  const getWeatherDescription = () => {
    try {
      return tDescriptions(weather?.weatherCode?.toString() || '0');
    } catch {
      return weather?.description || tDescriptions('unknown');
    }
  };

  if (!weather) {
    return (
      <div className="flex-none flex flex-col items-center justify-center px-6 py-4">
        <div className="w-full mb-2">
          <div className="flex justify-center items-center mb-4">
            <div className="text-2xl font-medium text-black">{t('loading')}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-none flex flex-col items-center justify-center px-6 py-4">
      <div className="w-full mb-2">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <div className='flex flex-col'>
              <div className="text-8xl font-bold text-black">{weather.temp}°</div>
              <div className="text-sm font-bold text-black ml-2">{t('feelsLike', { temp: weather.feelsLike })}</div>
            </div>
            <div className="flex flex-col">
              <div className="text-xl font-medium text-black">{getWeatherDescription()}</div>
              <div className="text-xs text-black">{t('rain', { percent: weather.precipitation })}</div>
              <div className="text-xs text-black">{t('wind', { speed: weather.windSpeed })}</div>
              <div className="text-xs text-black">{t('humidity', { percent: weather.humidity })}</div>
              <div className="text-xs text-black">{t('clouds', { percent: weather.cloudCover })}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-black">
              {mounted ? lastRefresh.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
            </div>
            <button
              onClick={onRefreshWeather}
              disabled={isRefreshing}
              className={`bg-white/30 backdrop-blur rounded-full p-2 hover:bg-white/40 transition-all duration-200 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            >
              <RefreshCw className="w-4 h-4 text-black/80" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}