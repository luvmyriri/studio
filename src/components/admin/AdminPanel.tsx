'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  FileText,
  BookOpen,
  Settings,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
  Database,
  UserCheck,
  UserX,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Question, User, QuizAttempt } from '@/lib/types';

// Sample admin data
const sampleQuestions: (Question & { status: 'active' | 'draft' | 'archived', createdBy: string, lastModified: Date })[] = [
  {
    id: 'q1',
    question: 'What is the capital of the Philippines?',
    answers: ['Manila', 'Cebu', 'Davao', 'Quezon City'],
    correctAnswer: 'Manila',
    subject: 'General Information',
    difficulty: 'easy',
    explanation: 'Manila is the national capital and second most populous city of the Philippines.',
    tags: ['geography', 'philippines', 'capital'],
    status: 'active',
    createdBy: 'admin',
    createdAt: new Date('2024-01-15'),
    lastModified: new Date('2024-02-01')
  },
  {
    id: 'q2',
    question: 'Solve: 2x + 5 = 17',
    answers: ['x = 6', 'x = 8', 'x = 10', 'x = 12'],
    correctAnswer: 'x = 6',
    subject: 'Mathematics',
    difficulty: 'medium',
    explanation: 'Subtract 5 from both sides: 2x = 12, then divide by 2: x = 6',
    tags: ['algebra', 'equations', 'solving'],
    status: 'active',
    createdBy: 'admin',
    createdAt: new Date('2024-01-20'),
    lastModified: new Date('2024-01-25')
  }
];

const sampleUsers: (User & { role: 'admin' | 'user', status: 'active' | 'suspended', lastActive: Date })[] = [
  {
    uid: 'user1',
    email: 'maria.santos@email.com',
    displayName: 'Maria Santos',
    photoURL: null,
    createdAt: new Date('2024-01-10'),
    lastLogin: new Date('2024-02-15'),
    studyStreak: 15,
    totalScore: 1250,
    totalQuizzesTaken: 25,
    achievements: [],
    preferences: {
      theme: 'system',
      difficulty: 'medium',
      studyTime: 60,
      subjects: ['Mathematics', 'General Information'],
      notifications: { daily: true, weekly: true, achievements: true }
    },
    role: 'user',
    status: 'active',
    lastActive: new Date('2024-02-15')
  },
  {
    uid: 'user2',
    email: 'john.delacruz@email.com',
    displayName: 'John Dela Cruz',
    photoURL: null,
    createdAt: new Date('2024-01-12'),
    lastLogin: new Date('2024-02-14'),
    studyStreak: 8,
    totalScore: 980,
    totalQuizzesTaken: 18,
    achievements: [],
    preferences: {
      theme: 'light',
      difficulty: 'hard',
      studyTime: 90,
      subjects: ['Philippine Constitution', 'Science'],
      notifications: { daily: false, weekly: true, achievements: true }
    },
    role: 'user',
    status: 'active',
    lastActive: new Date('2024-02-14')
  }
];

const sampleAnalytics = {
  totalUsers: 1247,
  activeUsers: 892,
  totalQuestions: 2456,
  totalQuizzes: 8932,
  averageScore: 78.5,
  newUsersThisWeek: 23,
  questionsAddedThisWeek: 12,
  quizzesThisWeek: 445
};

export function AdminPanel() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [questions, setQuestions] = useState(sampleQuestions);
  const [users, setUsers] = useState(sampleUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Question form states
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [questionFormData, setQuestionFormData] = useState({
    question: '',
    answers: ['', '', '', ''],
    correctAnswer: '',
    subject: 'General Information',
    difficulty: 'medium' as const,
    explanation: '',
    tags: ''
  });

  const subjects = [
    'Mathematics',
    'Vocabulary (English and Tagalog)',
    'Clerical Analysis',
    'Science',
    'General Information',
    'Philippine Constitution'
  ];

  // Filter questions based on search and filters
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || question.status === selectedStatus;
    const matchesSubject = selectedSubject === 'all' || question.subject === selectedSubject;
    return matchesSearch && matchesStatus && matchesSubject;
  });

  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetQuestionForm = () => {
    setQuestionFormData({
      question: '',
      answers: ['', '', '', ''],
      correctAnswer: '',
      subject: 'General Information',
      difficulty: 'medium',
      explanation: '',
      tags: ''
    });
    setEditingQuestion(null);
  };

  const handleSaveQuestion = () => {
    const questionData = {
      ...questionFormData,
      id: editingQuestion?.id || `q_${Date.now()}`,
      tags: questionFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      status: 'active' as const,
      createdBy: currentUser?.uid || 'admin',
      createdAt: editingQuestion?.createdAt || new Date(),
      lastModified: new Date()
    };

    if (editingQuestion) {
      setQuestions(prev => prev.map(q => q.id === editingQuestion.id ? questionData : q));
    } else {
      setQuestions(prev => [...prev, questionData]);
    }

    setShowQuestionDialog(false);
    resetQuestionForm();
  };

  const handleEditQuestion = (question: any) => {
    setEditingQuestion(question);
    setQuestionFormData({
      question: question.question,
      answers: question.answers,
      correctAnswer: question.correctAnswer,
      subject: question.subject,
      difficulty: question.difficulty,
      explanation: question.explanation || '',
      tags: question.tags?.join(', ') || ''
    });
    setShowQuestionDialog(true);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.uid === userId 
        ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' }
        : user
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'archived':
        return <Badge variant="outline">Archived</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'hard':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Check if current user is admin (in real app, this would be from auth context/database)
  const isAdmin = currentUser?.email?.includes('admin') || true; // For demo purposes

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <Shield className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to access the admin panel.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">
          Manage content, users, and system settings for the learning platform
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Questions
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{sampleAnalytics.totalUsers.toLocaleString()}</p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      +{sampleAnalytics.newUsersThisWeek} this week
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold">{sampleAnalytics.activeUsers.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round((sampleAnalytics.activeUsers / sampleAnalytics.totalUsers) * 100)}% of total
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Questions</p>
                    <p className="text-2xl font-bold">{sampleAnalytics.totalQuestions.toLocaleString()}</p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <Plus className="w-3 h-3" />
                      +{sampleAnalytics.questionsAddedThisWeek} this week
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg. Score</p>
                    <p className="text-2xl font-bold">{sampleAnalytics.averageScore}%</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {sampleAnalytics.quizzesThisWeek} quizzes this week
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <BarChart3 className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Plus className="w-4 h-4 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">New question added</p>
                      <p className="text-xs text-muted-foreground">Mathematics - Algebra</p>
                    </div>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Users className="w-4 h-4 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">5 new users registered</p>
                      <p className="text-xs text-muted-foreground">Today</p>
                    </div>
                    <span className="text-xs text-muted-foreground">4 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Question flagged for review</p>
                      <p className="text-xs text-muted-foreground">Philippine Constitution</p>
                    </div>
                    <span className="text-xs text-muted-foreground">6 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Database</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">AI Services</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium">Backup System</span>
                    </div>
                    <Badge variant="secondary">Running</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Questions Management */}
        <TabsContent value="questions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Question Bank</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
                    <DialogTrigger asChild>
                      <Button onClick={resetQuestionForm}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingQuestion ? 'Edit Question' : 'Add New Question'}
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Question</Label>
                          <Textarea
                            placeholder="Enter the question..."
                            value={questionFormData.question}
                            onChange={(e) => setQuestionFormData(prev => ({ ...prev, question: e.target.value }))}
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Subject</Label>
                            <Select
                              value={questionFormData.subject}
                              onValueChange={(value) => setQuestionFormData(prev => ({ ...prev, subject: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {subjects.map(subject => (
                                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label>Difficulty</Label>
                            <Select
                              value={questionFormData.difficulty}
                              onValueChange={(value: 'easy' | 'medium' | 'hard') => 
                                setQuestionFormData(prev => ({ ...prev, difficulty: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label>Answer Options</Label>
                          <div className="space-y-2 mt-2">
                            {questionFormData.answers.map((answer, index) => (
                              <div key={index} className="flex gap-2">
                                <span className="w-6 h-9 flex items-center justify-center text-sm font-medium">
                                  {String.fromCharCode(65 + index)}.
                                </span>
                                <Input
                                  placeholder={`Answer ${String.fromCharCode(65 + index)}`}
                                  value={answer}
                                  onChange={(e) => {
                                    const newAnswers = [...questionFormData.answers];
                                    newAnswers[index] = e.target.value;
                                    setQuestionFormData(prev => ({ ...prev, answers: newAnswers }));
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant={questionFormData.correctAnswer === answer ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setQuestionFormData(prev => ({ 
                                    ...prev, 
                                    correctAnswer: answer 
                                  }))}
                                >
                                  {questionFormData.correctAnswer === answer ? 'Correct' : 'Set as Correct'}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label>Explanation (Optional)</Label>
                          <Textarea
                            placeholder="Explain why the correct answer is right..."
                            value={questionFormData.explanation}
                            onChange={(e) => setQuestionFormData(prev => ({ ...prev, explanation: e.target.value }))}
                            rows={2}
                          />
                        </div>

                        <div>
                          <Label>Tags (Comma separated)</Label>
                          <Input
                            placeholder="e.g., algebra, equations, basic"
                            value={questionFormData.tags}
                            onChange={(e) => setQuestionFormData(prev => ({ ...prev, tags: e.target.value }))}
                          />
                        </div>

                        <div className="flex justify-between pt-4">
                          <Button variant="outline" onClick={() => setShowQuestionDialog(false)}>
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleSaveQuestion}
                            disabled={!questionFormData.question || !questionFormData.correctAnswer}
                          >
                            {editingQuestion ? 'Update' : 'Add'} Question
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search questions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Questions Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Modified</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuestions.map(question => (
                    <TableRow key={question.id}>
                      <TableCell className="max-w-md">
                        <p className="truncate font-medium">{question.question}</p>
                        {question.tags && (
                          <div className="flex gap-1 mt-1">
                            {question.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {question.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{question.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{question.subject}</TableCell>
                      <TableCell>
                        <span className={cn("font-medium", getDifficultyColor(question.difficulty))}>
                          {question.difficulty}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(question.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(question.lastModified, 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditQuestion(question)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Question</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this question? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteQuestion(question.id!)}
                                  className="bg-destructive text-destructive-foreground"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Management */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Users
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Quizzes</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow key={user.uid}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                            {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{user.displayName || 'Anonymous'}</p>
                            <p className="text-sm text-muted-foreground">
                              Streak: {user.studyStreak} days
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.totalQuizzesTaken}</TableCell>
                      <TableCell>{user.totalScore}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(user.lastActive, 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleUserStatus(user.uid)}
                          >
                            {user.status === 'active' ? (
                              <UserX className="w-4 h-4" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">User Registration</h4>
                        <p className="text-sm text-muted-foreground">Allow new users to register</p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">AI Question Generation</h4>
                        <p className="text-sm text-muted-foreground">Enable AI-powered question generation</p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">Send system notifications via email</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Backup & Maintenance</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Database Backup</h4>
                        <p className="text-sm text-muted-foreground">Last backup: 2 hours ago</p>
                      </div>
                      <Button variant="outline" size="sm">Backup Now</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">System Logs</h4>
                        <p className="text-sm text-muted-foreground">View and download system logs</p>
                      </div>
                      <Button variant="outline" size="sm">View Logs</Button>
                    </div>
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