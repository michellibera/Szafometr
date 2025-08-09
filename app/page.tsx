'use client'

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import WeatherSection from './components/WeatherSection';
import OutfitRecommendations from './components/OutfitRecommendations';
import AddOutfitForm from './components/AddOutfitForm';
import Forecast from './components/Forecast';
import OutfitHistory from './components/OutfitHistory';
import { WeatherData, CurrentWeather, fetchCurrentWeather } from '@/lib/weather/weatherService';
import { ClothingDecisionEngine, FormattedClothingRecommendation } from '@/lib/clothing/clothingEngine';
import { useAuth } from '@/context/AuthContext';
import { useOutfitRatingsLegacy } from '@/hooks/useOutfitRatings';
import { usePersonalization } from '@/hooks/usePersonalization';
import { OutfitEntry } from '@/types/outfit';

const SzafometrApp = () => {
  const { user, signInWithGoogle } = useAuth();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [time, setTime] = useState(new Date());
  const [showRateOutfit, setShowRateOutfit] = useState(false);
  const [currentOutfit, setCurrentOutfit] = useState('');
  const [comfortLevel, setComfortLevel] = useState('');
  const [outfitHistory, setOutfitHistory] = useState<OutfitEntry[]>([]);
  const { outfitHistory: firebaseRatings, loading: ratingsLoading, error: ratingsError, saveRating, clearError } = useOutfitRatingsLegacy();
  const { profile: personalizationProfile, loading: personalizationLoading, getPersonalizedCLO, updateFromRating: updatePersonalizationFromRating } = usePersonalization();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [clothingRecommendation, setClothingRecommendation] = useState<FormattedClothingRecommendation | null>(null);
  const [pendingOutfitSave, setPendingOutfitSave] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadInitialWeather = async () => {
      setIsLoadingWeather(true);
      try{
        setLocationPermission('pending');
        const weatherData = await fetchCurrentWeather();
        setLocationPermission('granted');
        setWeather(weatherData);
        setLastRefresh(new Date());
      } catch (error: any) {
        if (error.message.includes('Location access denied')){
          setLocationPermission('denied');
        }
        setWeatherError(error.message);
      } finally {
        setIsLoadingWeather(false);
      }
    };

    loadInitialWeather();
  }, []);

  // Generate clothing recommendation when weather data or personalization changes
  useEffect(() => {
    if (weather) {
      try {
        let recommendation;
        
        if (user && personalizationProfile && !personalizationLoading) {
          // User is logged in and has personalization data - use personalized recommendation
          const baseCLO = ClothingDecisionEngine.calculateClo(weather);
          const personalizedCLO = getPersonalizedCLO(baseCLO);
          recommendation = ClothingDecisionEngine.getPersonalizedRecommendation(weather, personalizedCLO);
        } else {
          // Use standard scientific recommendation
          recommendation = ClothingDecisionEngine.getRecommendation(weather);
        }
        
        const formatted = ClothingDecisionEngine.formatRecommendation(recommendation);
        setClothingRecommendation(formatted);
      } catch (error) {
        console.error('Error generating clothing recommendation:', error);
      }
    }
  }, [weather, user, personalizationProfile, personalizationLoading, getPersonalizedCLO]);

  // Handle authentication-gated outfit saving
  const handleAddOutfit = () => {
    if (user) {
      setShowRateOutfit(true);
    } else {
      setPendingOutfitSave(true);
      handleLogin();
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
      setPendingOutfitSave(false);
    }
  };

  // Auto-show outfit form after login if user was trying to save outfit
  useEffect(() => {
    if (user && pendingOutfitSave) {
      setShowRateOutfit(true);
      setPendingOutfitSave(false);
    }
  }, [user, pendingOutfitSave]);

  // Weather gradients - Beautiful modern gradients based on WMO weather codes
  const getWeatherGradient = () => {
    if (!weather?.current) return 'from-sky-300 via-purple-100 to-yellow-200';
    
    const temp = weather.current.temp;
    const weatherCode = weather.current.weatherCode;
    const isDay = weather.current.isDay;
    const hour = new Date().getHours();
    
    // Temperature overrides (extreme conditions)
    if (temp > 35) return 'from-red-400 via-orange-400 to-yellow-300'; // Extremely hot
    if (temp < -10) return 'from-blue-300 via-slate-300 to-blue-400'; // Extremely cold
    
    // Time-based overrides for night conditions
    if (!isDay || hour >= 20 || hour <= 5) {
      if (weatherCode >= 95) return 'from-slate-600 via-gray-500 to-slate-600'; // Night thunderstorm
      if (weatherCode >= 61 && weatherCode <= 82) return 'from-slate-500 via-gray-400 to-slate-500'; // Night rain
      return 'from-slate-400 via-blue-400 to-slate-500'; // Regular night
    }
    
    // WMO Weather Code mapping for daytime
    switch (weatherCode) {
      // Clear conditions (0-1)
      case 0: // Clear sky
        return temp > 25 ? 'from-orange-300 via-yellow-300 to-sky-300' : 'from-yellow-200 via-orange-200 to-blue-300';
      case 1: // Mainly clear
        return temp > 25 ? 'from-orange-300 via-yellow-300 to-sky-400' : 'from-yellow-200 via-orange-200 to-blue-400';
      
      // Cloudy conditions (2-3)
      case 2: // Partly cloudy
        return 'from-sky-300 via-purple-100 to-yellow-200';
      case 3: // Overcast
        return 'from-gray-300 via-gray-200 to-gray-100';
      
      // Fog conditions (45, 48)
      case 45: // Fog
      case 48: // Depositing rime fog
        return 'from-gray-50 via-gray-100 to-gray-200';
      
      // Drizzle conditions (51-57)
      case 51: // Light drizzle
      case 53: // Moderate drizzle
        return 'from-gray-200 via-slate-200 to-gray-300';
      case 55: // Dense drizzle
      case 56: // Light freezing drizzle
      case 57: // Dense freezing drizzle
        return 'from-gray-300 via-slate-300 to-gray-400';
      
      // Rain conditions (61-67)
      case 61: // Slight rain
        return 'from-gray-300 via-slate-300 to-blue-300';
      case 63: // Moderate rain
        return 'from-gray-400 via-slate-400 to-blue-400';
      case 65: // Heavy rain
      case 66: // Light freezing rain
      case 67: // Heavy freezing rain
        return 'from-gray-500 via-slate-500 to-blue-500';
      
      // Snow conditions (71-77, 85-86)
      case 71: // Slight snowfall
      case 85: // Slight snow showers
        return temp < 0 ? 'from-gray-100 via-blue-100 to-gray-200' : 'from-gray-100 via-gray-200 to-gray-300';
      case 73: // Moderate snowfall
      case 86: // Heavy snow showers
        return temp < 0 ? 'from-gray-200 via-blue-200 to-gray-300' : 'from-gray-200 via-gray-300 to-gray-400';
      case 75: // Heavy snowfall
      case 77: // Snow grains
        return temp < 0 ? 'from-blue-200 via-gray-200 to-blue-300' : 'from-gray-300 via-gray-400 to-gray-500';
      
      // Rain showers (80-82)
      case 80: // Slight rain showers
        return 'from-gray-300 via-blue-300 to-slate-400';
      case 81: // Moderate rain showers
        return 'from-gray-400 via-blue-400 to-slate-500';
      case 82: // Violent rain showers
        return 'from-gray-500 via-blue-500 to-slate-600';
      
      // Thunderstorm conditions (95-99)
      case 95: // Thunderstorm: slight or moderate
        return 'from-gray-500 via-slate-500 to-gray-600';
      case 96: // Thunderstorm with slight hail
        return 'from-gray-600 via-slate-600 to-purple-600';
      case 99: // Thunderstorm with heavy hail
        return 'from-gray-700 via-slate-700 to-purple-700';
      
      // Default fallback
      default:
        // Temperature-based fallbacks
        if (temp > 25) return 'from-orange-300 via-yellow-300 to-sky-300';
        if (temp < 5) return 'from-blue-300 via-slate-300 to-blue-400';
        return 'from-sky-300 via-purple-100 to-yellow-200';
    }
  };

  const refreshWeather = async () => {
    setIsRefreshing(true);
    setWeatherError(null);

    try {
      setLocationPermission('pending');
      const weatherData = await fetchCurrentWeather();
      setLocationPermission('granted');
      setWeather(weatherData);
      setLastRefresh(new Date());
    } catch (error: any) {
      setWeatherError(error.message);
      console.error('Failed to fetch weather:', error)
    } finally {
      setIsRefreshing(false);
    }
  }

  // Outfit recommendations using intelligent clothing engine with personalization
  const getOutfitRecommendation = () => {
    if (!weather?.current) {
      return [
        "Ładowanie danych pogodowych...",
        "Proszę czekać",
        "",
        ""
      ];
    }
    
    if (!clothingRecommendation) {
      return [
        "Generowanie rekomendacji...",
        "Analizowanie warunków pogodowych",
        "",
        ""
      ];
    }
    
    // Use personalized recommendation if available
    if (user && personalizationProfile && !personalizationLoading) {
      const baseCLO = ClothingDecisionEngine.calculateClo(weather);
      const personalizedCLO = getPersonalizedCLO(baseCLO);
      return ClothingDecisionEngine.getSimplePersonalizedRecommendation(weather, personalizedCLO);
    }
    
    // Fall back to standard recommendation
    return ClothingDecisionEngine.getSimpleRecommendation(weather);
  };

  const handleSaveOutfit = async () => {
    if (comfortLevel && clothingRecommendation && weather?.current) {
      const recommendedItems = getOutfitRecommendation();
      
      // Save to local state (Phase 1: Parallel implementation)
      setOutfitHistory([...outfitHistory, {
        outfit: recommendedItems.join(', '),
        comfort: comfortLevel,
        date: new Date(),
        temp: weather.current.temp,
        recommendedItems: recommendedItems,
        clo: clothingRecommendation.clo
      }]);

      // Save to Firebase and update personalization if user is authenticated
      if (user) {
        try {
          // Save rating for history
          await saveRating(
            {
              temp: weather.current.temp,
              feelsLike: weather.current.feelsLike,
              humidity: weather.current.humidity,
              windSpeed: weather.current.windSpeed,
              cloudCover: weather.current.cloudCover,
              isDay: weather.current.isDay,
              weatherCode: weather.current.weatherCode
            },
            {
              items: recommendedItems,
              clo: clothingRecommendation.clo,
              season: clothingRecommendation.season,
              confidence: clothingRecommendation.confidence
            },
            {
              comfort: comfortLevel as 'Za zimno ❄️' | 'W sam raz ✅' | 'Za gorąco 🔥',
              timestamp: new Date()
            }
          );

          // Update personalization (machine learning happens here!)
          if (personalizationProfile) {
            try {
              await updatePersonalizationFromRating(
                comfortLevel as 'Za zimno ❄️' | 'W sam raz ✅' | 'Za gorąco 🔥',
                clothingRecommendation.clo,
                weather.current
              );
            } catch (error) {
              console.error('Failed to update personalization:', error);
              // Don't block the UI - personalization is nice-to-have
            }
          }
        } catch (error) {
          console.error('Failed to save rating to Firebase:', error);
          // Continue anyway - local save still worked
        }
      }

      setCurrentOutfit('');
      setComfortLevel('');
      setShowRateOutfit(false);
    }
  };

  // Show loading screen during initial weather fetch
  if (isLoadingWeather) {
    return (
      <div className="min-h-screen w-full max-w-md mx-auto bg-gray-100 relative">
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-sky-300 via-purple-100 to-yellow-200 flex flex-col items-center justify-center pt-20 pb-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
            <div className="text-xl font-bold text-black mb-2">Ładowanie danych pogodowych...</div>
            <div className="text-sm text-black">
              {locationPermission === 'pending' && 'Proszę zezwolić na dostęp do lokalizacji'}
              {locationPermission === 'denied' && 'Używamy domyślnej lokalizacji (Warszawa)'}
              {locationPermission === 'granted' && 'Pobieranie prognozy dla Twojej lokalizacji'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-gray-100 relative">
      <Header />

      {/* Main Content */}
      <div className={`min-h-screen bg-gradient-to-br ${getWeatherGradient()} flex flex-col pt-20 pb-8`}>
        {/* Error Message */}
        {weatherError && (
          <div className="mx-6 mb-4 p-3 bg-red-100/90 backdrop-blur border border-red-300 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-700 text-sm font-medium">Błąd pobierania pogody</p>
                <p className="text-red-600 text-xs">{weatherError}</p>
                {locationPermission === 'denied' && (
                  <p className="text-red-600 text-xs mt-1">Używamy danych dla Warszawy</p>
                )}
              </div>
              <button
                onClick={() => setWeatherError(null)}
                className="text-red-500 hover:text-red-700 text-lg font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <WeatherSection
          weather={weather?.current || null}
          lastRefresh={lastRefresh}
          isRefreshing={isRefreshing}
          onRefreshWeather={refreshWeather}
          getWeatherGradient={getWeatherGradient}
        />

        {/* Outfit Recommendations or Add Outfit Form */}
        <div className="mx-6 mb-6 relative overflow-hidden">
          <div className={`transition-all duration-500 ease-in-out ${showRateOutfit ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
            <OutfitRecommendations
              recommendations={getOutfitRecommendation()}
              onAddOutfit={handleAddOutfit}
              onLogin={handleLogin}
            />
          </div>

          <div className={`absolute top-0 w-full transition-all duration-500 ease-in-out ${showRateOutfit ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
            <AddOutfitForm
              recommendedItems={getOutfitRecommendation()}
              comfortLevel={comfortLevel}
              onComfortChange={setComfortLevel}
              onSave={handleSaveOutfit}
              onCancel={() => setShowRateOutfit(false)}
              isDisabled={!comfortLevel}
              clo={clothingRecommendation?.clo ?? 1}
            />
          </div>
        </div>


        <Forecast hourlyData={weather?.hourly || []} />

        <OutfitHistory 
          outfitHistory={user ? firebaseRatings : outfitHistory} 
          loading={user ? ratingsLoading : false}
          error={user ? ratingsError : null}
          onClearError={clearError}
        />
      </div>
    </div>
  );
};

export default SzafometrApp;