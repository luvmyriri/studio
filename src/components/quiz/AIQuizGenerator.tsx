'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Brain, Target, TrendingUp, Zap, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getUserData } from '@/lib/user-data';
import { useRouter } from 'next/navigation';

interface UserAnalytics {
  weakSubjects: string[];
  strongSubjects: string[];
  averageScore: number;
  totalQuizzes: number;
  recentPerformance: { subject: string; score: number }[];
  recommendedDifficulty: 'easy' | 'medium' | 'hard';
}

interface AIQuizSuggestion {
  title: string;
  description: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export function AIQuizGenerator() {
  const { firebaseUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [suggestions, setSuggestions] = useState<AIQuizSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingQuiz, setGeneratingQuiz] = useState<string | null>(null);

  useEffect(() => {
    if (firebaseUser?.uid) {
      loadUserAnalytics();
    }
  }, [firebaseUser]);

  const loadUserAnalytics = async () => {
    if (!firebaseUser?.uid) return;

    try {
      const userData = await getUserData(firebaseUser.uid);
      if (!userData) return;

      // Analyze user performance data
      const performance = userData.performance;
      const subjectPerformance = performance.subjectBreakdown || {};
      
      // Calculate weak and strong subjects
      const subjects = Object.keys(subjectPerformance);
      const subjectScores = subjects.map(subject => ({
        subject,
        avgScore: subjectPerformance[subject]?.averageScore || 0,
        totalQuizzes: subjectPerformance[subject]?.totalQuizzes || 0
      }));

      // Sort by performance
      subjectScores.sort((a, b) => a.avgScore - b.avgScore);
      
      const weakSubjects = subjectScores.slice(0, Math.ceil(subjects.length / 2)).map(s => s.subject);
      const strongSubjects = subjectScores.slice(Math.ceil(subjects.length / 2)).map(s => s.subject);

      const userAnalytics: UserAnalytics = {
        weakSubjects,
        strongSubjects,
        averageScore: performance.averageScore || 0,
        totalQuizzes: performance.totalQuizzes || 0,
        recentPerformance: subjectScores.slice(-5),
        recommendedDifficulty: performance.averageScore > 80 ? 'hard' : 
                               performance.averageScore > 60 ? 'medium' : 'easy'
      };

      setAnalytics(userAnalytics);
      generateAISuggestions(userAnalytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAISuggestions = (analytics: UserAnalytics) => {
    const suggestions: AIQuizSuggestion[] = [];

    // High priority: Focus on weak subjects
    analytics.weakSubjects.slice(0, 2).forEach(subject => {
      suggestions.push({
        title: `Strengthen ${subject} Skills`,
        description: `Focus quiz on ${subject} to improve your weakest area`,
        subject,
        difficulty: 'easy',
        questionCount: 15,
        reason: `Your current average in ${subject} needs improvement`,
        priority: 'high'
      });
    });

    // Medium priority: Challenge strong subjects
    if (analytics.strongSubjects.length > 0) {
      const strongSubject = analytics.strongSubjects[0];
      suggestions.push({
        title: `Challenge Your ${strongSubject} Expertise`,
        description: `Take on harder ${strongSubject} questions to push your limits`,
        subject: strongSubject,
        difficulty: analytics.recommendedDifficulty,
        questionCount: 20,
        reason: `You're doing well in ${strongSubject}, let's challenge you further`,
        priority: 'medium'
      });
    }

    // Mixed review for balanced practice
    suggestions.push({
      title: 'Comprehensive Review Quiz',
      description: 'Mixed questions from all subjects based on your performance',
      subject: 'Mixed',
      difficulty: analytics.recommendedDifficulty,
      questionCount: 25,
      reason: 'Balanced practice across all Civil Service Exam topics',
      priority: 'medium'
    });

    // Quick practice session
    suggestions.push({
      title: 'Quick Practice Session',
      description: 'Short quiz focusing on recent mistakes',
      subject: analytics.weakSubjects[0] || 'General Information',
      difficulty: 'easy',
      questionCount: 10,
      reason: 'Quick reinforcement of challenging concepts',
      priority: 'low'
    });

    setSuggestions(suggestions);
  };

  const generateQuiz = async (suggestion: AIQuizSuggestion) => {
    setGeneratingQuiz(suggestion.title);

    try {
      // Build query parameters based on suggestion
      const params = new URLSearchParams({
        aiGenerated: 'true',
        numQuestions: suggestion.questionCount.toString(),
        difficulty: suggestion.difficulty,
      });

      if (suggestion.subject !== 'Mixed') {
        params.set('topic', suggestion.subject);
      }

      // Add user context for AI
      params.set('userContext', JSON.stringify({
        weakSubjects: analytics?.weakSubjects || [],
        averageScore: analytics?.averageScore || 0,
        totalQuizzes: analytics?.totalQuizzes || 0
      }));

      router.push(`/questions?${params.toString()}`);
      
      toast({
        title: 'Generating AI Quiz...',
        description: `Creating a personalized ${suggestion.title.toLowerCase()} for you`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate AI quiz. Please try again.',
      });
    } finally {
      setGeneratingQuiz(null);
    }
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getDifficultyIcon = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy': return '●';
      case 'medium': return '●●';
      case 'hard': return '●●●';
    }
  };

  if (loading) {
    return (
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-blue-50/50 to-purple-50/50">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2">Analyzing your performance...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      {analytics && (
        <Card className="border-primary/20 bg-gradient-to-r from-background/50 to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Your Performance Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{analytics.averageScore}%</div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{analytics.totalQuizzes}</div>
                <div className="text-sm text-muted-foreground">Quizzes Taken</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{analytics.weakSubjects.length}</div>
                <div className="text-sm text-muted-foreground">Areas to Improve</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{analytics.strongSubjects.length}</div>
                <div className="text-sm text-muted-foreground">Strong Areas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Quiz Suggestions */}
      <div className="grid gap-4 md:grid-cols-2">
        {suggestions.map((suggestion, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                </div>
                <Badge className={`${getPriorityColor(suggestion.priority)} text-xs`}>
                  {suggestion.priority}
                </Badge>
              </div>
              <CardDescription>{suggestion.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {suggestion.subject}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {suggestion.questionCount} questions
                    </span>
                    <span className="flex items-center gap-1">
                      <span>{getDifficultyIcon(suggestion.difficulty)}</span>
                      {suggestion.difficulty}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  "{suggestion.reason}"
                </p>
                <Button 
                  onClick={() => generateQuiz(suggestion)}
                  disabled={!!generatingQuiz}
                  className="w-full"
                  variant={suggestion.priority === 'high' ? 'default' : 'outline'}
                >
                  {generatingQuiz === suggestion.title ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Start AI Quiz
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}