// Clothing database as constants - based on Polish weather clothing guidelines

export interface ClothingItem {
  name: string;
  warmth?: number; // 1-10 scale
  waterproof?: boolean;
  windproof?: boolean;
  conditions?: string[];
}

export interface ClothingCategory {
  [key: string]: ClothingItem;
}

export const CLOTHING_ITEMS = {
  // Base layers
  BASE_LAYERS: {
    thermal_underwear: { name: "Bielizna termiczna", warmth: 8 },
    long_sleeve_shirt: { name: "Koszula z długim rękawem", warmth: 4 },
    t_shirt: { name: "T-shirt", warmth: 2 },
    tank_top: { name: "Koszulka na ramiączkach", warmth: 1 }
  } as ClothingCategory,
  
  // Mid layers
  MID_LAYERS: {
    thick_sweater: { name: "Gruby sweter", warmth: 7 },
    hoodie: { name: "Bluza z kapturem", warmth: 5 },
    light_sweater: { name: "Lekki sweter", warmth: 4 },
    cardigan: { name: "Kardigan", warmth: 3 },
    polar: { name: "Polar", warmth: 6 }
  } as ClothingCategory,
  
  // Outer layers
  OUTER_LAYERS: {
    winter_coat: { name: "Kurtka zimowa", warmth: 9, waterproof: true, windproof: true },
    rain_jacket: { name: "Kurtka przeciwdeszczowa", warmth: 2, waterproof: true },
    light_jacket: { name: "Lekka kurtka", warmth: 4 },
    windbreaker: { name: "Wiatrówka", warmth: 1, windproof: true },
    transitional_jacket: { name: "Kurtka przejściowa", warmth: 5, windproof: true },
    leather_jacket: { name: "Kurtka skórzana", warmth: 4, windproof: true }
  } as ClothingCategory,
  
  // Accessories
  ACCESSORIES: {
    winter_hat: { name: "Czapka zimowa", conditions: ["cold", "windy"] },
    scarf: { name: "Szalik", conditions: ["cold", "windy"] },
    gloves: { name: "Rękawiczki", conditions: ["cold"] },
    sunglasses: { name: "Okulary słoneczne", conditions: ["sunny"] },
    umbrella: { name: "Parasol", conditions: ["rain"] },
    light_scarf: { name: "Lekka chustka", conditions: ["cool"] }
  } as ClothingCategory,
  
  // Bottom wear
  BOTTOM_WEAR: {
    long_trousers: { name: "Długie spodnie", warmth: 4 },
    short_trousers: { name: "Krótkie spodnie", warmth: 1 }
  } as ClothingCategory,

  // Footwear
  FOOTWEAR: {
    winter_boots: { name: "Buty zimowe", warmth: 8, waterproof: true },
    rain_boots: { name: "Kalosze", warmth: 3, waterproof: true },
    sneakers: { name: "Buty sportowe", warmth: 4 },
    sandals: { name: "Sandały", warmth: 1 },
    ankle_boots: { name: "Botki", warmth: 5, waterproof: true },
    dress_shoes: { name: "Półbuty", warmth: 3 }
  } as ClothingCategory
};

export interface TemperatureRule {
  range: { min: number; max: number };
  description: string;
  base: string[];
  mid: string[];
  outer: string[];
  bottom: string[];
  accessories: string[];
  footwear: string[];
  advice: string;
}

// Temperature-based clothing rules following Polish climate guidelines
export const TEMP_RULES: TemperatureRule[] = [
  {
    range: { min: -50, max: -10 },
    description: "Silny mróz",
    base: ["thermal_underwear"],
    mid: ["thick_sweater"],
    outer: ["winter_coat"],
    bottom: ["long_trousers"],
    accessories: ["winter_hat", "scarf", "gloves"],
    footwear: ["winter_boots"],
    advice: "Bardzo ciepła odzież zimowa jest konieczna. Ubiór warstwowy chroni przed mrozem."
  },
  {
    range: { min: -10, max: 0 },
    description: "Bardzo zimno",
    base: ["long_sleeve_shirt"],
    mid: ["thick_sweater"],
    outer: ["winter_coat"],
    bottom: ["long_trousers"],
    accessories: ["winter_hat", "scarf", "gloves"],
    footwear: ["winter_boots"],
    advice: "Pełny strój zimowy wymagany. Chroń głowę, szyję i dłonie."
  },
  {
    range: { min: 0, max: 5 },
    description: "Zimno",
    base: ["long_sleeve_shirt"],
    mid: ["hoodie"],
    outer: ["winter_coat"],
    bottom: ["long_trousers"],
    accessories: ["winter_hat", "scarf"],
    footwear: ["winter_boots"],
    advice: "Ciepła odzież nadal potrzebna. Można zrezygnować z rękawiczek."
  },
  {
    range: { min: 5, max: 10 },
    description: "Chłodno",
    base: ["long_sleeve_shirt"],
    mid: ["light_sweater"],
    outer: ["transitional_jacket"],
    bottom: ["long_trousers"],
    accessories: ["light_scarf"],
    footwear: ["ankle_boots"],
    advice: "Ubieraj się warstwowo. Przygotuj się na zmiany temperatury w ciągu dnia."
  },
  {
    range: { min: 10, max: 16 },
    description: "Umiarkowanie chłodno",
    base: ["long_sleeve_shirt"],
    mid: ["cardigan"],
    outer: ["light_jacket"],
    bottom: ["long_trousers"],
    accessories: [],
    footwear: ["sneakers"],
    advice: "Lekka kurtka może się przydać. Można ją zdjąć w ciągu dnia."
  },
  {
    range: { min: 16, max: 20 },
    description: "Łagodnie",
    base: ["t_shirt"],
    mid: [],
    outer: [],
    bottom: ["long_trousers"],
    accessories: [],
    footwear: ["sneakers"],
    advice: "Pogoda przejściowa. Miej kurtkę na wypadek ochłodzenia."
  },
  {
    range: { min: 20, max: 25 },
    description: "Ciepło",
    base: ["t_shirt"],
    mid: [],
    outer: [],
    bottom: ["long_trousers"],
    accessories: [],
    footwear: ["sneakers"],
    advice: "Lekki, przewiewny strój. Możesz nosić krótkie rękawy."
  },
  {
    range: { min: 25, max: 30 },
    description: "Gorąco",
    base: ["t_shirt"],
    mid: [],
    outer: [],
    bottom: ["short_trousers"],
    accessories: [],
    footwear: ["sandals"],
    advice: "Bardzo lekki strój z naturalnych materiałów. Chroń się przed słońcem."
  },
  {
    range: { min: 30, max: 50 },
    description: "Skrajny upał",
    base: ["tank_top"],
    mid: [],
    outer: [],
    bottom: ["short_trousers"],
    accessories: [],
    footwear: ["sandals"],
    advice: "Minimalna odzież, jasne kolory. Unikaj długiego przebywania na słońcu."
  }
];

// Weather condition modifiers
export const WEATHER_MODIFIERS = {
  WIND: {
    threshold: 20, // km/h
    additions: {
      outer: ["windbreaker"],
      accessories: ["scarf"]
    }
  },
  PRECIPITATION: {
    threshold: 0.1, // mm
    replacements: {
      outer: ["rain_jacket"],
      footwear: ["rain_boots"]
    },
    additions: {
      accessories: ["umbrella"]
    }
  },
  MORNING_EVENING: {
    tempThreshold: 20,
    additions: {
      mid: ["cardigan"]
    }
  },
  SUNNY: {
    cloudThreshold: 30, // % cloud cover
    tempThreshold: 15,
    additions: {
      accessories: ["sunglasses"]
    }
  }
};