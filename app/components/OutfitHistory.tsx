interface OutfitEntry {
  outfit: string;
  comfort: string;
  date: Date;
  temp: number;
}

interface OutfitHistoryProps {
  outfitHistory: OutfitEntry[];
}

export default function OutfitHistory({ outfitHistory }: OutfitHistoryProps) {
  if (outfitHistory.length === 0) {
    return null;
  }

  return (
    <div className="mx-6 p-4 mb-6">
      <h3 className="text-lg font-bold text-black mb-3">Twoje stroje</h3>
      <div className="space-y-3">
        {outfitHistory.slice(-3).map((entry, i) => (
          <div key={i} className="border border-black/20 rounded p-3">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-black">{entry.outfit}</span>
              <span className="text-xs text-black">{entry.temp}°</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-black">{entry.comfort}</span>
              <span className="text-xs text-black">
                {entry.date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}