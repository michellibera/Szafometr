import { useState, useEffect, useCallback } from 'react';
import { UserPersonalizationProfile, PersonalBiasLearner } from '@/lib/personalization/biasLearning';
import { PersonalizationService } from '@/lib/firebase/personalization';
import { useAuth } from '@/context/AuthContext';

// Define the return type for better TypeScript support
interface UsePersonalizationReturn {
  profile: UserPersonalizationProfile | null;  // User's learning profile
  loading: boolean;                             // Is profile being loaded?
  error: string | null;                         // Any error that occurred
  getPersonalizedCLO: (baseCLO: number) => number;  // Get adjusted CLO
  updateFromRating: (                           // Learn from user feedback
    userRating: 'Za zimno ❄️' | 'W sam raz ✅' | 'Za gorąco 🔥',
    predictedCLO: number,
    weather: any
  ) => Promise<void>;
  getUserInsights: () => ReturnType<typeof PersonalBiasLearner.getUserInsights> | null;
  clearError: () => void;
}

export function usePersonalization(): UsePersonalizationReturn {
  // Get current user from auth context
  const { user } = useAuth();
  
  // State management
  const [profile, setProfile] = useState<UserPersonalizationProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load and subscribe to user's personalization profile
  useEffect(() => {
    // Case 1: User not logged in
    if (!user?.uid) {
      setProfile(null);
      setLoading(false);
      return;
    }

    // Case 2: User is logged in - set up real-time subscription
    setLoading(true);
    const unsubscribe = PersonalizationService.subscribeToUserProfile(
      user.uid,
      (newProfile) => {
        if (newProfile) {
          // Profile exists - use it
          setProfile(newProfile);
          setLoading(false);
        } else {
          // No profile exists - create initial one
          PersonalizationService.getUserProfile(user)
            .then(initialProfile => {
              setProfile(initialProfile);
              setLoading(false);
            })
            .catch(err => {
              console.error('Error creating initial profile:', err);
              setError('Failed to initialize personalization');
              // Use default profile as fallback
              setProfile(PersonalBiasLearner.createInitialProfile(user.uid));
              setLoading(false);
            });
        }
      }
    );

    // Cleanup subscription when component unmounts or user changes
    return () => {
      try {
        if (unsubscribe && typeof unsubscribe === 'function') {
          unsubscribe();
        }
      } catch (error) {
        console.error('Error cleaning up personalization subscription:', error);
      }
    };
  }, [user?.uid]); // Re-run when user changes

  // Get personalized CLO recommendation
  const getPersonalizedCLO = useCallback((baseCLO: number): number => {
    // Case 1: No personalization available (user not logged in or profile loading)
    if (!profile || !user) {
      return baseCLO; // Return original scientific calculation
    }

    // Case 2: Apply user's personal bias to the base calculation
    return PersonalBiasLearner.getPersonalizedCLO(baseCLO, profile);
  }, [profile, user]); // Recalculate when profile or user changes

  // Update profile from user rating (this is where learning happens!)
  const updateFromRating = useCallback(async (
    userRating: 'Za zimno ❄️' | 'W sam raz ✅' | 'Za gorąco 🔥',
    predictedCLO: number,
    weather: any
  ) => {
    // Validation: Need profile and user to learn
    if (!profile || !user) {
      setError('No personalization profile available');
      return;
    }

    try {
      setError(null);
      
      // This is where the magic happens:
      // 1. Learning algorithm analyzes the feedback
      // 2. Adjusts user's personal bias
      // 3. Updates confidence scores
      // 4. Saves to Firebase
      const updatedProfile = await PersonalizationService.updateProfileFromFeedback(
        profile,
        userRating,
        predictedCLO,
        weather
      );
      
      // Update local state immediately for better UX
      // (Firebase real-time subscription will also update it)
      setProfile(updatedProfile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update personalization';
      setError(errorMessage);
      console.error('Error updating from rating:', err);
    }
  }, [profile, user]); // Re-create function when profile or user changes

  // Get user insights (for displaying personalization status in UI)
  const getUserInsights = useCallback(() => {
    if (!profile) return null;
    
    // Returns insights like:
    // - "Ubierasz się cieplej niż średnia" 
    // - "Wysoka pewność rekomendacji"
    // - "System dobrze Cię poznał"
    return PersonalBiasLearner.getUserInsights(profile);
  }, [profile]);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Return all functionality to the component
  return {
    profile,              // Current personalization data
    loading,              // Is data being loaded?
    error,                // Any error that occurred
    getPersonalizedCLO,   // Function to get personalized recommendation
    updateFromRating,     // Function to learn from user feedback
    getUserInsights,      // Function to get user insights for UI
    clearError            // Function to clear errors
  };
}