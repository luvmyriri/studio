'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calculator,
  CheckCircle,
  TrendingUp,
  FlaskConical,
  BookOpen,
  Brain,
  Loader2,
  BarChart3,
} from 'lucide-react';
import { getUserData, type UserData } from '@/lib/user-data';

export default function ProgressPage() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user data from Firebase
  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser) {
        try {
          const data = await getUserData(currentUser.uid);
          setUserData(data);
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
      setLoading(false);
    };

    loadUserData();
  }, [currentUser]);

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your progress...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state for new users
  if (!currentUser || !userData || userData.performance.totalQuizzes === 0) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tighter">Your Progress</h1>
          <p className="text-muted-foreground mt-2">
            Track your scores, identify weaknesses, and conquer the exam.
          </p>
        </div>
        
        <Card>
          <CardContent className="p-12 text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Start Building Your Progress</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Take quizzes and exams to start tracking your performance and progress. 
              We'll show your detailed statistics here.
            </p>
            <Button onClick={() => window.location.href = '/quiz'} className="mr-2">
              <BookOpen className="w-4 h-4 mr-2" />
              Take Your First Quiz
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/mock-exam'}>
              <Brain className="w-4 h-4 mr-2" />
              Try Mock Exam
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const performance = userData.performance;
  const topSubjects = performance.subjectPerformance
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  const weakestSubject = performance.subjectPerformance
    .sort((a, b) => a.score - b.score)[0];
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tighter">Your Progress</h1>
        <p className="text-muted-foreground mt-2">
          Track your scores, identify weaknesses, and conquer the exam.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Average
            </CardTitle>
            <TrendingUp className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{performance.averageScore}%</div>
            <p className="text-xs text-muted-foreground">
              {performance.totalQuizzes} quizzes taken
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Best Score
            </CardTitle>
            <CheckCircle className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{performance.bestScore}%</div>
            <p className="text-xs text-muted-foreground">
              Your highest score
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {weakestSubject ? 'Needs Focus' : 'Keep Studying'}
            </CardTitle>
            <Calculator className="text-destructive" />
          </CardHeader>
          <CardContent>
            {weakestSubject ? (
              <>
                <div className="text-2xl font-bold">{weakestSubject.subject}</div>
                <p className="text-xs text-muted-foreground">
                  Average Score: {weakestSubject.score}%
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">All Good!</div>
                <p className="text-xs text-muted-foreground">
                  No weak areas identified
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subject Performance</CardTitle>
          <CardDescription>
            Your average score for each subject category.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {performance.subjectPerformance.length > 0 ? (
            performance.subjectPerformance.map((subject, index) => {
              const getSubjectIcon = (subjectName: string) => {
                if (subjectName.toLowerCase().includes('math')) return Calculator;
                if (subjectName.toLowerCase().includes('science')) return FlaskConical;
                return BookOpen;
              };
              
              const getScoreColor = (score: number) => {
                if (score >= 90) return 'bg-green-500';
                if (score >= 80) return 'bg-blue-500';
                if (score >= 70) return 'bg-yellow-500';
                return 'bg-red-500';
              };
              
              const IconComponent = getSubjectIcon(subject.subject);
              
              return (
                <div key={subject.subject} className="flex items-center">
                  <IconComponent className="mr-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">{subject.subject}</p>
                      <span className="text-sm text-muted-foreground">
                        {subject.attempts} attempts
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${getScoreColor(subject.score)}`}
                        style={{ width: `${subject.score}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="ml-4 font-bold">{subject.score}%</p>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4" />
              <p>Take quizzes to see your subject performance breakdown</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
