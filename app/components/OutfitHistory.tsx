import { OutfitEntry } from '@/types/outfit';

interface OutfitHistoryProps {
  outfitHistory: OutfitEntry[];
  loading?: boolean;
  error?: string | null;
  onClearError?: () => void;
}

// Helper function to safely format dates
function formatDate(date: Date | null | undefined): string {
  if (!date) return 'Brak daty';
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return 'Nieprawidłowa data';
    
    return dateObj.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Błąd daty';
  }
}

export default function OutfitHistory({ outfitHistory, loading, error, onClearError }: OutfitHistoryProps) {
  if (loading) {
    return (
      <div className="mx-6 p-4 mb-6">
        <h3 className="text-lg font-bold text-black mb-3">Twoje oceny rekomendacji</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          <span className="ml-3 text-sm text-black">Ładowanie ocen...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-6 p-4 mb-6">
        <h3 className="text-lg font-bold text-black mb-3">Twoje oceny rekomendacji</h3>
        <div className="bg-red-100/90 backdrop-blur border border-red-300 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-700 text-sm font-medium">Błąd ładowania ocen</p>
              <p className="text-red-600 text-xs">{error}</p>
            </div>
            {onClearError && (
              <button
                onClick={onClearError}
                className="text-red-500 hover:text-red-700 text-lg font-bold"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (outfitHistory.length === 0) {
    return (
      <div className="mx-6 p-4 mb-6">
        <h3 className="text-lg font-bold text-black mb-3">Twoje oceny rekomendacji</h3>
        <div className="text-center py-8">
          <p className="text-sm text-black/70">Brak zapisanych ocen</p>
          <p className="text-xs text-black/50 mt-1">Oceń pierwszą rekomendację, aby zobaczyć historię</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-6 p-4 mb-6">
      <h3 className="text-lg font-bold text-black mb-3">Twoje oceny rekomendacji</h3>
      <div className="text-sm text-black/70 mb-3">Łącznie ocen: {outfitHistory.length}</div>
      <div className="space-y-3">
        {outfitHistory.slice(-3).map((entry, i) => (
          <div key={i} className="border border-black/20 rounded p-3">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <span className="text-sm font-medium text-black">{entry.outfit}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-black">{entry.temp}°</span>
              <span className="text-xs text-black font-medium">{entry.comfort}</span>
              <span className="text-xs text-black">
                {formatDate(entry.date)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}