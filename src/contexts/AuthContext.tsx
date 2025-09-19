'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import { User, UserPreferences } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { initializeUserData, getUserData } from '@/lib/user-data';

interface AuthContextType {
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  difficulty: 'medium',
  studyTime: 30,
  subjects: ['General Information', 'Mathematics', 'Vocabulary (English and Tagalog)'],
  notifications: {
    daily: true,
    weekly: true,
    achievements: true,
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const createUserDocument = async (firebaseUser: FirebaseUser, additionalData: any = {}) => {
    if (!firebaseUser || !firebaseUser.uid || !firebaseUser.email) {
      console.error('Invalid firebase user:', firebaseUser);
      return;
    }

    try {
      // Initialize user data using the new system
      await initializeUserData(firebaseUser.uid, {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || additionalData.displayName,
        photoURL: firebaseUser.photoURL,
      });

      // Get the user data and convert to the old User type for compatibility
      const userData = await getUserData(firebaseUser.uid);
      if (userData) {
        const legacyUser: User = {
          uid: userData.profile.uid,
          email: userData.profile.email,
          displayName: userData.profile.displayName,
          photoURL: userData.profile.photoURL,
          createdAt: userData.profile.joinedAt,
          lastLogin: userData.profile.lastActive,
          studyStreak: userData.profile.streakCount,
          totalScore: userData.profile.totalPoints,
          totalQuizzesTaken: userData.performance.totalQuizzes,
          achievements: userData.achievements || [],
          preferences: {
            theme: userData.settings.theme,
            difficulty: userData.settings.difficulty as any,
            studyTime: 30,
            subjects: ['General Information', 'Mathematics', 'Vocabulary (English and Tagalog)'],
            notifications: {
              daily: userData.settings.studyReminders,
              weekly: userData.settings.notifications,
              achievements: userData.settings.notifications,
            },
          },
        };
        setCurrentUser(legacyUser);
      }
    } catch (error) {
      console.error('Error creating/fetching user document:', error);
      // Don't throw error, just log it to prevent breaking the auth flow
    }
  };

  const refreshUser = async () => {
    if (!firebaseUser) return;
    
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      setCurrentUser(userDoc.data() as User);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      await createUserDocument(result.user);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: error.message || 'An error occurred during login.',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the Firebase user profile
      await updateProfile(result.user, {
        displayName,
      });

      await createUserDocument(result.user, { displayName });
      
      toast({
        title: 'Account created!',
        description: "Welcome to BSOAD Civil Service Exam Reviewer. Let's start your learning journey!",
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: error.message || 'An error occurred during registration.',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      await createUserDocument(result.user);
      toast({
        title: 'Welcome!',
        description: 'You have successfully logged in with Google.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google login failed',
        description: error.message || 'An error occurred during Google login.',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setFirebaseUser(null);
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Logout failed',
        description: error.message || 'An error occurred during logout.',
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Password reset sent',
        description: 'Check your email for password reset instructions.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Password reset failed',
        description: error.message || 'An error occurred while sending password reset email.',
      });
      throw error;
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!currentUser) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: error.message || 'An error occurred while updating your profile.',
      });
      throw error;
    }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    try {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        try {
          if (user && user.uid && user.email) {
            console.log('Auth state changed - user logged in:', user.email);
            setFirebaseUser(user);
            await createUserDocument(user);
          } else {
            console.log('Auth state changed - user logged out');
            setFirebaseUser(null);
            setCurrentUser(null);
          }
        } catch (error) {
          console.error('Error in auth state change handler:', error);
        }
        setLoading(false);
      });
    } catch (error) {
      console.warn('Firebase not configured properly, running in demo mode:', error);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    currentUser,
    firebaseUser,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}