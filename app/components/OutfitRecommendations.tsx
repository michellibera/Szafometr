import { Plus } from 'lucide-react';

interface OutfitRecommendationsProps {
  recommendations: string[];
  onAddOutfit: () => void;
}

export default function OutfitRecommendations({ recommendations, onAddOutfit }: OutfitRecommendationsProps) {
  return (
    <div className={`p-5 transition-all duration-500 ease-in-out translate-x-0 opacity-100`}>
      <h3 className="text-2xl font-bold text-black mb-4">Co założyć?</h3>
      <div className="space-y-3 mb-8">
        {recommendations.map((item, i) => (
          <div key={i} className="bg-white/20 backdrop-blur-sm rounded p-3 border border-white/30">
            <span className="text-sm text-black font-medium">• {item}</span>
          </div>
        ))}
      </div>
      <button
        onClick={onAddOutfit}
        className="w-full bg-black text-white rounded-full py-3 px-5 font-bold text-base hover:bg-black/80 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Zapisz dzisiejszy strój
      </button>
    </div>
  );
}