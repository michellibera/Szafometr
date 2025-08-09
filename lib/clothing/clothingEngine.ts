import { WeatherData } from '@/lib/weather/weatherService';
import { findOutfitByCLO, getCLOSeasonInfo, CLOOutfit } from './cloClothingData';

export interface ClothingRecommendation {
  items: string[];
  clo: number;
  baseClo?: number;
  personalizedClo?: number;
  season: string;
  advice: string;
  reasoning: string[];
  confidence: number; // 0-100%
}

export interface FormattedClothingRecommendation {
  items: string[];
  clo: number;
  baseClo?: number;
  personalizedClo?: number;
  season: string;
  advice: string;
  reasoning: string[];
  confidence: number;
}

export class ClothingDecisionEngine {
  
  /**
   * Main method to get clothing recommendation based on weather data using CLO system
   */
  static getRecommendation(weather: WeatherData): ClothingRecommendation {
    // Calculate CLO value based on weather conditions
    const clo = this.calculateClo(weather);
    
    // Find best matching outfit from CLO database
    const outfit = findOutfitByCLO(clo);
    
    // Get season information
    const seasonInfo = getCLOSeasonInfo(clo);
    
    // Build recommendation
    const recommendation: ClothingRecommendation = {
      items: [...outfit.items],
      clo: Math.round(clo * 100) / 100, // Round to 2 decimal places
      season: seasonInfo.season,
      advice: `${seasonInfo.description} (CLO: ${Math.round(clo * 100) / 100})`,
      reasoning: [
        `Temperatura: ${weather.current.temp}°C (odczuwalna: ${weather.current.feelsLike}°C)`,
        `Wartość CLO: ${Math.round(clo * 100) / 100}`,
        `Sezon: ${seasonInfo.season}`
      ],
      confidence: 90 // High confidence for CLO-based system
    };
    
    return recommendation;
  }

  static calculateClo(weather: WeatherData): number {
    const baseClo = this.calculateBaseClo(weather.current.feelsLike);
    const deltaCloWind = this.calculateDeltaCloWind(weather.current.windSpeed);
    const deltaCloHumidity = this.calculateDeltaCloHumidity(weather.current.humidity, weather.current.temp);
    const deltaCloSun = this.calculateDeltaCloSun(weather.current.cloudCover, weather.current.isDay);
    
    let clo = baseClo + deltaCloWind + deltaCloHumidity + deltaCloSun;
    
    // Ensure CLO stays within reasonable bounds
    return Math.max(0.3, Math.min(3.0, clo));
  }

  private static calculateBaseClo(temperature: number): number {
    return 1 + ((20 - temperature) / 10);
  }

  private static calculateDeltaCloWind(windSpeed: number): number {
    const coefficient = 0.1;
    const windSpeedInMetersPerSecond = windSpeed / 3.6; // Convert km/h to m/s
    if (windSpeedInMetersPerSecond <= 1) return 0;
    return coefficient * ((windSpeedInMetersPerSecond - 1)/2);
  }

  private static calculateDeltaCloHumidity(humidity: number, temperature: number): number {
    const coefficient = 0.1;
    const temperatureBasedFunction = (temperature: number) => {
      if (temperature < 10) return 1;
      if (temperature > 20) return -1;
      return 0;
    };

    return coefficient * ((humidity - 50) / 50) * temperatureBasedFunction(temperature);
  }

  private static calculateDeltaCloSun(cloudCover: number, isDay: boolean): number {
    if(!isDay) return 0;
    const coefficient = -0.4;
    const insolation = 1 - (cloudCover / 100); // Convert percentage to decimal
    const radiationIntensity = insolation * 600; // Assume radiation intensity for full sun is 600 W/m²
    return coefficient * (radiationIntensity / 800);
  }
  
  /**
   * Convert recommendation - no transformation needed for CLO system
   */
  static formatRecommendation(rec: ClothingRecommendation): FormattedClothingRecommendation {
    return {
      items: [...rec.items],
      clo: rec.clo,
      baseClo: rec.baseClo,
      personalizedClo: rec.personalizedClo,
      season: rec.season,
      advice: rec.advice,
      reasoning: rec.reasoning,
      confidence: rec.confidence
    };
  }
  
  /**
   * Get simple recommendation for existing UI - returns clothing items as array
   */
  static getSimpleRecommendation(weather: WeatherData): string[] {
    const recommendation = this.getRecommendation(weather);
    
    // Return the clothing items directly
    return recommendation.items.filter(item => item && item.trim().length > 0);
  }

  static getPersonalizedRecommendation(weather: WeatherData, personalizedCLO: number): ClothingRecommendation {
    const outfit = findOutfitByCLO(personalizedCLO);
    const seasonInfo = getCLOSeasonInfo(personalizedCLO);

    const originalCLO = this.calculateClo(weather);
    const bias = personalizedCLO - originalCLO;

    const recommendation: ClothingRecommendation = {
      items: [...outfit.items],
      clo: Math.round(personalizedCLO * 100) / 100,
      baseClo: originalCLO,
      personalizedClo: bias,
      season: seasonInfo.season,
      advice: `${seasonInfo.description} (CLO: ${Math.round(personalizedCLO * 100) / 100})`,
      reasoning: [
        `Temperatura: ${weather.current.feelsLike}°C`,
        `Wartość CLO: ${Math.round(personalizedCLO * 100) / 100}`,
        `Sezon: ${seasonInfo.season}`,
        `Dostosowanie do preferencji użytkownika (bias): ${Math.round(bias * 100) / 100}`
      ],
      confidence: bias !== 0 ? 95 : 90
    };
    return recommendation;
  }

  /**
   * Get simple personalized recommendation for existing UI - returns clothing items as array
   */
  static getSimplePersonalizedRecommendation(weather: WeatherData, personalizedCLO: number): string[] {
    const recommendation = this.getPersonalizedRecommendation(weather, personalizedCLO);
    
    // Return the clothing items directly
    return recommendation.items.filter(item => item && item.trim().length > 0);
  }
}