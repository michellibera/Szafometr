import { useState, useEffect, useCallback } from 'react';
import { OutfitRating, RatingService, WeatherContext, RecommendationData, RatingData } from '@/lib/firebase/ratings';
import { useAuth } from '@/context/AuthContext';

interface UseOutfitRatingsReturn {
  ratings: OutfitRating[];
  loading: boolean;
  error: string | null;
  saveRating: (weather: WeatherContext, recommendation: RecommendationData, rating: RatingData) => Promise<void>;
  clearError: () => void;
}

export function useOutfitRatings(): UseOutfitRatingsReturn {
  const { user } = useAuth();
  const [ratings, setRatings] = useState<OutfitRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to real-time ratings updates
  useEffect(() => {
    if (!user?.uid) {
      setRatings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = RatingService.subscribeToUserRatings(
      user.uid,
      (newRatings) => {
        setRatings(newRatings);
        setLoading(false);
      },
      10 // Limit to last 10 ratings
    );

    return () => {
      try {
        if (unsubscribe && typeof unsubscribe === 'function') {
          unsubscribe();
        }
      } catch (error) {
        console.error('Error cleaning up ratings subscription:', error);
      }
    };
  }, [user?.uid]);

  // Save a new rating
  const saveRating = useCallback(async (
    weather: WeatherContext,
    recommendation: RecommendationData,
    rating: RatingData
  ) => {
    if (!user) {
      setError('You must be logged in to save ratings');
      return;
    }

    try {
      setError(null);
      
      const ratingData = {
        weather,
        recommendation,
        rating
      };

      await RatingService.saveRating(user, ratingData);
      // Real-time subscription will automatically update the ratings list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save rating';
      setError(errorMessage);
      console.error('Error saving rating:', err);
    }
  }, [user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    ratings,
    loading,
    error,
    saveRating,
    clearError
  };
}

// Legacy format converter hook for backward compatibility
export function useOutfitRatingsLegacy() {
  const { ratings, loading, error, saveRating, clearError } = useOutfitRatings();
  
  // Convert to legacy format
  const legacyRatings = ratings.map(rating => RatingService.toLegacyFormat(rating));

  return {
    outfitHistory: legacyRatings,
    loading,
    error,
    saveRating,
    clearError
  };
}