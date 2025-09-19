// Quiz Types
export interface Question {
  id?: string;
  question: string;
  answers: string[];
  correctAnswer: string;
  explanation?: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number; // in seconds
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Quiz {
  id?: string;
  quiz: Question[];
  title?: string;
  description?: string;
  subject?: string;
  timeLimit?: number;
  totalQuestions?: number;
  passingScore?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// User Types
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  lastLogin: Date;
  studyStreak: number;
  totalScore: number;
  totalQuizzesTaken: number;
  achievements: Achievement[];
  studyPlan?: StudyPlan;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  studyTime: number; // minutes per day
  subjects: string[];
  notifications: {
    daily: boolean;
    weekly: boolean;
    achievements: boolean;
  };
}

// Performance & Analytics Types
export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  questions: QuestionAttempt[];
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpent: number; // in seconds
  completedAt: Date;
  subject: string;
  difficulty: string;
}

export interface QuestionAttempt {
  questionId: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  flagged?: boolean;
}

export interface PerformanceMetrics {
  userId: string;
  subject: string;
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  timeSpent: number;
  weakAreas: string[];
  strongAreas: string[];
  progressTrend: number; // -1 to 1, where 1 is improving
  lastUpdated: Date;
}

// Study Planning Types
export interface StudyPlan {
  id: string;
  userId: string;
  title: string;
  subjects: StudySubject[];
  startDate: Date;
  targetDate: Date;
  dailyGoal: number; // minutes
  completionRate: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudySubject {
  name: string;
  priority: 'high' | 'medium' | 'low';
  hoursAllocated: number;
  hoursCompleted: number;
  targetScore: number;
  currentScore: number;
  lessons: StudyLesson[];
}

export interface StudyLesson {
  id: string;
  title: string;
  subject: string;
  content: string;
  duration: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  isCompleted: boolean;
  completedAt?: Date;
  resources: LessonResource[];
}

export interface LessonResource {
  id: string;
  type: 'pdf' | 'video' | 'link' | 'quiz';
  title: string;
  url: string;
  description?: string;
}

// Gamification Types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'score' | 'streak' | 'completion' | 'time' | 'special';
  requirement: number;
  unlockedAt?: Date;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  criteria: BadgeCriteria;
}

export interface BadgeCriteria {
  type: 'quiz_completion' | 'score_achievement' | 'study_streak' | 'subject_mastery';
  target: number;
  subject?: string;
}

// Social Learning Types
export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  members: string[];
  isPublic: boolean;
  subject?: string;
  createdAt: Date;
  activities: GroupActivity[];
}

export interface GroupActivity {
  id: string;
  type: 'quiz_challenge' | 'discussion' | 'study_session';
  title: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  participants: string[];
  data: any; // Flexible data based on activity type
}

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  subject: string;
  tags: string[];
  votes: number;
  replies: ForumReply[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumReply {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  votes: number;
  createdAt: Date;
  parentId?: string; // For nested replies
}

// Content Management Types
export interface QuestionBank {
  id: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
  createdBy: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockExam {
  id: string;
  title: string;
  description: string;
  subjects: ExamSubject[];
  timeLimit: number;
  totalQuestions: number;
  passingScore: number;
  instructions: string;
  isActive: boolean;
  createdAt: Date;
}

export interface ExamSubject {
  name: string;
  questionCount: number;
  timeAllocation: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Search and Filter Types
export interface SearchFilters {
  subject?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: 'date' | 'score' | 'difficulty' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'achievement' | 'reminder' | 'social' | 'system';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
}

// Progress Tracking
export interface Progress {
  userId: string;
  subject: string;
  totalLessons: number;
  completedLessons: number;
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number;
  timeSpent: number;
  lastActivity: Date;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  isCompleted: boolean;
  completedAt?: Date;
  reward?: string;
}
