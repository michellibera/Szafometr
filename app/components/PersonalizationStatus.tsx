import { UserPersonalizationProfile, PersonalBiasLearner } from '@/lib/personalization/biasLearning';

interface PersonalizationStatusProps {
  profile: UserPersonalizationProfile | null;
  loading: boolean;
  isActive: boolean; // Whether personalization is being used
}

export default function PersonalizationStatus({ profile, loading, isActive }: PersonalizationStatusProps) {
  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
          <span className="text-blue-700 text-xs">Uczenie się...</span>
        </div>
      </div>
    );
  }

  if (!profile || !isActive) {
    return null; // Don't show anything for anonymous users
  }

  const insights = PersonalBiasLearner.getUserInsights(profile);
  const bias = profile.personalBias;
  const confidence = profile.confidence;

  const getConfidenceText = () => {
    if (confidence > 0.8) return 'wysoka pewność';
    if (confidence > 0.5) return 'średnia pewność';
    return 'uczenie się';
  };
  
  return (
    <div className="px-3 py-2 text-xs">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-black font-medium">Personalizacja:</span>
        </div>
        <div className="flex items-center justify-between">
        <span className="text-black/70">Ilość ocen: {profile.totalRatings}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-black/70">Status: {getConfidenceText()}</span>
        </div>
      </div>
    </div>
  );
}