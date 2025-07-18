'use client'

import React, { useState, useEffect } from 'react';
import { Plus, X, Check, RefreshCw } from 'lucide-react';

const SzafometrApp = () => {
  const [weather, setWeather] = useState({
    temp: 15,
    description: 'Deszczowo',
    feelsLike: 13
  });
  const [time, setTime] = useState(new Date());
  const [showAddOutfit, setShowAddOutfit] = useState(false);
  const [currentOutfit, setCurrentOutfit] = useState('');
  const [comfortLevel, setComfortLevel] = useState('');
  const [outfitHistory, setOutfitHistory] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Initialize weather
  useEffect(() => {
    const weatherTypes = [
      { description: 'Słonecznie', temp: 28, feelsLike: 30 },
      { description: 'Deszczowo', temp: 15, feelsLike: 13 },
      { description: 'Pochmurnie', temp: 18, feelsLike: 17 },
      { description: 'Zimno', temp: 2, feelsLike: -1 },
      { description: 'Mgliście', temp: 8, feelsLike: 5 },
      { description: 'Wietrznie', temp: 12, feelsLike: 8 },
      { description: 'Śnieżnie', temp: -3, feelsLike: -8 }
    ];
    
    const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    setWeather(randomWeather);
  }, []);

  // Weather gradients
  const getWeatherGradient = () => {
    const temp = weather.temp;
    const desc = weather.description.toLowerCase();
    
    if (desc.includes('deszcz')) return 'from-blue-200 via-cyan-300 to-blue-100';
    if (desc.includes('śnież')) return 'from-blue-50 via-gray-100 to-cyan-50';
    if (desc.includes('mgł')) return 'from-gray-100 via-gray-300 to-gray-200';
    if (desc.includes('wietrz')) return 'from-cyan-100 via-indigo-200 to-blue-200';
    if (desc.includes('słonecz') && temp > 20) return 'from-yellow-100 via-pink-200 to-orange-200';
    if (temp < 5) return 'from-blue-100 via-gray-50 to-blue-50';
    if (desc.includes('chmur')) return 'from-gray-50 via-gray-200 to-gray-100';
    return 'from-purple-100 via-pink-200 to-purple-200';
  };

  // Weather icon
  const getWeatherIcon = () => {
    const desc = weather.description.toLowerCase();
    const temp = weather.temp;
    
    if (desc.includes('deszcz')) return '🌧️';
    if (desc.includes('śnież')) return '❄️';
    if (desc.includes('mgł')) return '🌫️';
    if (desc.includes('wietrz')) return '💨';
    if (desc.includes('słonecz') && temp > 20) return '☀️';
    if (temp < 5) return '🥶';
    if (desc.includes('chmur')) return '☁️';
    return '🌤️';
  };

  // Refresh weather function
  const refreshWeather = async () => {
    setIsRefreshing(true);
    
    const weatherTypes = [
      { description: 'Słonecznie', temp: 28, feelsLike: 30 },
      { description: 'Deszczowo', temp: 15, feelsLike: 13 },
      { description: 'Pochmurnie', temp: 18, feelsLike: 17 },
      { description: 'Zimno', temp: 2, feelsLike: -1 },
      { description: 'Mgliście', temp: 8, feelsLike: 5 },
      { description: 'Wietrznie', temp: 12, feelsLike: 8 },
      { description: 'Śnieżnie', temp: -3, feelsLike: -8 }
    ];
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    
    setWeather(randomWeather);
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  // Outfit recommendations
  const getOutfitRecommendation = () => {
    const temp = weather.temp;
    
    if (temp > 25) {
      return [
        "T-shirt (albo bez koszuli)",
        "Szorty (im krótsze tym lepiej)",
        "Sandały (albo na bosaka)",
        "Okulary słoneczne"
      ];
    } else if (temp < 10) {
      return [
        "Gruba kurtka",
        "Ciepłe spodnie",
        "Buty zimowe",
        "Czapka i rękawiczki"
      ];
    } else if (weather.description.toLowerCase().includes('deszcz')) {
      return [
        "Kurtka przeciwdeszczowa",
        "Dżinsy (i tak się zmoczą)",
        "Buty wodoodporne",
        "Parasol (jeśli ci się chce)"
      ];
    } else {
      return [
        "Lekka kurtka lub bluza",
        "Dżinsy lub chinosy",
        "Trampki",
        "Cokolwiek sensownego"
      ];
    }
  };

  const formatTime = () => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-gray-100 relative">
      {/* App Header */}
      <div className="absolute top-6 left-6 z-50">
        <h1 className="text-2xl font-bold text-black">Szafometr</h1>
      </div>

      {/* Main Content */}
      <div className={`min-h-screen bg-gradient-to-br ${getWeatherGradient()} flex flex-col pt-20 pb-8`}>
        {/* Weather Section */}
        <div className="flex-none flex flex-col items-center justify-center px-6 py-4">
          <div className="w-full mb-2">
            {/* Weather Display */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{getWeatherIcon()}</div>
                <div className="flex flex-col">
                  <div className="text-4xl font-bold text-black">{weather.temp}°</div>
                  <div className="text-sm text-gray-700">Odczuwalna {weather.feelsLike}°</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs text-gray-600">
                  {lastRefresh.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <button
                  onClick={refreshWeather}
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

        {/* Outfit Recommendations */}
        <div className="mx-6 p-5 mb-6">
          <h3 className="text-2xl font-bold text-black mb-4">Co założyć?</h3>
          <div className="space-y-3 mb-8">
            {getOutfitRecommendation().map((item, i) => (
              <div key={i} className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                <span className="text-sm text-black font-medium">• {item}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowAddOutfit(true)}
            className="w-full bg-black text-white rounded-full py-3 px-5 font-bold text-base hover:bg-black/80 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Zapisz dzisiejszy strój
          </button>
        </div>

        {/* Forecast */}
        <div className="mx-6 p-4 mb-6">
          <h3 className="text-lg font-bold text-black mb-3">Prognoza na dziś</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-gray-700 mb-1">Rano</div>
              <div className="text-lg font-bold text-black">{weather.temp - 3}°</div>
            </div>
            <div>
              <div className="text-xs text-gray-700 mb-1">Popołudnie</div>
              <div className="text-lg font-bold text-black">{weather.temp + 2}°</div>
            </div>
            <div>
              <div className="text-xs text-gray-700 mb-1">Wieczorem</div>
              <div className="text-lg font-bold text-black">{weather.temp - 1}°</div>
            </div>
          </div>
        </div>

        {/* Today's Outfit History */}
        {outfitHistory.length > 0 && (
          <div className="mx-6 p-4 mb-6">
            <h3 className="text-lg font-bold text-black mb-3">Twoje stroje</h3>
            <div className="space-y-3">
              {outfitHistory.slice(-3).map((entry, i) => (
                <div key={i} className="border border-black/20 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-black">{entry.outfit}</span>
                    <span className="text-xs text-gray-700">{entry.temp}°</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-black">{entry.comfort}</span>
                    <span className="text-xs text-gray-700">
                      {entry.date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Outfit Modal */}
      {showAddOutfit && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full p-6 animate-[slideUp_0.3s_ease-out]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Co masz na sobie?</h3>
              <button
                onClick={() => setShowAddOutfit(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              placeholder="np. T-shirt, dżinsy, trampki..."
              value={currentOutfit}
              onChange={(e) => setCurrentOutfit(e.target.value)}
              className="w-full p-3 bg-gray-100 rounded-xl mb-4"
            />

            <p className="text-gray-600 mb-3 text-sm">Jak się czujesz?</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['Za zimno ❄️', 'W sam raz ✅', 'Za gorąco 🔥'].map((option) => (
                <button
                  key={option}
                  onClick={() => setComfortLevel(option)}
                  className={`p-2 rounded-xl text-center transition-colors text-sm ${
                    comfortLevel === option
                      ? 'bg-black text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                if (currentOutfit && comfortLevel) {
                  setOutfitHistory([...outfitHistory, {
                    outfit: currentOutfit,
                    comfort: comfortLevel,
                    date: new Date(),
                    temp: weather.temp
                  }]);
                  setCurrentOutfit('');
                  setComfortLevel('');
                  setShowAddOutfit(false);
                }
              }}
              disabled={!currentOutfit || !comfortLevel}
              className="w-full bg-black text-white rounded-full py-3 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Zapisz strój
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SzafometrApp;