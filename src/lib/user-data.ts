import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  addDoc,
  serverTimestamp,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { 
  UserProfile, 
  QuizAttempt, 
  PerformanceMetrics, 
  StudyPlan, 
  Achievement 
} from '@/lib/types';

export interface UserData {
  profile: UserProfile;
  quizAttempts: QuizAttempt[];
  performance: PerformanceMetrics;
  studyPlans: StudyPlan[];
  achievements: Achievement[];
  settings: UserSettings;
}

export interface UserSettings {
  notifications: boolean;
  soundEffects: boolean;
  theme: 'light' | 'dark' | 'system';
  studyReminders: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const DEFAULT_USER_DATA: Partial<UserData> = {
  performance: {
    totalQuizzes: 0,
    averageScore: 0,
    bestScore: 0,
    timeSpent: 0,
    studyStreak: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    subjectPerformance: [],
    progressTrend: [],
    weeklyActivity: [],
    weakAreas: [],
    strongAreas: [],
  },
  settings: {
    notifications: true,
    soundEffects: true,
    theme: 'system',
    studyReminders: true,
    difficulty: 'intermediate',
  },
  quizAttempts: [],
  studyPlans: [],
  achievements: [],
};

/**
 * Initialize user data when they first sign up
 */
export async function initializeUserData(userId: string, userInfo: {
  email: string;
  displayName?: string;
  photoURL?: string;
}): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const initialProfile: UserProfile = {
      uid: userId,
      email: userInfo.email,
      displayName: userInfo.displayName || userInfo.email.split('@')[0],
      photoURL: userInfo.photoURL || null,
      joinedAt: new Date(),
      lastActive: new Date(),
      level: 1,
      experience: 0,
      totalPoints: 0,
      streakCount: 0,
      preferredSubjects: [],
      studyGoals: {
        dailyQuizzes: 5,
        weeklyStudyHours: 10,
        targetExamDate: null,
      },
    };

    await setDoc(userRef, {
      profile: initialProfile,
      ...DEFAULT_USER_DATA,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

/**
 * Get user's complete data
 */
export async function getUserData(userId: string): Promise<UserData | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        profile: data.profile,
        quizAttempts: data.quizAttempts || [],
        performance: data.performance || DEFAULT_USER_DATA.performance,
        studyPlans: data.studyPlans || [],
        achievements: data.achievements || [],
        settings: data.settings || DEFAULT_USER_DATA.settings,
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    'profile': updates,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Save a quiz attempt and update performance metrics
 */
export async function saveQuizAttempt(userId: string, attempt: {
  quizId: string;
  quizTitle: string;
  subject: string;
  questions: Array<{
    questionId: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
  }>;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpent: number;
  completedAt: Date;
}): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const userData = await getUserData(userId);
  
  if (!userData) return;

  // Create new quiz attempt
  const newAttempt: QuizAttempt = {
    id: `${userId}_${Date.now()}`,
    userId,
    ...attempt,
  };

  // Update quiz attempts
  const updatedAttempts = [...userData.quizAttempts, newAttempt];

  // Recalculate performance metrics
  const updatedPerformance = calculatePerformanceMetrics(updatedAttempts);

  await updateDoc(userRef, {
    quizAttempts: updatedAttempts,
    performance: updatedPerformance,
    'profile.lastActive': serverTimestamp(),
    'profile.totalPoints': userData.profile.totalPoints + (attempt.score * 10),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Calculate performance metrics from quiz attempts
 */
function calculatePerformanceMetrics(attempts: QuizAttempt[]): PerformanceMetrics {
  if (attempts.length === 0) {
    return DEFAULT_USER_DATA.performance!;
  }

  const totalQuizzes = attempts.length;
  const totalCorrect = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
  const totalQuestions = attempts.reduce((sum, attempt) => sum + attempt.totalQuestions, 0);
  const averageScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const bestScore = Math.max(...attempts.map(a => a.percentage));
  const timeSpent = Math.round(attempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0) / 1000 / 60); // in minutes

  // Group by subject
  const subjectGroups = attempts.reduce((groups: {[key: string]: QuizAttempt[]}, attempt) => {
    if (!groups[attempt.subject]) {
      groups[attempt.subject] = [];
    }
    groups[attempt.subject].push(attempt);
    return groups;
  }, {});

  const subjectPerformance = Object.entries(subjectGroups).map(([subject, subjectAttempts]) => {
    const subjectCorrect = subjectAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
    const subjectTotal = subjectAttempts.reduce((sum, attempt) => sum + attempt.totalQuestions, 0);
    const subjectTimeSpent = Math.round(subjectAttempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0) / 1000 / 60);
    
    return {
      subject,
      score: subjectTotal > 0 ? Math.round((subjectCorrect / subjectTotal) * 100) : 0,
      attempts: subjectAttempts.length,
      timeSpent: subjectTimeSpent,
    };
  });

  // Progress trend (last 8 attempts)
  const recentAttempts = attempts.slice(-8);
  const progressTrend = recentAttempts.map((attempt, index) => ({
    date: attempt.completedAt.toISOString().split('T')[0],
    score: attempt.percentage,
    quizzes: 1,
  }));

  // Weekly activity (mock for now - in real app, you'd calculate based on actual dates)
  const weeklyActivity = [
    { day: 'Mon', quizzes: 0, minutes: 0 },
    { day: 'Tue', quizzes: 0, minutes: 0 },
    { day: 'Wed', quizzes: 0, minutes: 0 },
    { day: 'Thu', quizzes: 0, minutes: 0 },
    { day: 'Fri', quizzes: 0, minutes: 0 },
    { day: 'Sat', quizzes: 0, minutes: 0 },
    { day: 'Sun', quizzes: 0, minutes: 0 },
  ];

  // Calculate weak and strong areas based on subject performance
  const weakAreas = subjectPerformance
    .filter(subject => subject.score < 70)
    .map(subject => ({
      topic: subject.subject,
      accuracy: subject.score,
      frequency: subject.attempts,
    }));

  const strongAreas = subjectPerformance
    .filter(subject => subject.score >= 80)
    .map(subject => ({
      topic: subject.subject,
      accuracy: subject.score,
      frequency: subject.attempts,
    }));

  return {
    totalQuizzes,
    averageScore,
    bestScore,
    timeSpent,
    studyStreak: 0, // Calculate based on consecutive days
    totalCorrect,
    totalQuestions,
    subjectPerformance,
    progressTrend,
    weeklyActivity,
    weakAreas,
    strongAreas,
  };
}

/**
 * Get user's recent quiz attempts
 */
export async function getRecentQuizAttempts(userId: string, limit: number = 10): Promise<QuizAttempt[]> {
  const userData = await getUserData(userId);
  if (!userData) return [];

  return userData.quizAttempts
    .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
    .slice(0, limit);
}

/**
 * Update user settings
 */
export async function updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    settings,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Subscribe to user data changes
 */
export function subscribeToUserData(userId: string, callback: (userData: UserData | null) => void): Unsubscribe {
  const userRef = doc(db, 'users', userId);
  
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      callback({
        profile: data.profile,
        quizAttempts: data.quizAttempts || [],
        performance: data.performance || DEFAULT_USER_DATA.performance,
        studyPlans: data.studyPlans || [],
        achievements: data.achievements || [],
        settings: data.settings || DEFAULT_USER_DATA.settings,
      });
    } else {
      callback(null);
    }
  });
}

/**
 * Clear user data (for testing purposes)
 */
export async function clearUserData(userId: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    quizAttempts: [],
    performance: DEFAULT_USER_DATA.performance,
    studyPlans: [],
    achievements: [],
    updatedAt: serverTimestamp(),
  });
}