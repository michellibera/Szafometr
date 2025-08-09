import { Timestamp, serverTimestamp } from 'firebase/firestore';

export interface UserPersonalizationProfile {
    userId: string;
    personalBias: number; // -1.0 to +1.0
    confidence: number // 0.0 to 1.0
    totalRatings: number;
    positiveRatings: number;
    learningRate: number; // Dynamic learning rate
    consistencyScore: number; // Rating consistency
    recentAccuracy: number; // Recent prediction accuracy
    createdAt: Timestamp | Date;
    lastUpdated: Timestamp | Date;
    lastLearningEvent: Timestamp | Date;
    temperatureRange?: {
        min: number;
        max: number;
    }
}

export interface LearningEvent {
    eventId?: string;
    timestamp: Timestamp | Date;
    weather: any;
    baseClo: number;
    personalBias: number;
    predictedClo: number;
    userRating: 'Za zimno ❄️' | 'W sam raz ✅' | 'Za gorąco 🔥';

    biasAdjustment: number;
    newBias: number;
    confidenceChange: number;
    timeOfDay: number;
    seasonalContext: string;
}

export class PersonalBiasLearner {
/**
 * Create initial personalization profile for new user
 */ 
    static createInitialProfile(userId: string): UserPersonalizationProfile {
        return {
            userId,
            personalBias: 0.0, // Start neutral
            confidence: 0.0, // no confidence for a start
            totalRatings: 0,
            positiveRatings: 0,
            learningRate: 0.2, // high learing rate for a start
            consistencyScore: 0.5, // average consistency
            recentAccuracy: 0.5,
            createdAt: new Date(),
            lastUpdated: new Date(),
            lastLearningEvent: new Date(),
        };
    }

    /**
     * Update personalization profile based on user feedback
     */
    static updateBiasFromFeedback(
        profile: UserPersonalizationProfile,
        userRating: 'Za zimno ❄️' | 'W sam raz ✅' | 'Za gorąco 🔥',
        predictedClo: number,
        weather: any
    ): 
    {
        updatedProfile: UserPersonalizationProfile;
        learningEvent: LearningEvent
    }{
        // conver reating to learning signal
        const ratingToAdjustment = this.getRatingAdjustment(userRating, profile);

        // Calculate dynamic learning rate
        const dynamicLearningRate = this.calculateDynamicLearningRate(profile);

        // Calculate bias adjustment
        const biasAdjustment = ratingToAdjustment * dynamicLearningRate;

        // Update bias with exponential moving average
        const newBias = this.limitBiasRange(profile.personalBias + biasAdjustment);

        // Update Statistics
        const updatedProfile: UserPersonalizationProfile = {
            ...profile,
            personalBias: newBias,
            totalRatings: profile.totalRatings + 1,
            positiveRatings: profile.positiveRatings + (userRating === 'W sam raz ✅' ? 1 : 0),
            learningRate: Math.max(0.05, profile.learningRate * 0.995), // decay learning rate
            confidence: this.calculateConfidence(profile.totalRatings + 1, profile.positiveRatings + (userRating === 'W sam raz ✅' ? 1 : 0)),
            consistencyScore: this.updateConsistencyScore(profile, userRating),
            recentAccuracy: this.updateRecentAccuracy(profile, userRating),
            lastUpdated: new Date(),
            lastLearningEvent: new Date(),
        };

        // Create learning event for tracking
        const learningEvent: LearningEvent = {
            timestamp: new Date(),
            weather,
            baseClo: predictedClo - profile.personalBias, // reverse calculate original
            personalBias: profile.personalBias,
            predictedClo,
            userRating,
            biasAdjustment,
            newBias,
            confidenceChange: updatedProfile.confidence - profile.confidence,
            timeOfDay: new Date().getHours(),
            seasonalContext: this.getSeasonFromClo(predictedClo),
        };

        return {updatedProfile, learningEvent};
    }

    private static getRatingAdjustment(
        rating: 'Za zimno ❄️' | 'W sam raz ✅' | 'Za gorąco 🔥',
        profile: UserPersonalizationProfile): number {
            switch(rating) {
                case 'Za zimno ❄️':
                    // User needs warmer clothes (higher CLO)
                    return +0.15;
                case 'Za gorąco 🔥':
                    // User needs cooler clothes (lower Clo)
                    return -0.15;
                case 'W sam raz ✅':
                    return 0.0;
                default:
                    return 0.0;
            }
    }

    private static calculateDynamicLearningRate(profile: UserPersonalizationProfile): number {
        const baseLearningRate = profile.learningRate;
        const confidenceModifier = 1 - profile.confidence; // Learn faster when less confident
        const consistencyModifier = 1 - profile.consistencyScore; // learn more cautiously (slower) when user is inconsistent

        return baseLearningRate * confidenceModifier * consistencyModifier;
    }

    private static limitBiasRange(bias: number): number {
        return Math.max(-0.8, Math.min(0.8, bias));
    }

    private static calculateConfidence(totalRatings: number, positiveRatings: number): number {
        if (totalRatings === 0 ) return 0;

        const successRate = positiveRatings / totalRatings;
        const volumeConfidence = Math.min(1.0, totalRatings / 20); // fill confidence after 20 ratings

        return (successRate * 0.7) + (volumeConfidence * 0.3); // 70% from success rate, 30% from volume confidence
    }

    private static updateConsistencyScore(profile: UserPersonalizationProfile, newRating: string): number {
        // Simple check: can be changed
        const alpha = 0.1;
        const ratingScore = newRating === 'W sam raz ✅' ? 1.0 : 0.3;
        return profile.consistencyScore * (1-alpha) + ratingScore * alpha;
    }

    private static updateRecentAccuracy(profile: UserPersonalizationProfile, newRating: string): number {
        // Simple implementation - weighted moving average
        const alpha = 0.2;
        const isAccurate = newRating === 'W sam raz ✅' ? 1.0 : 0.0;

        return profile.recentAccuracy * (1 - alpha) + isAccurate * alpha;
    }

    private static getSeasonFromClo(clo: number): string {
        if (clo <= 0.95) return 'summer';
        if (clo <= 1.80) return 'transitional';
        return 'winter';
    }

    /**
     * Calculate personalized CLO recommendation by applying user's personal bias
     */
    static getPersonalizedCLO(baseCLO: number, profile: UserPersonalizationProfile): number {
        const personalizedCLO = baseCLO + profile.personalBias;
        
        // Ensure CLO stays within reasonable bounds
        return Math.max(0.3, Math.min(3.0, personalizedCLO));
    }

}