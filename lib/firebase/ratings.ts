import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  Timestamp,
  QuerySnapshot,
  DocumentData,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase-client';
import { User } from 'firebase/auth';

export interface WeatherContext {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  cloudCover: number;
  isDay: boolean;
  weatherCode: number;
}

export interface RecommendationData {
  items: string[];
  clo: number;
  season: string;
  confidence: number;
}

export interface RatingData {
  comfort: 'Za zimno' | 'W sam raz' | 'Za gorąco';
  timestamp: Timestamp | Date;
}

export interface OutfitRating {
  id?: string;
  userId: string;
  createdAt: Timestamp | Date;
  weather: WeatherContext;
  recommendation: RecommendationData;
  rating: RatingData;
}

export class RatingService {
  /**
   * Save a new outfit rating to Firebase
   */
  static async saveRating(user: User, ratingData: Omit<OutfitRating, 'id' | 'userId' | 'createdAt'>): Promise<string> {
    try {
      if (!user?.uid) {
        throw new Error('User must be authenticated to save ratings');
      }

      const ratingsCollection = collection(db, 'users', user.uid, 'outfit-ratings');
      
      const docData = {
        userId: user.uid,
        createdAt: serverTimestamp(),
        weather: ratingData.weather,
        recommendation: ratingData.recommendation,
        rating: {
          ...ratingData.rating,
          timestamp: serverTimestamp()
        }
      };

      const docRef = await addDoc(ratingsCollection, docData);
      return docRef.id;
    } catch (error) {
      console.error('Error saving rating:', error);
      throw new Error('Failed to save rating. Please try again.');
    }
  }

  /**
   * Subscribe to real-time updates of user ratings
   */
  static subscribeToUserRatings(
    userId: string, 
    callback: (ratings: OutfitRating[]) => void,
    limitCount: number = 10
  ): () => void {
    if (!userId) {
      callback([]);
      return () => {};
    }

    try {
      const ratingsCollection = collection(db, 'users', userId, 'outfit-ratings');
      const q = query(
        ratingsCollection,
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
        const ratings: OutfitRating[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as OutfitRating));
        
        callback(ratings);
      }, (error) => {
        console.error('Error fetching ratings:', error);
        callback([]);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up ratings subscription:', error);
      callback([]);
      return () => {};
    }
  }

  /**
   * Get user ratings (one-time fetch)
   */
  static async getUserRatings(userId: string, limitCount: number = 10): Promise<OutfitRating[]> {
    try {
      if (!userId) return [];

      const ratingsCollection = collection(db, 'users', userId, 'outfit-ratings');
      const q = query(
        ratingsCollection,
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as OutfitRating));
    } catch (error) {
      console.error('Error fetching user ratings:', error);
      return [];
    }
  }

  /**
   * Convert Firestore timestamp to JS Date for display
   */
  static timestampToDate(timestamp: Timestamp | Date): Date {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    return timestamp;
  }

  /**
   * Convert OutfitRating to legacy OutfitEntry format for backward compatibility
   */
  static toLegacyFormat(rating: OutfitRating): {
    outfit: string;
    comfort: string;
    date: Date;
    temp: number;
    recommendedItems?: string[];
    clo?: number;
  } {
    return {
      outfit: rating.recommendation.items.join(', '),
      comfort: rating.rating.comfort,
      date: this.timestampToDate(rating.createdAt),
      temp: rating.weather.temp,
      recommendedItems: rating.recommendation.items,
      clo: rating.recommendation.clo
    };
  }
}