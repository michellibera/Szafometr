'use client'

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import WeatherSection from './components/WeatherSection';
import OutfitRecommendations from './components/OutfitRecommendations';
import AddOutfitForm from './components/AddOutfitForm';
import Forecast from './components/Forecast';
import OutfitHistory from './components/OutfitHistory';

interface Weather {
  temp: number;
  description: string;
  feelsLike: number;
}

interface OutfitEntry {
  outfit: string;
  comfort: string;
  date: Date;
  temp: number;
}

const SzafometrApp = () => {
  const [weather, setWeather] = useState<Weather>({
    temp: 15,
    description: 'Deszczowo',
    feelsLike: 13
  });
  const [time, setTime] = useState(new Date());
  const [showAddOutfit, setShowAddOutfit] = useState(false);
  const [currentOutfit, setCurrentOutfit] = useState('');
  const [comfortLevel, setComfortLevel] = useState('');
  const [outfitHistory, setOutfitHistory] = useState<OutfitEntry[]>([]);
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
      { description: 'Bezchmurnie', temp: 26, feelsLike: 28 },
      { description: 'Bardzo gorąco', temp: 35, feelsLike: 38 },
      { description: 'Deszczowo', temp: 15, feelsLike: 13 },
      { description: 'Burza z deszczem', temp: 12, feelsLike: 10 },
      { description: 'Pochmurnie', temp: 18, feelsLike: 17 },
      { description: 'Częściowo pochmurnie', temp: 22, feelsLike: 24 },
      { description: 'Zimno', temp: 2, feelsLike: -1 },
      { description: 'Bardzo zimno', temp: -8, feelsLike: -12 },
      { description: 'Mgliście', temp: 8, feelsLike: 5 },
      { description: 'Wietrznie', temp: 12, feelsLike: 8 },
      { description: 'Śnieżnie', temp: -3, feelsLike: -8 },
      { description: 'Lekko pochmurnie', temp: 20, feelsLike: 22 }
    ];
    
    const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    setWeather(randomWeather);
  }, []);

  // Weather gradients - Beautiful modern gradients with better text visibility
  const getWeatherGradient = () => {
    const temp = weather.temp;
    const desc = weather.description.toLowerCase();
    
    // Sunny conditions
    if (desc.includes('słonecz') && temp > 25) return 'from-orange-300 via-yellow-300 to-sky-300'; // Hot sunny
    if (desc.includes('słonecz')) return 'from-yellow-200 via-orange-200 to-blue-300'; // Regular sunny
    if (desc.includes('bezchmur')) return 'from-yellow-200 via-orange-200 to-blue-300'; // Clear sky
    
    // Rainy conditions - made lighter for text visibility
    if (desc.includes('deszcz') && desc.includes('burz')) return 'from-gray-400 via-gray-300 to-slate-400'; // Stormy
    if (desc.includes('deszcz')) return 'from-gray-300 via-slate-300 to-gray-400'; // Rainy
    
    // Snow conditions
    if (desc.includes('śnież')) return 'from-gray-100 via-gray-200 to-gray-300'; // Snowy
    
    // Fog conditions
    if (desc.includes('mgł')) return 'from-gray-50 via-gray-100 to-gray-200'; // Foggy
    
    // Wind conditions
    if (desc.includes('wietrz')) return 'from-blue-300 via-purple-300 to-pink-300'; // Windy
    
    // Cloud conditions
    if (desc.includes('częściowo') || desc.includes('lekko')) return 'from-sky-300 via-purple-100 to-yellow-200'; // Partly cloudy
    if (desc.includes('chmur')) return 'from-gray-300 via-gray-200 to-gray-100'; // Cloudy
    
    // Temperature based - made lighter for cold temps
    if (temp > 30) return 'from-red-400 via-orange-400 to-yellow-300'; // Very hot
    if (temp < -5) return 'from-blue-300 via-slate-300 to-blue-400'; // Very cold
    if (temp < 5) return 'from-blue-300 via-slate-300 to-blue-400'; // Cold
    
    // Time-based fallbacks - made lighter for night
    const hour = new Date().getHours();
    if (hour >= 18 || hour <= 6) return 'from-slate-400 via-blue-400 to-slate-500'; // Night
    if (hour >= 6 && hour <= 8) return 'from-pink-300 via-yellow-200 to-orange-300'; // Dawn
    if (hour >= 17 && hour <= 19) return 'from-red-400 via-orange-400 to-purple-500'; // Sunset
    
    // Default beautiful gradient
    return 'from-purple-300 via-pink-300 to-purple-400';
  };

  // Refresh weather function
  const refreshWeather = async () => {
    setIsRefreshing(true);
    
    const weatherTypes = [
      { description: 'Słonecznie', temp: 28, feelsLike: 30 },
      { description: 'Bezchmurnie', temp: 26, feelsLike: 28 },
      { description: 'Bardzo gorąco', temp: 35, feelsLike: 38 },
      { description: 'Deszczowo', temp: 15, feelsLike: 13 },
      { description: 'Burza z deszczem', temp: 12, feelsLike: 10 },
      { description: 'Pochmurnie', temp: 18, feelsLike: 17 },
      { description: 'Częściowo pochmurnie', temp: 22, feelsLike: 24 },
      { description: 'Zimno', temp: 2, feelsLike: -1 },
      { description: 'Bardzo zimno', temp: -8, feelsLike: -12 },
      { description: 'Mgliście', temp: 8, feelsLike: 5 },
      { description: 'Wietrznie', temp: 12, feelsLike: 8 },
      { description: 'Śnieżnie', temp: -3, feelsLike: -8 },
      { description: 'Lekko pochmurnie', temp: 20, feelsLike: 22 }
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

  const handleSaveOutfit = () => {
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
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-gray-100 relative">
      <Header />

      {/* Main Content */}
      <div className={`min-h-screen bg-gradient-to-br ${getWeatherGradient()} flex flex-col pt-20 pb-8`}>
        <WeatherSection
          weather={weather}
          lastRefresh={lastRefresh}
          isRefreshing={isRefreshing}
          onRefreshWeather={refreshWeather}
          getWeatherGradient={getWeatherGradient}
        />

        {/* Outfit Recommendations or Add Outfit Form */}
        <div className="mx-6 mb-6 relative overflow-hidden">
          <div className={`transition-all duration-500 ease-in-out ${showAddOutfit ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
            <OutfitRecommendations
              recommendations={getOutfitRecommendation()}
              onAddOutfit={() => setShowAddOutfit(true)}
            />
          </div>

          {showAddOutfit && (
            <AddOutfitForm
              currentOutfit={currentOutfit}
              comfortLevel={comfortLevel}
              onOutfitChange={setCurrentOutfit}
              onComfortChange={setComfortLevel}
              onSave={handleSaveOutfit}
              onCancel={() => setShowAddOutfit(false)}
              isDisabled={!currentOutfit || !comfortLevel}
            />
          )}
        </div>

        <Forecast currentTemp={weather.temp} />

        <OutfitHistory outfitHistory={outfitHistory} />
      </div>
    </div>
  );
};

export default SzafometrApp;