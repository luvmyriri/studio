'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Award,
  BookOpen,
  BarChart3,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Brain,
  Zap,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PerformanceMetrics, QuizAttempt } from '@/lib/types';
import { getUserData, type UserData } from '@/lib/user-data';

// Empty default data structure
const emptyPerformanceData = {
  totalQuizzes: 0,
  averageScore: 0,
  bestScore: 0,
  timeSpent: 0,
  studyStreak: 0,
  totalCorrect: 0,
  totalQuestions: 0,
  subjectPerformance: [],
  progressTrend: [],
  weeklyActivity: [
    { day: 'Mon', quizzes: 0, minutes: 0 },
    { day: 'Tue', quizzes: 0, minutes: 0 },
    { day: 'Wed', quizzes: 0, minutes: 0 },
    { day: 'Thu', quizzes: 0, minutes: 0 },
    { day: 'Fri', quizzes: 0, minutes: 0 },
    { day: 'Sat', quizzes: 0, minutes: 0 },
    { day: 'Sun', quizzes: 0, minutes: 0 },
  ],
  weakAreas: [],
  strongAreas: [],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function PerformanceDashboard() {
  const { currentUser } = useAuth();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [selectedMetric, setSelectedMetric] = useState<'score' | 'time' | 'accuracy'>('score');
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

  const data = userData?.performance || emptyPerformanceData;

  const getScoreTrend = () => {
    const recent = data.progressTrend.slice(-2);
    if (recent.length < 2) return 0;
    return recent[1].score - recent[0].score;
  };

  const scoreTrend = getScoreTrend();
  const isImproving = scoreTrend > 0;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state for new users
  if (!currentUser || data.totalQuizzes === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Performance Analytics</h1>
          <p className="text-muted-foreground">
            Track your progress and identify areas for improvement
          </p>
        </div>
        
        <Card>
          <CardContent className="p-12 text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Data Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start taking quizzes and exams to see your performance analytics here. 
              Your progress will be tracked automatically.
            </p>
            <Button onClick={() => window.location.href = '/quiz'} className="mr-2">
              Take Your First Quiz
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/mock-exam'}>
              Try Mock Exam
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Performance Analytics</h1>
          <p className="text-muted-foreground">
            Track your progress and identify areas for improvement
          </p>
        </div>
        
        <div className="flex gap-2">
          {(['week', 'month', 'quarter'] as const).map(range => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                <p className={cn("text-2xl font-bold", getPerformanceColor(data.overall.averageScore))}>
                  {data.overall.averageScore.toFixed(1)}%
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {isImproving ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={cn(
                    "text-xs font-medium",
                    isImproving ? "text-green-600" : "text-red-600"
                  )}>
                    {Math.abs(scoreTrend).toFixed(1)} points
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Quizzes</p>
                <p className="text-2xl font-bold">{data.overall.totalQuizzes}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.overall.totalQuestions} questions answered
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Study Time</p>
                <p className="text-2xl font-bold">{formatTime(data.overall.timeSpent)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  This month
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Study Streak</p>
                <p className="text-2xl font-bold text-orange-600">{data.overall.studyStreak}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Days in a row
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="progress" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="progress">Progress Trends</TabsTrigger>
          <TabsTrigger value="subjects">Subject Performance</TabsTrigger>
          <TabsTrigger value="activity">Study Activity</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Score Progress Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.progressTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.progressTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quizzes" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accuracy Rate</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <div className="text-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        className="text-blue-500"
                        strokeDasharray={`${(data.overall.totalCorrect / data.overall.totalQuestions) * 100}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">
                        {Math.round((data.overall.totalCorrect / data.overall.totalQuestions) * 100)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {data.overall.totalCorrect} of {data.overall.totalQuestions} correct
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Subject</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.subjectPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Subject Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={data.subjectPerformance}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ subject, attempts }) => `${subject}: ${attempts}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="attempts"
                    >
                      {data.subjectPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Study Time by Subject</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.subjectPerformance.map((subject, index) => (
                  <div key={subject.subject}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{subject.subject}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatTime(subject.timeSpent)}
                      </span>
                    </div>
                    <Progress
                      value={(subject.timeSpent / Math.max(...data.subjectPerformance.map(s => s.timeSpent))) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Study Pattern</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="minutes" fill="#82ca9d" name="Study Time (minutes)" />
                  <Bar dataKey="quizzes" fill="#8884d8" name="Quizzes Taken" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                <p className="text-2xl font-bold">
                  {data.weeklyActivity.reduce((sum, day) => sum + day.quizzes, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Quizzes This Week</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 mx-auto text-green-500 mb-2" />
                <p className="text-2xl font-bold">
                  {formatTime(data.weeklyActivity.reduce((sum, day) => sum + day.minutes, 0))}
                </p>
                <p className="text-sm text-muted-foreground">Study Time This Week</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                <p className="text-2xl font-bold">
                  {Math.round(data.weeklyActivity.reduce((sum, day) => sum + day.minutes, 0) / 7)}
                </p>
                <p className="text-sm text-muted-foreground">Avg. Minutes/Day</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <CardTitle>Areas for Improvement</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.weakAreas.map((area, index) => (
                  <div key={area.topic} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{area.topic}</span>
                      <Badge variant="destructive" className="text-xs">
                        {area.accuracy}% accuracy
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mb-1">
                      {area.frequency} questions attempted
                    </div>
                    <Progress value={area.accuracy} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <CardTitle>Strong Areas</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.strongAreas.map((area, index) => (
                  <div key={area.topic} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{area.topic}</span>
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                        {area.accuracy}% accuracy
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mb-1">
                      {area.frequency} questions attempted
                    </div>
                    <Progress value={area.accuracy} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Personalized Recommendations */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-500" />
                <CardTitle>Personalized Recommendations</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Study Focus</h4>
                <p className="text-sm text-blue-800">
                  Based on your performance, focus on <strong>Algebraic Expressions</strong> and 
                  <strong> Constitutional Law</strong>. These areas show the most room for improvement.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">Study Schedule</h4>
                <p className="text-sm text-green-800">
                  Your most productive study days are <strong>Monday, Wednesday, and Friday</strong>. 
                  Consider scheduling more challenging topics during these times.
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-900 mb-2">Goal Achievement</h4>
                <p className="text-sm text-purple-800">
                  You're on track to reach a 85% average score by next month. 
                  Maintain your current pace and focus on weak areas to achieve this goal.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}