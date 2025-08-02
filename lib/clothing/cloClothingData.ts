// CLO-based clothing database following thermal comfort standards

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
    description: "Bardzo lekki strój letni",
    items: ["T-shirt", "krótkie spodenki lub lekka sukienka", "sandały"],
    season: 'summer'
  },
  {
    clo: 0.35,
    description: "Lekki strój sportowy letni",
    items: ["T-shirt", "krótkie spodenki lub lekka sukienka", "cienkie skarpety", "buty sportowe"],
    season: 'summer'
  },
  {
    clo: 0.40,
    description: "Standardowy lekki strój letni",
    items: ["koszula z krótkimi rękawami", "krótkie spodenki lub lekka spódnica", "cienkie skarpety", "lekkie buty"],
    season: 'summer'
  },
  {
    clo: 0.45,
    description: "Letnia sukienka",
    items: ["pończochy lub cienkie skarpety", "cienka sukienka z krótkimi rękawami lub koszula z krótkimi rękawami + cienkie spodnie", "lekkie buty"],
    season: 'summer'
  },
  {
    clo: 0.50,
    description: "Lekki formalny strój letni",
    items: ["cienka koszula z krótkimi rękawami", "cienkie spodnie lub lekka spódnica", "skarpety", "lekkie buty"],
    season: 'summer'
  },
  {
    clo: 0.55,
    description: "Elegancka sukienka letnia",
    items: ["pończochy lub skarpety", "sukienka z krótkimi rękawami lub koszula polo + krótkie spodnie", "lekkie buty"],
    season: 'summer'
  },
  {
    clo: 0.60,
    description: "Formalny strój letni",
    items: ["koszula z krótkimi rękawami", "cienkie spodnie lub spódnica", "skarpety", "lekkie buty"],
    season: 'summer'
  },
  {
    clo: 0.65,
    description: "Elegancki strój damski letni",
    items: ["pończochy lub skarpety", "sukienka lub koszula z długimi rękawami + spodnie", "buty"],
    season: 'summer'
  },
  {
    clo: 0.70,
    description: "Przejściowy strój letni",
    items: ["koszula z krótkimi rękawami", "spodnie lub długa spódnica", "skarpety", "buty"],
    season: 'summer'
  },
  {
    clo: 0.75,
    description: "Sportowy strój letni",
    items: ["dres (bluza i spodnie)", "długie skarpety", "buty sportowe"],
    season: 'summer'
  },
  {
    clo: 0.80,
    description: "Formalny strój damski",
    items: ["podkoszulek", "koszula", "spódnica lub spodnie", "podkolanówki lub skarpety", "buty"],
    season: 'summer'
  },
  {
    clo: 0.85,
    description: "Strój z długimi rękawami",
    items: ["T-shirt", "koszula z długimi rękawami i kołnierzykiem", "spodnie", "skarpety", "buty"],
    season: 'summer'
  },
  {
    clo: 0.90,
    description: "Elegancki strój z swetrem",
    items: ["koszula z długimi rękawami i kołnierzykiem", "spódnica lub spodnie", "cienki sweter", "podkolanówki lub skarpety", "buty"],
    season: 'summer'
  },
  {
    clo: 0.95,
    description: "Cieplejszy strój letni",
    items: ["podkoszulek z krótkimi rękawami", "koszula z długimi rękawami", "spodnie", "cienki sweter", "skarpety", "buty"],
    season: 'summer'
  },

  // Transitional seasons clothing (1.00 - 1.80)
  {
    clo: 1.00,
    description: "Lekki strój przejściowy",
    items: ["koszula z długimi rękawami", "spodnie", "lekka kurtka", "skarpety", "buty"],
    season: 'transitional'
  },
  {
    clo: 1.10,
    description: "Przejściowy strój damski",
    items: ["rajstopy lub długie skarpety", "bluzka", "długa spódnica lub spodnie", "lekka kurtka", "buty"],
    season: 'transitional'
  },
  {
    clo: 1.20,
    description: "Standardowy strój przejściowy",
    items: ["podkoszulek z krótkimi rękawami", "koszula z długimi rękawami", "spodnie", "kurtka", "skarpety", "buty"],
    season: 'transitional'
  },
  {
    clo: 1.30,
    description: "Cieplejszy strój przejściowy",
    items: ["podkoszulek z krótkimi rękawami", "koszula z długimi rękawami", "spodnie", "sweter", "kurtka", "skarpety", "buty"],
    season: 'transitional'
  },
  {
    clo: 1.40,
    description: "Chłodny strój przejściowy",
    items: ["podkoszulek z długimi rękawami", "koszula z długimi rękawami", "spodnie", "sweter", "kurtka", "skarpety", "buty"],
    season: 'transitional'
  },
  {
    clo: 1.50,
    description: "Formalny strój przejściowy",
    items: ["podkoszulek z krótkimi rękawami", "koszula z długimi rękawami", "spodnie lub spódnica", "kamizelka lub żakiet", "marynarka lub kardigan", "płaszcz do kolan", "skarpety lub rajstopy", "buty"],
    season: 'transitional'
  },
  {
    clo: 1.60,
    description: "Chłodny strój z akcesoriami",
    items: ["podkoszulek z krótkimi rękawami", "koszula z długimi rękawami", "spodnie lub spódnica", "marynarka lub żakiet", "płaszcz do bioder", "skarpety lub rajstopy", "buty", "czapka", "rękawiczki"],
    season: 'transitional'
  },
  {
    clo: 1.70,
    description: "Ciepły strój przejściowy",
    items: ["podkoszulek z długimi rękawami", "koszula z długimi rękawami", "spodnie lub ciepła spódnica", "marynarka lub ciepły żakiet", "płaszcz ocieplany", "skarpety lub rajstopy", "buty", "czapka", "rękawiczki"],
    season: 'transitional'
  },
  {
    clo: 1.80,
    description: "Zimny strój przejściowy",
    items: ["podkoszulek z krótkimi rękawami", "koszula z długimi rękawami", "bluza", "spodnie ocieplane", "kurtka z podszewką", "skarpety", "buty ocieplane", "czapka", "rękawiczki"],
    season: 'transitional'
  },

  // Winter clothing (2.00 - 3.00)
  {
    clo: 2.00,
    description: "Standardowy strój zimowy",
    items: ["podkoszulek z długimi rękawami", "kalesony lub ciepłe rajstopy", "koszula z długimi rękawami", "spodnie ocieplane lub ciepła spódnica z rajstopami", "bluza", "kurtka z podszewką", "ocieplane buty na grubej podeszwie", "czapka", "rękawiczki"],
    season: 'winter'
  },
  {
    clo: 2.20,
    description: "Ciepły strój zimowy",
    items: ["bielizna termiczna", "spodnie wełniane", "ocieplana kurtka z podszewką", "płaszcz ocieplany", "skarpety ocieplane", "ocieplane buty za kostkę", "czapka", "rękawiczki"],
    season: 'winter'
  },
  {
    clo: 2.40,
    description: "Bardzo ciepły strój zimowy",
    items: ["bielizna termiczna", "spodnie z materiałów o wysokiej termoizolacji", "ocieplana kurtka z podszewką", "płaszcz ocieplany", "skarpety ocieplane", "ocieplane buty za kostkę", "czapka ocieplana", "rękawiczki"],
    season: 'winter'
  },
  {
    clo: 2.60,
    description: "Ekstremalnie ciepły strój zimowy",
    items: ["bielizna termiczna", "ocieplany podkoszulek z długimi rękawkami", "gruby sweter wełniany", "długa zimowa kurtka z podszewką", "grube luźne spodnie", "skarpety ocieplane", "zimowe buty na grubej podeszwie i za kostkę", "czapka ocieplana", "rękawiczki ocieplane"],
    season: 'winter'
  },
  {
    clo: 2.80,
    description: "Specjalistyczny strój na mróz",
    items: ["bielizna termiczna o wysokiej termoizolacyjności", "ocieplany podkoszulek z długimi rękawkami", "gruby sweter o wysokiej termoizolacyjności", "długa zimowa kurtka z podszewką", "grube luźne spodnie", "dodatkowe spodnie o wysokiej termoizolacyjności", "ocieplane skarpety z mikrowłókien", "ocieplane zimowe buty na grubej podeszwie i za kostkę", "czapka ocieplana", "rękawiczki ocieplane"],
    season: 'winter'
  },
  {
    clo: 3.00,
    description: "Arktyczny strój na ekstremalny mróz",
    items: ["specjalna zimowa odzież o bardzo wysokiej termoizolacyjności", "wykonana z tkanin wodoodpornych i wiatrochronnych", "kompletna bielizna termiczna", "wielowarstwowy system ocieplenia", "szal", "rękawiczki i czapka o wysokiej termoizolacyjności", "profesjonalne buty polarowe"],
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
    return { season: 'lato', description: 'Odzież sezonu letniego' };
  } else if (clo <= 1.80) {
    return { season: 'przejściowy', description: 'Odzież sezonów przejściowych' };
  } else {
    return { season: 'zima', description: 'Odzież sezonu zimowego' };
  }
}