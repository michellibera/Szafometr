import { WeatherData } from '@/lib/weather/weatherService';
import { CLOTHING_ITEMS, TEMP_RULES, WEATHER_MODIFIERS, ClothingItem } from './clothingData';

export interface ClothingRecommendation {
  layers: {
    base: string[];
    mid: string[];
    outer: string[];
  };
  bottom: string[];
  accessories: string[];
  footwear: string[];
  advice: string;
  reasoning: string[];
  confidence: number; // 0-100%
}

export interface FormattedClothingRecommendation {
  layers: {
    base: string[];
    mid: string[];
    outer: string[];
  };
  bottom: string[];
  accessories: string[];
  footwear: string[];
  advice: string;
  reasoning: string[];
  confidence: number;
}

export class ClothingDecisionEngine {
  
  /**
   * Main method to get clothing recommendation based on weather data
   */
  static getRecommendation(weather: WeatherData): ClothingRecommendation {
    const temp = weather.current.temp;
    const feelsLike = weather.current.feelsLike;
    
    // Use feels-like temperature for decisions, but consider both
    const effectiveTemp = Math.min(temp, feelsLike);
    
    // Find base recommendation from temperature rules
    const baseRule = TEMP_RULES.find(rule => 
      effectiveTemp >= rule.range.min && effectiveTemp < rule.range.max
    ) || TEMP_RULES[TEMP_RULES.length - 1];
    
    let recommendation: ClothingRecommendation = {
      layers: {
        base: [...baseRule.base],
        mid: [...baseRule.mid],
        outer: [...baseRule.outer]
      },
      bottom: [...baseRule.bottom],
      accessories: [...baseRule.accessories],
      footwear: [...baseRule.footwear],
      advice: baseRule.advice,
      reasoning: [`Temperatura: ${temp}°C (odczuwalna: ${feelsLike}°C)`],
      confidence: 85 // Base confidence
    };
    
    // Apply weather condition modifiers
    recommendation = this.applyWindModifier(recommendation, weather);
    recommendation = this.applyPrecipitationModifier(recommendation, weather);
    recommendation = this.applyTimeModifier(recommendation, weather);
    recommendation = this.applySunModifier(recommendation, weather);
    recommendation = this.applySeasonalModifier(recommendation, weather);
    
    // Remove duplicates and clean up
    recommendation = this.cleanupRecommendation(recommendation);
    
    return recommendation;
  }
  
  /**
   * Apply wind speed modifications
   */
  private static applyWindModifier(rec: ClothingRecommendation, weather: WeatherData): ClothingRecommendation {
    if (weather.current.windSpeed > WEATHER_MODIFIERS.WIND.threshold) {
      // Add windproof outer layer if not already present
      if (!rec.layers.outer.some(item => this.isWindproof(item)) && weather.current.temp < 20) {
        if (!rec.layers.outer.includes('windbreaker')) {
          rec.layers.outer.push('windbreaker');
        }
      }
      
      // Add scarf for neck protection
      if (!rec.accessories.includes('scarf') && weather.current.temp < 15) {
        rec.accessories.push('scarf');
      }
      
      rec.reasoning.push(`Silny wiatr (${weather.current.windSpeed} km/h) - dodano ochronę przed wiatrem`);
      rec.confidence = Math.max(rec.confidence - 5, 70);
    }
    return rec;
  }
  
  /**
   * Apply precipitation modifications
   */
  private static applyPrecipitationModifier(rec: ClothingRecommendation, weather: WeatherData): ClothingRecommendation {
    if (weather.current.precipitation > WEATHER_MODIFIERS.PRECIPITATION.threshold) {
      // Replace outer layer with waterproof option
      const hasWaterproofOuter = rec.layers.outer.some(item => this.isWaterproof(item));
      
      if (!hasWaterproofOuter) {
        // Remove non-waterproof outer layers and add waterproof
        rec.layers.outer = rec.layers.outer.filter(item => this.isWaterproof(item));
        
        if (weather.current.temp < 10) {
          rec.layers.outer.push('winter_coat');
        } else {
          rec.layers.outer.push('rain_jacket');
        }
      }
      
      // Replace footwear with waterproof option
      if (!rec.footwear.some(item => this.isWaterproof(item))) {
        if (weather.current.temp > 15) {
          rec.footwear = ['rain_boots'];
        } else {
          rec.footwear = ['winter_boots'];
        }
      }
      
      // Add umbrella
      if (!rec.accessories.includes('umbrella')) {
        rec.accessories.push('umbrella');
      }
      
      rec.reasoning.push(`Opady (${weather.current.precipitation.toFixed(1)}mm) - dodano odzież przeciwdeszczową`);
    }
    return rec;
  }
  
  /**
   * Apply time of day modifications
   */
  private static applyTimeModifier(rec: ClothingRecommendation, weather: WeatherData): ClothingRecommendation {
    const hour = new Date().getHours();
    
    // Morning (5-9) and evening (18-23) are typically cooler
    if ((hour >= 5 && hour <= 9) || (hour >= 18 && hour <= 23)) {
      if (weather.current.temp < WEATHER_MODIFIERS.MORNING_EVENING.tempThreshold && rec.layers.mid.length === 0) {
        rec.layers.mid.push('cardigan');
        rec.reasoning.push('Rano/wieczorem - dodano dodatkową warstwę');
      }
    }
    
    // Night time (23-5) - extra warmth needed
    if (hour >= 23 || hour <= 5) {
      if (weather.current.temp < 15 && !rec.layers.outer.length) {
        rec.layers.outer.push('light_jacket');
        rec.reasoning.push('Noc - dodano kurtkę');
      }
    }
    
    return rec;
  }
  
  /**
   * Apply sun/cloud cover modifications
   */
  private static applySunModifier(rec: ClothingRecommendation, weather: WeatherData): ClothingRecommendation {
    const { cloudThreshold, tempThreshold } = WEATHER_MODIFIERS.SUNNY;
    const hour = new Date().getHours();
    const isDaytime = weather.current.isDay && hour >= 6 && hour <= 20;
    
    // Only add sunglasses if it's daytime, sunny, and warm enough
    if (isDaytime && weather.current.cloudCover < cloudThreshold && weather.current.temp > tempThreshold) {
      // Sunny conditions during daytime
      if (!rec.accessories.includes('sunglasses')) {
        rec.accessories.push('sunglasses');
        rec.reasoning.push('Słonecznie w dzień - dodano okulary przeciwsłoneczne');
      }
      
      // In very sunny hot weather, might be warmer than temperature suggests
      if (weather.current.temp > 25 && weather.current.cloudCover < 10) {
        rec.reasoning.push('Pełne słońce - może być odczuwalnie cieplej');
        rec.confidence = Math.min(rec.confidence + 5, 95);
      }
    } else if (weather.current.cloudCover > 70) {
      // Very cloudy - might feel cooler
      if (weather.current.temp < 20) {
        rec.reasoning.push('Pochmurno - może być odczuwalnie chłodniej');
        rec.confidence = Math.max(rec.confidence - 5, 75);
      }
    }
    
    return rec;
  }
  
  /**
   * Apply seasonal context modifications
   */
  private static applySeasonalModifier(rec: ClothingRecommendation, weather: WeatherData): ClothingRecommendation {
    const month = new Date().getMonth() + 1; // 1-12
    
    // Early spring (March-April) - people might underestimate cold
    if ((month >= 3 && month <= 4) && weather.current.temp < 15) {
      if (rec.layers.outer.length === 0) {
        rec.layers.outer.push('transitional_jacket');
        rec.reasoning.push('Wczesna wiosna - może być zdradliwie chłodno');
      }
    }
    
    // Late autumn (October-November) - similar issue
    if ((month >= 10 && month <= 11) && weather.current.temp < 15) {
      if (rec.layers.outer.length === 0) {
        rec.layers.outer.push('transitional_jacket');
        rec.reasoning.push('Późna jesień - temperatura może spaść wieczorem');
      }
    }
    
    return rec;
  }
  
  /**
   * Clean up recommendation - remove duplicates, ensure logical layering
   */
  private static cleanupRecommendation(rec: ClothingRecommendation): ClothingRecommendation {
    // Remove duplicates
    rec.layers.base = [...new Set(rec.layers.base)];
    rec.layers.mid = [...new Set(rec.layers.mid)];
    rec.layers.outer = [...new Set(rec.layers.outer)];
    rec.bottom = [...new Set(rec.bottom)];
    rec.accessories = [...new Set(rec.accessories)];
    rec.footwear = [...new Set(rec.footwear)];
    
    // Ensure logical layering - don't have thermal underwear with tank top
    if (rec.layers.base.includes('thermal_underwear') && rec.layers.base.includes('tank_top')) {
      rec.layers.base = rec.layers.base.filter(item => item !== 'tank_top');
    }
    
    // Don't have both winter coat and light jacket
    if (rec.layers.outer.includes('winter_coat') && rec.layers.outer.includes('light_jacket')) {
      rec.layers.outer = rec.layers.outer.filter(item => item !== 'light_jacket');
    }
    
    return rec;
  }
  
  /**
   * Check if clothing item is waterproof
   */
  private static isWaterproof(itemKey: string): boolean {
    const categories = ['OUTER_LAYERS', 'FOOTWEAR'] as const;
    for (const category of categories) {
      const item = CLOTHING_ITEMS[category][itemKey];
      if (item?.waterproof) return true;
    }
    return false;
  }
  
  /**
   * Check if clothing item is windproof
   */
  private static isWindproof(itemKey: string): boolean {
    const item = CLOTHING_ITEMS.OUTER_LAYERS[itemKey];
    return item?.windproof || false;
  }
  
  /**
   * Convert recommendation with item keys to readable names
   */
  static formatRecommendation(rec: ClothingRecommendation): FormattedClothingRecommendation {
    return {
      layers: {
        base: rec.layers.base.map(key => this.getItemName(key, 'BASE_LAYERS')),
        mid: rec.layers.mid.map(key => this.getItemName(key, 'MID_LAYERS')),
        outer: rec.layers.outer.map(key => this.getItemName(key, 'OUTER_LAYERS'))
      },
      bottom: rec.bottom.map(key => this.getItemName(key, 'BOTTOM_WEAR')),
      accessories: rec.accessories.map(key => this.getItemName(key, 'ACCESSORIES')),
      footwear: rec.footwear.map(key => this.getItemName(key, 'FOOTWEAR')),
      advice: rec.advice,
      reasoning: rec.reasoning,
      confidence: rec.confidence
    };
  }
  
  /**
   * Get readable name for clothing item
   */
  private static getItemName(key: string, category: keyof typeof CLOTHING_ITEMS): string {
    const items = CLOTHING_ITEMS[category] as { [key: string]: ClothingItem };
    const item = items[key];
    if (!item) {
      console.warn(`Clothing item '${key}' not found in category '${category}'`);
      return key; // Return key as fallback, but log warning
    }
    return item.name;
  }
  
  /**
   * Get simple recommendation for existing UI - flat list of items to wear
   */
  static getSimpleRecommendation(weather: WeatherData): string[] {
    const recommendation = this.getRecommendation(weather);
    const formatted = this.formatRecommendation(recommendation);
    
    // Create a flat list of all clothing items without layer categorization
    const allItems: string[] = [];
    
    // Add all clothing items from all categories
    allItems.push(...formatted.layers.base);
    allItems.push(...formatted.layers.mid);
    allItems.push(...formatted.layers.outer);
    allItems.push(...formatted.bottom);
    allItems.push(...formatted.footwear);
    allItems.push(...formatted.accessories);
    
    // Filter out empty items - return only actual recommendations
    const filteredItems = allItems.filter(item => item && item.trim().length > 0);
    
    // Return all valid items (no padding with empty strings)
    return filteredItems;
  }
}