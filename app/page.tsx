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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
      <Header 
        isLoggedIn={isLoggedIn}
        onToggleLogin={() => setIsLoggedIn(!isLoggedIn)}
      />

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