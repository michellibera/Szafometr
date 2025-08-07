import { addDoc, collection, doc, DocumentData, DocumentSnapshot, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase-client';
import { LearningEvent, PersonalBiasLearner, UserPersonalizationProfile } from '../personalization/biasLearning';
import { User } from 'firebase/auth';

export class PersonalizationService {

    static async getUserProfile(user: User): Promise<UserPersonalizationProfile> {
        try {
            if(!user?.uid) {
                throw new Error('User must be authenticated');
            }

            const profileRef = doc(db, 'users', user.uid, 'personalization', 'profile');
            const profileSnap = await getDoc(profileRef);

            if (profileSnap.exists()) {
                return profileSnap.data() as UserPersonalizationProfile;
            } else {
                const initialProfile = PersonalBiasLearner.createInitialProfile(user.uid);

                await setDoc(profileRef, {
                    ...initialProfile,
                    createdAt: serverTimestamp(),
                    lastUpdated: serverTimestamp(),
                    lastLearningEvent: serverTimestamp(),
                });
                return initialProfile;
            }

        } catch (error) {
            console.log('Error getting user profile:', error);
            return PersonalBiasLearner.createInitialProfile(user?.uid || 'anonymous');
        }
    }
    
    static async updateUserProfile(profile: UserPersonalizationProfile): Promise<void> {
        try {
            if (!profile.userId) {
                throw new Error('User ID is required');
            }
            const profileRef = doc(db, 'users', profile.userId, 'personalization', 'profile');
            await setDoc(profileRef, {
                ...profile,
                lastUpdated: serverTimestamp(),
            }, { merge: true });

        } catch (error) {
            console.error('Error updating user profile:', error);
            throw new Error('Failed to update user profile');
        }
    }

    static async saveLearningEvent(userId: string, event: LearningEvent): Promise<void> {
        try {
            if (!userId) {
                throw new Error('User ID is required');
            }

            const eventRef = collection(db, 'users', userId, 'learning-events');
            await addDoc(eventRef, {
                ...event,
                timestamp: serverTimestamp(),
            });
        } catch (error) {
            console.error('Error saving learning event:', error);
        }
    }

    static subscribeToUserProfile(
        userId: string,
        callback: (profile: UserPersonalizationProfile | null) => void): () => void {
            if (!userId) {
                callback(null);
                return () => {};
            }

        try {
            const profileRef = doc(db, 'users', userId, 'personalization', 'profile');
            const unsubscribe = onSnapshot(profileRef, (doc: DocumentSnapshot<DocumentData>) => {
                if (doc.exists()) {
                callback(doc.data()  as UserPersonalizationProfile);
            } else {
                callback(null);
            }}, (error) => {console.error('Error in profile subscription:', error);
                callback(null)
            });
            return unsubscribe;
        } catch (error) {
            console.error('Error setting up profile subscription:', error);
            callback(null);
            return () => {};
        }
    }

    static async updateProfileFromFeedback(
        profile: UserPersonalizationProfile,
        userRating: 'Za zimno ❄️' | 'W sam raz ✅' | 'Za gorąco 🔥',
        predictedClo: number,
        weather: any
    ): Promise<UserPersonalizationProfile> {
        try {
            const { updatedProfile, learningEvent } = PersonalBiasLearner.updateBiasFromFeedback(profile, userRating, predictedClo, weather);
            await this.updateUserProfile(updatedProfile);
            
            // Save learning event for analytics (non-blocking)
            this.saveLearningEvent(profile.userId, learningEvent).catch(error => {
                console.warn('Failed to save learning event:', error);
            });

            return updatedProfile;
        } catch (error) {
            console.error('Error updating profile from feedback:', error);
            throw new Error('Failed to update personalization from feedback');
        }
    }
}