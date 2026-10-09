import { AnalysisResult, LanguageCode, UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { db } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch,
} from 'firebase/firestore';

const EXPRESS_API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';
const FIRESTORE_ANALYSES_COLLECTION = 'analyses';
const LOCAL_STORAGE_KEY_HISTORY = 'cropwise_analysis_history';
const LOCAL_STORAGE_KEY_PROFILE = 'cropwise_user_profile';
const LOCAL_STORAGE_KEY_SETTINGS = 'cropwise_app_settings';

export interface AppSettings {
  language: LanguageCode;
  voiceRate: number;
  autoReadResults: boolean;
  theme: 'light' | 'dark' | 'system';
  customGeminiApiKey?: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  voiceRate: 0.95,
  autoReadResults: false,
  theme: 'light',
  customGeminiApiKey: '',
};

export const storageService = {
  // Get all analysis history
  async getAnalyses(userId?: string): Promise<AnalysisResult[]> {
    try {
      // 1. Firestore (real, connected backend for this project)
      try {
        const analysesRef = collection(db, FIRESTORE_ANALYSES_COLLECTION);
        const firestoreQuery = userId
          ? query(analysesRef, where('userId', '==', userId), orderBy('createdAt', 'desc'))
          : query(analysesRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(firestoreQuery);
        if (!snapshot.empty) {
          return snapshot.docs.map((d) => d.data() as AnalysisResult);
        }
      } catch (firestoreErr) {
        console.warn('Firestore getAnalyses failed, falling back:', firestoreErr);
      }

      // 2. Check Express backend REST API
      try {
        const res = await fetch(`${EXPRESS_API_URL}/analyses`);
        if (res.ok) {
          const apiData = await res.json();
          if (Array.isArray(apiData) && apiData.length > 0) {
            return apiData;
          }
        }
      } catch {
        // Fall through to Supabase / LocalStorage
      }

      // 3. If Supabase is configured and user is logged in
      if (isSupabaseConfigured && supabase && userId) {
        const { data, error } = await supabase
          .from('analyses')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((item) => ({
            id: item.id,
            cropName: item.crop_name,
            diseaseName: item.disease_name,
            scientificName: item.scientific_name,
            confidence: item.confidence,
            severity: item.severity,
            symptoms: item.symptoms || [],
            possibleCauses: item.possible_causes || [],
            recommendedCare: item.recommended_care || { organic: [], chemical: [], immediateAction: '' },
            prevention: item.prevention || [],
            imageUrl: item.image_url,
            createdAt: item.created_at,
            userId: item.user_id,
            notes: item.notes,
            isDemo: item.is_demo,
          }));
        }
      }

      // 4. Fallback to LocalStorage
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY_HISTORY);
      if (localData) {
        return JSON.parse(localData);
      }
      return [];
    } catch (e) {
      console.error('Failed to load analyses:', e);
      return [];
    }
  },

  // Save an analysis
  async saveAnalysis(analysis: AnalysisResult, userId?: string): Promise<void> {
    const record: AnalysisResult = { ...analysis, userId: userId || analysis.userId };

    try {
      // Save locally first
      const current = await this.getAnalyses();
      const filtered = current.filter((item) => item.id !== record.id);
      const updated = [record, ...filtered];
      localStorage.setItem(LOCAL_STORAGE_KEY_HISTORY, JSON.stringify(updated.slice(0, 50)));

      // Write to Firestore (the project's real, connected datastore)
      try {
        await setDoc(doc(db, FIRESTORE_ANALYSES_COLLECTION, record.id), record);
      } catch (firestoreErr) {
        console.warn('Firestore saveAnalysis failed:', firestoreErr);
      }

      // Sync to Express Backend API
      try {
        await fetch(`${EXPRESS_API_URL}/analyses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record),
        });
      } catch {
        // Express offline
      }

      // Sync to Supabase
      if (isSupabaseConfigured && supabase && userId) {
        await supabase.from('analyses').upsert({
          id: record.id,
          user_id: userId,
          crop_name: record.cropName,
          disease_name: record.diseaseName,
          scientific_name: record.scientificName,
          confidence: record.confidence,
          severity: record.severity,
          symptoms: record.symptoms,
          possible_causes: record.possibleCauses,
          recommended_care: record.recommendedCare,
          prevention: record.prevention,
          image_url: record.imageUrl,
          created_at: record.createdAt,
          is_demo: record.isDemo || false,
        });
      }
    } catch (e) {
      console.error('Failed to save analysis:', e);
    }
  },

  // Delete a single analysis
  async deleteAnalysis(id: string, userId?: string): Promise<void> {
    try {
      const current = await this.getAnalyses();
      const updated = current.filter((item) => item.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY_HISTORY, JSON.stringify(updated));

      // Delete from Firestore
      try {
        await deleteDoc(doc(db, FIRESTORE_ANALYSES_COLLECTION, id));
      } catch (firestoreErr) {
        console.warn('Firestore deleteAnalysis failed:', firestoreErr);
      }

      // Sync to Express Backend
      try {
        await fetch(`${EXPRESS_API_URL}/analyses/${id}`, {
          method: 'DELETE',
        });
      } catch {
        // Express offline
      }

      if (isSupabaseConfigured && supabase && userId) {
        await supabase.from('analyses').delete().eq('id', id).eq('user_id', userId);
      }
    } catch (e) {
      console.error('Failed to delete analysis:', e);
    }
  },

  // Clear all analyses
  async clearAllAnalyses(userId?: string): Promise<void> {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY_HISTORY);

      // Clear from Firestore
      try {
        const analysesRef = collection(db, FIRESTORE_ANALYSES_COLLECTION);
        const firestoreQuery = userId
          ? query(analysesRef, where('userId', '==', userId))
          : query(analysesRef);
        const snapshot = await getDocs(firestoreQuery);
        if (!snapshot.empty) {
          const batch = writeBatch(db);
          snapshot.docs.forEach((d) => batch.delete(d.ref));
          await batch.commit();
        }
      } catch (firestoreErr) {
        console.warn('Firestore clearAllAnalyses failed:', firestoreErr);
      }

      if (isSupabaseConfigured && supabase && userId) {
        await supabase.from('analyses').delete().eq('user_id', userId);
      }
    } catch (e) {
      console.error('Failed to clear analyses:', e);
    }
  },

  // Settings
  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: Partial<AppSettings>): AppSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(updated));
    return updated;
  },

  // Guest / User profile
  getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }

    const defaultProfile: UserProfile = {
      id: 'guest_' + Math.random().toString(36).substring(2, 9),
      fullName: 'Farmer Friend',
      preferredLanguage: 'en',
      isGuest: true,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(defaultProfile));
    return defaultProfile;
  },

  saveUserProfile(profile: Partial<UserProfile>): UserProfile {
    const current = this.getUserProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(updated));
    return updated;
  },
};
