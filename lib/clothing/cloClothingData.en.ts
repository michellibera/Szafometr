// CLO-based clothing database following thermal comfort standards - ENGLISH

export interface CLOOutfit {
  clo: number;
  description: string;
  items: string[];
  season: 'summer' | 'transitional' | 'winter';
}

export const CLO_OUTFITS: CLOOutfit[] = [
  // Summer clothing (0.30 - 0.95)
  {
    clo: 0.30,
    description: "Very light summer outfit",
    items: ["T-shirt", "shorts or light dress", "sandals"],
    season: 'summer'
  },
  {
    clo: 0.35,
    description: "Light summer sports outfit",
    items: ["T-shirt", "shorts or light dress", "thin socks", "sports shoes"],
    season: 'summer'
  },
  {
    clo: 0.40,
    description: "Standard light summer outfit",
    items: ["short-sleeved shirt", "shorts or light skirt", "thin socks", "light shoes"],
    season: 'summer'
  },
  {
    clo: 0.45,
    description: "Summer dress",
    items: ["stockings or thin socks", "thin short-sleeved dress or short-sleeved shirt + thin pants", "light shoes"],
    season: 'summer'
  },
  {
    clo: 0.50,
    description: "Light formal summer outfit",
    items: ["thin short-sleeved shirt", "thin pants or light skirt", "socks", "light shoes"],
    season: 'summer'
  },
  {
    clo: 0.55,
    description: "Elegant summer dress",
    items: ["stockings or socks", "short-sleeved dress or polo shirt + shorts", "light shoes"],
    season: 'summer'
  },
  {
    clo: 0.60,
    description: "Formal summer outfit",
    items: ["short-sleeved shirt", "thin pants or skirt", "socks", "light shoes"],
    season: 'summer'
  },
  {
    clo: 0.65,
    description: "Elegant women's summer outfit",
    items: ["stockings or socks", "dress or long-sleeved shirt + pants", "shoes"],
    season: 'summer'
  },
  {
    clo: 0.70,
    description: "Transitional summer outfit",
    items: ["short-sleeved shirt", "pants or long skirt", "socks", "shoes"],
    season: 'summer'
  },
  {
    clo: 0.75,
    description: "Summer sports outfit",
    items: ["tracksuit (sweatshirt and pants)", "long socks", "sports shoes"],
    season: 'summer'
  },
  {
    clo: 0.80,
    description: "Formal women's outfit",
    items: ["undershirt", "shirt", "skirt or pants", "knee-highs or socks", "shoes"],
    season: 'summer'
  },
  {
    clo: 0.85,
    description: "Long-sleeved outfit",
    items: ["T-shirt", "long-sleeved collared shirt", "pants", "socks", "shoes"],
    season: 'summer'
  },
  {
    clo: 0.90,
    description: "Elegant outfit with sweater",
    items: ["long-sleeved collared shirt", "skirt or pants", "thin sweater", "knee-highs or socks", "shoes"],
    season: 'summer'
  },
  {
    clo: 0.95,
    description: "Warmer summer outfit",
    items: ["short-sleeved undershirt", "long-sleeved shirt", "pants", "thin sweater", "socks", "shoes"],
    season: 'summer'
  },

  // Transitional seasons clothing (1.00 - 1.80)
  {
    clo: 1.00,
    description: "Light transitional outfit",
    items: ["long-sleeved shirt", "pants", "light jacket", "socks", "shoes"],
    season: 'transitional'
  },
  {
    clo: 1.10,
    description: "Transitional women's outfit",
    items: ["tights or long socks", "blouse", "long skirt or pants", "light jacket", "shoes"],
    season: 'transitional'
  },
  {
    clo: 1.20,
    description: "Standard transitional outfit",
    items: ["short-sleeved undershirt", "long-sleeved shirt", "pants", "jacket", "socks", "shoes"],
    season: 'transitional'
  },
  {
    clo: 1.30,
    description: "Warmer transitional outfit",
    items: ["short-sleeved undershirt", "long-sleeved shirt", "pants", "sweater", "jacket", "socks", "shoes"],
    season: 'transitional'
  },
  {
    clo: 1.40,
    description: "Cool transitional outfit",
    items: ["long-sleeved undershirt", "long-sleeved shirt", "pants", "sweater", "jacket", "socks", "shoes"],
    season: 'transitional'
  },
  {
    clo: 1.50,
    description: "Formal transitional outfit",
    items: ["short-sleeved undershirt", "long-sleeved shirt", "pants or skirt", "vest or blazer", "jacket or cardigan", "knee-length coat", "socks or tights", "shoes"],
    season: 'transitional'
  },
  {
    clo: 1.60,
    description: "Cool outfit with accessories",
    items: ["short-sleeved undershirt", "long-sleeved shirt", "pants or skirt", "blazer or jacket", "hip-length coat", "socks or tights", "shoes", "hat", "gloves"],
    season: 'transitional'
  },
  {
    clo: 1.70,
    description: "Warm transitional outfit",
    items: ["long-sleeved undershirt", "long-sleeved shirt", "pants or warm skirt", "blazer or warm jacket", "insulated coat", "socks or tights", "shoes", "hat", "gloves"],
    season: 'transitional'
  },
  {
    clo: 1.80,
    description: "Cold transitional outfit",
    items: ["short-sleeved undershirt", "long-sleeved shirt", "sweatshirt", "insulated pants", "lined jacket", "socks", "insulated shoes", "hat", "gloves"],
    season: 'transitional'
  },

  // Winter clothing (2.00 - 3.00)
  {
    clo: 2.00,
    description: "Standard winter outfit",
    items: ["long-sleeved undershirt", "long johns or warm tights", "long-sleeved shirt", "insulated pants or warm skirt with tights", "sweatshirt", "lined jacket", "insulated thick-soled shoes", "hat", "gloves"],
    season: 'winter'
  },
  {
    clo: 2.20,
    description: "Warm winter outfit",
    items: ["thermal underwear", "wool pants", "insulated lined jacket", "insulated coat", "insulated socks", "insulated ankle boots", "hat", "gloves"],
    season: 'winter'
  },
  {
    clo: 2.40,
    description: "Very warm winter outfit",
    items: ["thermal underwear", "high thermal insulation pants", "insulated lined jacket", "insulated coat", "insulated socks", "insulated ankle boots", "insulated hat", "gloves"],
    season: 'winter'
  },
  {
    clo: 2.60,
    description: "Extremely warm winter outfit",
    items: ["thermal underwear", "insulated long-sleeved undershirt", "thick wool sweater", "long lined winter jacket", "thick loose pants", "insulated socks", "thick-soled ankle winter boots", "insulated hat", "insulated gloves"],
    season: 'winter'
  },
  {
    clo: 2.80,
    description: "Specialist frost outfit",
    items: ["high thermal insulation thermal underwear", "insulated long-sleeved undershirt", "thick high thermal insulation sweater", "long lined winter jacket", "thick loose pants", "additional high thermal insulation pants", "insulated microfiber socks", "insulated thick-soled ankle winter boots", "insulated hat", "insulated gloves"],
    season: 'winter'
  },
  {
    clo: 3.00,
    description: "Arctic extreme frost outfit",
    items: ["special very high thermal insulation winter clothing", "made of waterproof and windproof fabrics", "complete thermal underwear", "multi-layer insulation system", "scarf", "high thermal insulation gloves and hat", "professional polar boots"],
    season: 'winter'
  }
];

// Helper function to find outfit by CLO value
export function findOutfitByCLO(targetClo: number): CLOOutfit {
  // Find exact match first
  const exactMatch = CLO_OUTFITS.find(outfit => outfit.clo === targetClo);
  if (exactMatch) return exactMatch;

  // Find closest match
  let closestOutfit = CLO_OUTFITS[0];
  let minDifference = Math.abs(targetClo - CLO_OUTFITS[0].clo);

  for (const outfit of CLO_OUTFITS) {
    const difference = Math.abs(targetClo - outfit.clo);
    if (difference < minDifference) {
      minDifference = difference;
      closestOutfit = outfit;
    }
  }

  return closestOutfit;
}

// Helper function to get CLO range info
export function getCLOSeasonInfo(clo: number): { season: string; description: string } {
  if (clo <= 0.95) {
    return { season: 'summer', description: 'Summer season clothing' };
  } else if (clo <= 1.80) {
    return { season: 'transitional', description: 'Transitional season clothing' };
  } else {
    return { season: 'winter', description: 'Winter season clothing' };
  }
}
