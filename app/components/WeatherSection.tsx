import { RefreshCw } from 'lucide-react';

interface Weather {
  temp: number;
  description: string;
  feelsLike: number;
}

interface WeatherSectionProps {
  weather: Weather;
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
  return (
    <div className="flex-none flex flex-col items-center justify-center px-6 py-4">
      <div className="w-full mb-2">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <div className="text-8xl font-bold text-black">{weather.temp}°</div>
            <div className="flex flex-col">
              <div className="text-lg font-medium text-black">{weather.description}</div>
              <div className="text-sm text-gray-700">Odczuwalna {weather.feelsLike}°</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-600">
              {lastRefresh.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
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