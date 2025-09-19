'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Award,
  Trophy,
  Star,
  Crown,
  Flame,
  Zap,
  Target,
  BookOpen,
  Clock,
  TrendingUp,
  Calendar,
  Medal,
  Shield,
  Gem,
  Sparkles,
  Rocket,
  Brain,
  CheckCircle,
  Plus,
  Lock,
  Gift,
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Achievement, Badge as BadgeType } from '@/lib/types';

// Sample achievements data
const sampleAchievements: Achievement[] = [
  {
    id: 'first_quiz',
    title: 'Getting Started',
    description: 'Complete your first quiz',
    icon: 'PlayCircle',
    type: 'completion',
    requirement: 1,
    rarity: 'common',
    unlockedAt: new Date('2024-02-01')
  },
  {
    id: 'quiz_streak_7',
    title: 'One Week Wonder',
    description: 'Study for 7 consecutive days',
    icon: 'Flame',
    type: 'streak',
    requirement: 7,
    rarity: 'uncommon',
    unlockedAt: new Date('2024-02-08')
  },
  {
    id: 'perfect_score',
    title: 'Perfectionist',
    description: 'Score 100% on any quiz',
    icon: 'Trophy',
    type: 'score',
    requirement: 100,
    rarity: 'rare'
  },
  {
    id: 'quiz_master',
    title: 'Quiz Master',
    description: 'Complete 50 quizzes',
    icon: 'Crown',
    type: 'completion',
    requirement: 50,
    rarity: 'epic'
  },
  {
    id: 'constitution_expert',
    title: 'Constitution Expert',
    description: 'Average 90% or higher in Philippine Constitution',
    icon: 'Shield',
    type: 'special',
    requirement: 90,
    rarity: 'legendary'
  }
];

const sampleBadges: BadgeType[] = [
  {
    id: 'math_novice',
    name: 'Math Novice',
    description: 'Complete 5 mathematics quizzes',
    icon: 'Calculator',
    color: '#10b981',
    criteria: {
      type: 'quiz_completion',
      target: 5,
      subject: 'Mathematics'
    }
  },
  {
    id: 'study_warrior',
    name: 'Study Warrior',
    description: 'Maintain a 14-day study streak',
    icon: 'Sword',
    color: '#f59e0b',
    criteria: {
      type: 'study_streak',
      target: 14
    }
  },
  {
    id: 'score_achiever',
    name: 'Score Achiever',
    description: 'Average 85% or higher across all subjects',
    icon: 'Target',
    color: '#3b82f6',
    criteria: {
      type: 'score_achievement',
      target: 85
    }
  }
];

interface UserProgress {
  level: number;
  experience: number;
  experienceToNext: number;
  totalPoints: number;
  studyStreak: number;
  longestStreak: number;
  totalQuizzes: number;
  perfectScores: number;
  badges: string[];
  achievements: string[];
  weeklyGoal: number;
  weeklyProgress: number;
  dailyGoalStreak: number;
}

const sampleUserProgress: UserProgress = {
  level: 12,
  experience: 2340,
  experienceToNext: 660,
  totalPoints: 15420,
  studyStreak: 8,
  longestStreak: 23,
  totalQuizzes: 47,
  perfectScores: 3,
  badges: ['math_novice', 'study_warrior'],
  achievements: ['first_quiz', 'quiz_streak_7'],
  weeklyGoal: 300, // points
  weeklyProgress: 185,
  dailyGoalStreak: 5
};

const pointsActivities = [
  { activity: 'Complete a quiz', points: 50, icon: 'BookOpen' },
  { activity: 'Score 90%+ on quiz', points: 25, icon: 'Target' },
  { activity: 'Perfect score (100%)', points: 100, icon: 'Trophy' },
  { activity: 'Daily study goal met', points: 20, icon: 'CheckCircle' },
  { activity: 'Study streak milestone', points: 50, icon: 'Flame' },
  { activity: 'Help in forum (upvoted)', points: 15, icon: 'Award' },
  { activity: 'Complete study lesson', points: 30, icon: 'BookOpen' }
];

const recentActivities = [
  { 
    id: '1', 
    type: 'achievement', 
    title: 'One Week Wonder achieved!', 
    description: 'Studied for 7 consecutive days', 
    points: 100,
    timestamp: new Date('2024-02-15T14:30:00'),
    icon: 'Flame',
    rarity: 'uncommon'
  },
  { 
    id: '2', 
    type: 'quiz', 
    title: 'Mathematics Quiz completed', 
    description: 'Scored 87% on Algebra fundamentals', 
    points: 75,
    timestamp: new Date('2024-02-15T10:15:00'),
    icon: 'BookOpen'
  },
  { 
    id: '3', 
    type: 'streak', 
    title: 'Study streak continues!', 
    description: 'Day 8 of your study streak', 
    points: 20,
    timestamp: new Date('2024-02-15T09:00:00'),
    icon: 'Flame'
  },
  { 
    id: '4', 
    type: 'badge', 
    title: 'Math Novice badge earned!', 
    description: 'Completed 5 mathematics quizzes', 
    points: 150,
    timestamp: new Date('2024-02-14T16:45:00'),
    icon: 'Medal',
    rarity: 'common'
  }
];

export function GamificationSystem() {
  const { currentUser } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgress>(sampleUserProgress);
  const [activeTab, setActiveTab] = useState('overview');

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-600 bg-gray-100 border-gray-300';
      case 'uncommon':
        return 'text-green-600 bg-green-100 border-green-300';
      case 'rare':
        return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'epic':
        return 'text-purple-600 bg-purple-100 border-purple-300';
      case 'legendary':
        return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      PlayCircle: BookOpen,
      Flame,
      Trophy,
      Crown,
      Shield,
      Calculator: Target,
      Sword: Award,
      Target,
      BookOpen,
      CheckCircle,
      Medal,
      Award
    };
    
    const IconComponent = icons[iconName] || Award;
    return <IconComponent className="w-6 h-6" />;
  };

  const getSmallIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      BookOpen,
      Target,
      Trophy,
      CheckCircle,
      Flame,
      Award,
      Medal
    };
    
    const IconComponent = icons[iconName] || Award;
    return <IconComponent className="w-4 h-4" />;
  };

  const getLevelFromExperience = (exp: number) => {
    return Math.floor(exp / 200) + 1; // 200 XP per level
  };

  const getExperienceForLevel = (level: number) => {
    return level * 200;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Achievements & Progress</h1>
        <p className="text-muted-foreground">
          Track your learning journey and unlock rewards as you progress
        </p>
      </div>

      {/* Level and Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Level & XP */}
            <div className="text-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {userProgress.level}
                </div>
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="font-semibold text-lg">Level {userProgress.level}</h3>
              <p className="text-sm text-muted-foreground">
                {userProgress.experience} / {userProgress.experience + userProgress.experienceToNext} XP
              </p>
              <Progress 
                value={(userProgress.experience / (userProgress.experience + userProgress.experienceToNext)) * 100} 
                className="mt-2" 
              />
            </div>

            {/* Study Streak */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mb-4">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{userProgress.studyStreak} Days</h3>
              <p className="text-sm text-muted-foreground">
                Current Streak (Best: {userProgress.longestStreak})
              </p>
            </div>

            {/* Total Points */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{userProgress.totalPoints.toLocaleString()}</h3>
              <p className="text-sm text-muted-foreground">
                Total Points Earned
              </p>
            </div>
          </div>

          {/* Weekly Goal Progress */}
          <div className="mt-6 p-4 bg-white/50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Weekly Goal Progress</h4>
              <span className="text-sm text-muted-foreground">
                {userProgress.weeklyProgress} / {userProgress.weeklyGoal} points
              </span>
            </div>
            <Progress 
              value={(userProgress.weeklyProgress / userProgress.weeklyGoal) * 100}
              className="h-3"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {userProgress.weeklyGoal - userProgress.weeklyProgress} points to go!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <BookOpen className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                      <div className="text-xl font-bold">{userProgress.totalQuizzes}</div>
                      <div className="text-xs text-muted-foreground">Quizzes</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <Trophy className="w-6 h-6 mx-auto text-yellow-600 mb-2" />
                      <div className="text-xl font-bold">{userProgress.perfectScores}</div>
                      <div className="text-xs text-muted-foreground">Perfect Scores</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Medal className="w-6 h-6 mx-auto text-green-600 mb-2" />
                      <div className="text-xl font-bold">{userProgress.badges.length}</div>
                      <div className="text-xs text-muted-foreground">Badges</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <Award className="w-6 h-6 mx-auto text-purple-600 mb-2" />
                      <div className="text-xl font-bold">{userProgress.achievements.length}</div>
                      <div className="text-xs text-muted-foreground">Achievements</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How to Earn Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pointsActivities.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getSmallIconComponent(activity.icon)}
                          <span className="font-medium">{activity.activity}</span>
                        </div>
                        <Badge variant="secondary">+{activity.points} XP</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className={cn(
                      "p-2 rounded-full flex-shrink-0",
                      activity.rarity ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-blue-100'
                    )}>
                      {getSmallIconComponent(activity.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          +{activity.points} XP
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(activity.timestamp, 'MMM dd, HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Achievements */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleAchievements.map(achievement => {
                  const isUnlocked = userProgress.achievements.includes(achievement.id);
                  
                  return (
                    <Card key={achievement.id} className={cn(
                      "relative overflow-hidden transition-all",
                      isUnlocked ? "border-2 bg-gradient-to-br from-yellow-50 to-orange-50" : "opacity-60 grayscale",
                      isUnlocked && getRarityColor(achievement.rarity)
                    )}>
                      <CardContent className="p-4">
                        {!isUnlocked && (
                          <Lock className="absolute top-2 right-2 w-4 h-4 text-muted-foreground" />
                        )}
                        
                        <div className="text-center">
                          <div className={cn(
                            "w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3",
                            isUnlocked ? getRarityColor(achievement.rarity) : "bg-gray-200"
                          )}>
                            {getIconComponent(achievement.icon)}
                          </div>
                          
                          <h3 className="font-semibold mb-1">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {achievement.description}
                          </p>
                          
                          <div className="flex items-center justify-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs", getRarityColor(achievement.rarity))}
                            >
                              {achievement.rarity}
                            </Badge>
                            {isUnlocked && achievement.unlockedAt && (
                              <span className="text-xs text-muted-foreground">
                                {format(achievement.unlockedAt, 'MMM dd')}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Badges */}
        <TabsContent value="badges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleBadges.map(badge => {
                  const isEarned = userProgress.badges.includes(badge.id);
                  
                  return (
                    <Card key={badge.id} className={cn(
                      "relative transition-all",
                      isEarned ? "border-2 border-blue-200 bg-blue-50" : "opacity-60"
                    )}>
                      <CardContent className="p-4">
                        {!isEarned && (
                          <Lock className="absolute top-2 right-2 w-4 h-4 text-muted-foreground" />
                        )}
                        
                        <div className="text-center">
                          <div 
                            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3"
                            style={{ 
                              backgroundColor: isEarned ? badge.color + '20' : '#f3f4f6',
                              border: `2px solid ${isEarned ? badge.color : '#d1d5db'}`
                            }}
                          >
                            {getIconComponent(badge.icon)}
                          </div>
                          
                          <h3 className="font-semibold mb-1">{badge.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {badge.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leaderboard */}
        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Points Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { rank: 1, name: 'Maria Santos', points: 18420, avatar: 'MS' },
                  { rank: 2, name: 'Current User (You)', points: userProgress.totalPoints, avatar: 'You', isCurrentUser: true },
                  { rank: 3, name: 'John Dela Cruz', points: 14280, avatar: 'JD' },
                  { rank: 4, name: 'Ana Reyes', points: 13950, avatar: 'AR' },
                  { rank: 5, name: 'Carlos Rodriguez', points: 12340, avatar: 'CR' }
                ].map(user => (
                  <div key={user.rank} className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border",
                    user.isCurrentUser && "bg-primary/10 border-primary"
                  )}>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                        user.rank === 1 && "bg-yellow-100 text-yellow-800",
                        user.rank === 2 && "bg-gray-100 text-gray-800",
                        user.rank === 3 && "bg-amber-100 text-amber-800",
                        user.rank > 3 && "bg-blue-100 text-blue-800"
                      )}>
                        #{user.rank}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {user.avatar}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={cn(
                        "font-semibold",
                        user.isCurrentUser && "text-primary"
                      )}>
                        {user.name}
                      </h3>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {user.points.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <Rocket className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-semibold">Level Up Bonus!</h4>
                    <p className="text-sm text-muted-foreground">
                      You need {userProgress.experienceToNext} more XP to reach Level {userProgress.level + 1} and earn 200 bonus points!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}