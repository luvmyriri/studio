'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Target,
  Trophy,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Play,
  Brain,
  Clock,
  Award,
  TrendingUp,
} from 'lucide-react';

export default function DemoPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Philippine Civil Service Exam Prep
        </h1>
        <p className="text-xl text-muted-foreground mt-2">
          AI-Powered Learning Platform (Demo Mode)
        </p>
        <Badge variant="secondary" className="mt-4">
          Demo Environment - All Features Available
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Questions</p>
                <p className="text-2xl font-bold">2,456</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Study Streak</p>
                <p className="text-2xl font-bold">15 Days</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rank</p>
                <p className="text-2xl font-bold">#42</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-blue-500" />
              Take Practice Quiz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Start a personalized quiz based on your study preferences
            </p>
            <Button className="w-full">Start Quiz</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-green-500" />
              Mock Exam
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Take a full-length practice exam with realistic timing
            </p>
            <Button variant="outline" className="w-full">Launch Exam</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
              Study Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Access comprehensive study guides and resources
            </p>
            <Button variant="outline" className="w-full">Browse Materials</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              Study Planner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              AI-powered study scheduling and recommendations
            </p>
            <Button variant="outline" className="w-full">View Plan</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-pink-500" />
              Community
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Join study groups and discussion forums
            </p>
            <Button variant="outline" className="w-full">Join Community</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-500" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Track your progress and performance insights
            </p>
            <Button variant="outline" className="w-full">View Analytics</Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Completed Mathematics Quiz</p>
                <p className="text-sm text-muted-foreground">Scored 92% • 2 hours ago</p>
              </div>
              <Badge variant="secondary">+25 points</Badge>
            </div>
            
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Started Study Session</p>
                <p className="text-sm text-muted-foreground">Philippine Constitution • 4 hours ago</p>
              </div>
              <Badge variant="outline">45 min</Badge>
            </div>
            
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Achievement Unlocked</p>
                <p className="text-sm text-muted-foreground">Week Warrior - 7 day streak • Yesterday</p>
              </div>
              <Award className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Mathematics</span>
                  <span className="text-sm font-medium">89%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">General Information</span>
                  <span className="text-sm font-medium">76%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '76%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Vocabulary</span>
                  <span className="text-sm font-medium">94%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Study Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Science Review</p>
                  <p className="text-sm text-muted-foreground">Today, 3:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="font-medium">Mock Exam Practice</p>
                  <p className="text-sm text-muted-foreground">Tomorrow, 9:00 AM</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="font-medium">Vocabulary Drill</p>
                  <p className="text-sm text-muted-foreground">Saturday, 2:00 PM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demo Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900">Demo Mode Active</h3>
              <p className="text-blue-700 text-sm">
                You're viewing the demo version of the Philippine Civil Service Exam Prep platform. 
                All features are functional but data is simulated for demonstration purposes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}