export interface OutfitEntry {
  outfit: string;
  comfort: string;
  date: Date | null | undefined;
  temp: number;
  recommendedItems?: string[];
  clo?: number;
}