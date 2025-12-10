'use client';

import { HourlyWeather } from '@/lib/weather/weatherService';
import { useTranslations } from 'next-intl';

interface ForecastProps {
  hourlyData: HourlyWeather[];
}

export default function Forecast({ hourlyData }: ForecastProps) {
  const t = useTranslations('Forecast');
  if (!hourlyData || hourlyData.length === 0) {
    return (
      <div className="mx-6 p-4 mb-6">
        <h3 className="text-lg font-bold text-black mb-3">{t('title')}</h3>
        <div className="text-center text-black">
          {t('loading')}
        </div>
      </div>
    );
  }

  // Get forecast for different times of day
  const now = new Date();
  const currentHour = now.getHours();
  
  // Find appropriate time slots
  const morningData = hourlyData.find(h => h.time.getHours() >= 8 && h.time.getHours() <= 10) || hourlyData[0];
  const afternoonData = hourlyData.find(h => h.time.getHours() >= 14 && h.time.getHours() <= 16) || hourlyData[Math.floor(hourlyData.length / 3)];
  const eveningData = hourlyData.find(h => h.time.getHours() >= 18 && h.time.getHours() <= 20) || hourlyData[Math.floor(hourlyData.length * 2 / 3)];

  return (
    <div className="mx-6 p-4 mb-6">
      <h3 className="text-lg font-bold text-black mb-3">{t('title')}</h3>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-xs text-black mb-1">{t('morning')}</div>
          <div className="text-lg font-bold text-black">{morningData.temp}°</div>
          <div className="text-xs text-black">{t('rain', { percent: morningData.precipitationProbability })}</div>
        </div>
        <div>
          <div className="text-xs text-black mb-1">{t('afternoon')}</div>
          <div className="text-lg font-bold text-black">{afternoonData.temp}°</div>
          <div className="text-xs text-black">{t('rain', { percent: afternoonData.precipitationProbability })}</div>
        </div>
        <div>
          <div className="text-xs text-black mb-1">{t('evening')}</div>
          <div className="text-lg font-bold text-black">{eveningData.temp}°</div>
          <div className="text-xs text-black">{t('rain', { percent: eveningData.precipitationProbability })}</div>
        </div>
      </div>
    </div>
  );
}