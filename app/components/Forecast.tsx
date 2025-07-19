interface ForecastProps {
  currentTemp: number;
}

export default function Forecast({ currentTemp }: ForecastProps) {
  return (
    <div className="mx-6 p-4 mb-6">
      <h3 className="text-lg font-bold text-black mb-3">Prognoza na dziś</h3>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-xs text-gray-700 mb-1">Rano</div>
          <div className="text-lg font-bold text-black">{currentTemp - 3}°</div>
        </div>
        <div>
          <div className="text-xs text-gray-700 mb-1">Popołudnie</div>
          <div className="text-lg font-bold text-black">{currentTemp + 2}°</div>
        </div>
        <div>
          <div className="text-xs text-gray-700 mb-1">Wieczorem</div>
          <div className="text-lg font-bold text-black">{currentTemp - 1}°</div>
        </div>
      </div>
    </div>
  );
}