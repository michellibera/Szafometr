import { Check, X } from 'lucide-react';

interface AddOutfitFormProps {
  currentOutfit: string;
  comfortLevel: string;
  onOutfitChange: (outfit: string) => void;
  onComfortChange: (comfort: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isDisabled: boolean;
}

export default function AddOutfitForm({
  currentOutfit,
  comfortLevel,
  onOutfitChange,
  onComfortChange,
  onSave,
  onCancel,
  isDisabled
}: AddOutfitFormProps) {
  const comfortOptions = ['Za zimno ❄️', 'W sam raz ✅', 'Za gorąco 🔥'];

  return (
    <div className={`absolute top-0 left-0 right-0 p-5 transition-all duration-500 ease-in-out translate-x-0 opacity-100`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-black">Co masz na sobie?</h3>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-white/20 rounded"
        >
          <X className="w-5 h-5 text-black" />
        </button>
      </div>

      <div className="space-y-3 mb-8">
        <input
          type="text"
          placeholder="np. T-shirt, dżinsy, trampki..."
          value={currentOutfit}
          onChange={(e) => onOutfitChange(e.target.value)}
          className="w-full bg-white/40 backdrop-blur-sm rounded p-3 border border-white/50 shadow-sm placeholder-black/70 text-black text-sm font-medium outline-none"
        />

        <div>
          <span className="text-sm text-black font-medium">Jak się czujesz?</span>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {comfortOptions.map((option) => (
              <button
                key={option}
                onClick={() => onComfortChange(option)}
                className={`p-2 rounded text-center transition-colors text-sm bg-white/40 backdrop-blur-sm border ${
                  comfortLevel === option
                    ? 'border-black text-black'
                    : 'border-white/50 hover:bg-white/50 text-black'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={onSave}
        disabled={isDisabled}
        className="w-full bg-black text-white rounded-full py-3 px-5 font-bold text-base hover:bg-black/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Check className="w-4 h-4" />
        Zapisz strój
      </button>
    </div>
  );
}