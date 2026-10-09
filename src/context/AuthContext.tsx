import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { storageService } from '../services/storageService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => storageService.getUserProfile());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            fullName: session.user.user_metadata?.full_name || 'Farmer',
            preferredLanguage: 'en',
            isGuest: false,
          });
        }
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            fullName: session.user.user_metadata?.full_name || 'Farmer',
            preferredLanguage: 'en',
            isGuest: false,
          });
        } else {
          setUser(storageService.getUserProfile());
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const signInWithEmail = async (email: string) => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signInWithOtp({ email });
      } else {
        // Mock sign in for demo mode
        setUser({
          id: 'user_' + Math.random().toString(36).substring(2, 9),
          email,
          fullName: email.split('@')[0],
          preferredLanguage: 'en',
          isGuest: false,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    const guest = storageService.getUserProfile();
    setUser(guest);
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    const updated = storageService.saveUserProfile(profile);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !user.isGuest,
        isLoading,
        signInWithEmail,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
