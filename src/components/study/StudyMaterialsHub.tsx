'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Download, 
  Clock, 
  Star,
  Search,
  Filter,
  CheckCircle,
  PlayCircle,
  ExternalLink,
  Bookmark
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StudyLesson, LessonResource } from '@/lib/types';

interface StudyMaterialsHubProps {
  subject?: string;
}

// Sample data - in production, this would come from Firebase/API
const sampleLessons: StudyLesson[] = [
  {
    id: '1',
    title: 'Philippine Constitution: Fundamentals',
    subject: 'Philippine Constitution',
    content: 'Learn the basic principles and structure of the Philippine Constitution...',
    duration: 45,
    difficulty: 'medium',
    isCompleted: false,
    resources: [
      {
        id: 'r1',
        type: 'pdf',
        title: '1987 Constitution Full Text',
        url: '/resources/constitution-full.pdf',
        description: 'Complete text of the Philippine Constitution'
      },
      {
        id: 'r2',
        type: 'video',
        title: 'Constitution Overview',
        url: 'https://youtube.com/watch?v=example',
        description: '30-minute video overview'
      }
    ]
  },
  {
    id: '2',
    title: 'Basic Mathematics: Fractions and Decimals',
    subject: 'Mathematics',
    content: 'Master the fundamentals of fractions, decimals, and percentages...',
    duration: 60,
    difficulty: 'easy',
    isCompleted: true,
    completedAt: new Date(),
    resources: [
      {
        id: 'r3',
        type: 'pdf',
        title: 'Math Practice Problems',
        url: '/resources/math-practice.pdf',
        description: '100+ practice problems with solutions'
      }
    ]
  },
  {
    id: '3',
    title: 'English Vocabulary: Government Terms',
    subject: 'Vocabulary (English and Tagalog)',
    content: 'Essential vocabulary for government and public administration...',
    duration: 30,
    difficulty: 'medium',
    isCompleted: false,
    resources: [
      {
        id: 'r4',
        type: 'pdf',
        title: 'Government Vocabulary List',
        url: '/resources/vocab-government.pdf',
        description: '500+ essential terms with definitions'
      },
      {
        id: 'r5',
        type: 'quiz',
        title: 'Vocabulary Quiz',
        url: '/questions?subject=Vocabulary%20(English%20and%20Tagalog)&mode=custom',
        description: 'Test your knowledge of government terms'
      }
    ]
  }
];

const subjects = [
  'All Subjects',
  'Mathematics',
  'Vocabulary (English and Tagalog)',
  'Clerical Analysis',
  'Science',
  'General Information',
  'Philippine Constitution'
];

const difficulties = ['All Levels', 'Easy', 'Medium', 'Hard'];

export function StudyMaterialsHub({ subject }: StudyMaterialsHubProps) {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(subject || 'All Subjects');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Levels');
  const [lessons, setLessons] = useState<StudyLesson[]>(sampleLessons);
  const [bookmarkedLessons, setBookmarkedLessons] = useState<Set<string>>(new Set());

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'All Subjects' || lesson.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'All Levels' || 
                             lesson.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    
    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  const completedLessons = lessons.filter(lesson => lesson.isCompleted).length;
  const totalLessons = lessons.length;
  const completionRate = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'quiz':
        return <PlayCircle className="w-4 h-4" />;
      case 'link':
        return <ExternalLink className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const toggleBookmark = (lessonId: string) => {
    setBookmarkedLessons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      return newSet;
    });
  };

  const markAsCompleted = (lessonId: string) => {
    setLessons(prev => prev.map(lesson => 
      lesson.id === lessonId 
        ? { ...lesson, isCompleted: true, completedAt: new Date() }
        : lesson
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Study Materials</CardTitle>
              <p className="text-muted-foreground">
                Comprehensive lessons and resources for Civil Service Exam preparation
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {completedLessons}/{totalLessons}
              </div>
              <p className="text-sm text-muted-foreground">Lessons Completed</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(completionRate)}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search lessons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map(lesson => (
          <Card key={lesson.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {lesson.subject}
                    </Badge>
                    <Badge 
                      variant="secondary" 
                      className={cn("text-xs", getDifficultyColor(lesson.difficulty))}
                    >
                      {lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{lesson.title}</CardTitle>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleBookmark(lesson.id)}
                  className={cn(
                    "shrink-0",
                    bookmarkedLessons.has(lesson.id) && "text-yellow-600"
                  )}
                >
                  <Bookmark className={cn(
                    "w-4 h-4",
                    bookmarkedLessons.has(lesson.id) && "fill-current"
                  )} />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <p className="text-sm text-muted-foreground mb-4">
                {lesson.content.substring(0, 100)}...
              </p>
              
              <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {lesson.duration} min
                </div>
                {lesson.isCompleted && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </div>
                )}
              </div>

              {/* Resources */}
              {lesson.resources.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Resources:</h4>
                  <div className="space-y-2">
                    {lesson.resources.map(resource => (
                      <div key={resource.id} className="flex items-center gap-2 text-xs">
                        {getResourceIcon(resource.type)}
                        <span className="flex-1">{resource.title}</span>
                        <Button variant="ghost" size="sm" className="p-1 h-auto">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 mt-auto">
                <Button variant="outline" size="sm" className="flex-1">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Study
                </Button>
                {!lesson.isCompleted && (
                  <Button 
                    size="sm" 
                    onClick={() => markAsCompleted(lesson.id)}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No lessons found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria to find relevant study materials.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}