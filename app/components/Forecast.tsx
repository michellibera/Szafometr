import { HourlyWeather } from '@/lib/weather/weatherService';

interface ForecastProps {
  hourlyData: HourlyWeather[];
}

export default function Forecast({ hourlyData }: ForecastProps) {
  if (!hourlyData || hourlyData.length === 0) {
    return (
      <div className="mx-6 p-4 mb-6">
        <h3 className="text-lg font-bold text-black mb-3">Prognoza na dziś</h3>
        <div className="text-center text-black">
          Ładowanie prognozy...
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
      <h3 className="text-lg font-bold text-black mb-3">Prognoza na dziś</h3>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-xs text-black mb-1">Rano</div>
          <div className="text-lg font-bold text-black">{morningData.temp}°</div>
          <div className="text-xs text-black">{morningData.precipitationProbability}% deszczu</div>
        </div>
        <div>
          <div className="text-xs text-black mb-1">Popołudnie</div>
          <div className="text-lg font-bold text-black">{afternoonData.temp}°</div>
          <div className="text-xs text-black">{afternoonData.precipitationProbability}% deszczu</div>
        </div>
        <div>
          <div className="text-xs text-black mb-1">Wieczorem</div>
          <div className="text-lg font-bold text-black">{eveningData.temp}°</div>
          <div className="text-xs text-black">{eveningData.precipitationProbability}% deszczu</div>
        </div>
      </div>
    </div>
  );
}