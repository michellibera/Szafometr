'use client';

import { Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTranslations } from 'next-intl';

interface OutfitRecommendationsProps {
  recommendations: string[];
  onAddOutfit: () => void;
  onLogin?: () => void;
  baseClo?: number;
  personalizedClo?: number;
  isPersonalized?: boolean;
}

export default function OutfitRecommendations({
   recommendations,
   onAddOutfit,
   onLogin,
   baseClo,
   personalizedClo,
   isPersonalized
  }: OutfitRecommendationsProps) {
  const { user } = useAuth();
  const t = useTranslations('OutfitRecommendations');
  return (
    <div className={`p-5 transition-all duration-500 ease-in-out translate-x-0 opacity-100`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-black">{t('title')}</h3>
      </div>
      <div className="space-y-3 mb-8">
        {recommendations
          .filter(item => item && item.trim().length > 0)
          .map((item, i) => (
            <div key={i} className="bg-white/20 backdrop-blur-sm rounded p-3 border border-white/30">
              <span className="text-sm text-black font-medium">• {item}</span>
            </div>
          ))}
      </div>
      <div className='flex flex-col mb-5 text-xs text-black'>
        <span>{t('cloInfo')}</span>
        <span>• {t('cloBase', { clo: baseClo })}</span>
        <span>• {t('cloPersonalized', { clo: isPersonalized ? personalizedClo : t('cloNoPersonalization') })}.</span>
      </div>
      <button
        onClick={user ? onAddOutfit : onLogin}
        className="w-full bg-black text-white rounded-full py-3 px-5 font-bold text-base hover:bg-black/80 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        {user ? t('rateButton') : t('loginToRate')}
      </button>
    </div>
  );
}