'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
} from '@/components/ui/alert-dialog';
import {
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle,
  Award,
  BarChart3,
  Target,
  Brain,
  Timer,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Download,
  Share2,
  Bookmark,
  Flag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EnhancedQuiz } from '@/components/quiz/EnhancedQuiz';
import type { MockExam, Quiz, QuestionAttempt } from '@/lib/types';

// Sample mock exams data
const mockExams: MockExam[] = [
  {
    id: 'cse-professional',
    title: 'Civil Service Exam - Professional Level',
    description: 'Complete 170-item examination covering all subjects for professional positions',
    subjects: [
      { name: 'Mathematics', questionCount: 30, timeAllocation: 40 },
      { name: 'Vocabulary (English and Tagalog)', questionCount: 30, timeAllocation: 35 },
      { name: 'Philippine Constitution', questionCount: 25, timeAllocation: 30 },
      { name: 'General Information', questionCount: 35, timeAllocation: 45 },
      { name: 'Clerical Analysis', questionCount: 25, timeAllocation: 30 },
      { name: 'Science', questionCount: 25, timeAllocation: 30 },
    ],
    timeLimit: 210, // 3.5 hours in minutes
    totalQuestions: 170,
    passingScore: 80,
    instructions: 'This is a comprehensive examination similar to the actual Civil Service Exam. You have 3.5 hours to complete all 170 questions. Choose the best answer for each question.',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'cse-subprofessional',
    title: 'Civil Service Exam - Sub-Professional Level',
    description: '100-item examination for sub-professional government positions',
    subjects: [
      { name: 'Mathematics', questionCount: 20, timeAllocation: 25 },
      { name: 'Vocabulary (English and Tagalog)', questionCount: 20, timeAllocation: 20 },
      { name: 'Philippine Constitution', questionCount: 15, timeAllocation: 20 },
      { name: 'General Information', questionCount: 25, timeAllocation: 30 },
      { name: 'Clerical Analysis', questionCount: 20, timeAllocation: 25 },
    ],
    timeLimit: 120, // 2 hours
    totalQuestions: 100,
    passingScore: 70,
    instructions: 'This examination is designed for sub-professional level positions. Complete all 100 questions within 2 hours.',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'practice-test-math',
    title: 'Mathematics Practice Test',
    description: '50-item focused practice test for mathematics',
    subjects: [
      { name: 'Mathematics', questionCount: 50, timeAllocation: 60 },
    ],
    timeLimit: 60,
    totalQuestions: 50,
    passingScore: 75,
    instructions: 'Focused mathematics practice covering arithmetic, algebra, geometry, and problem solving.',
    isActive: true,
    createdAt: new Date('2024-01-01')
  }
];

interface ExamResults {
  examId: string;
  examTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  timeSpent: number;
  timeLimit: number;
  subjectBreakdown: {
    subject: string;
    correct: number;
    total: number;
    percentage: number;
    timeSpent: number;
  }[];
  questionsAnalysis: QuestionAttempt[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  passingGrade: boolean;
  completedAt: Date;
}

interface MockExamSimulatorProps {
  examId?: string;
}

export function MockExamSimulator({ examId }: MockExamSimulatorProps) {
  const { currentUser } = useAuth();
  const [selectedExam, setSelectedExam] = useState<MockExam | null>(
    examId ? mockExams.find(e => e.id === examId) || null : null
  );
  const [examState, setExamState] = useState<'selection' | 'instructions' | 'in-progress' | 'results'>('selection');
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [examResults, setExamResults] = useState<ExamResults | null>(null);
  const [showConfirmStart, setShowConfirmStart] = useState(false);
  const [showConfirmExit, setShowConfirmExit] = useState(false);

  const generateMockQuiz = (exam: MockExam): Quiz => {
    // In a real implementation, this would fetch from the database
    // For now, we'll generate sample questions
    const questions = [];
    let questionId = 1;

    for (const subject of exam.subjects) {
      for (let i = 0; i < subject.questionCount; i++) {
        questions.push({
          id: `q_${questionId++}`,
          question: `Sample ${subject.name} question ${i + 1}. Choose the correct answer from the options below.`,
          answers: [
            'Option A - First possible answer',
            'Option B - Second possible answer', 
            'Option C - Third possible answer',
            'Option D - Fourth possible answer'
          ],
          correctAnswer: ['Option A - First possible answer', 'Option B - Second possible answer', 'Option C - Third possible answer', 'Option D - Fourth possible answer'][Math.floor(Math.random() * 4)],
          subject: subject.name,
          difficulty: 'medium' as const,
          explanation: `This is the explanation for why the correct answer is right. It provides context and reasoning to help you understand the concept.`,
          timeLimit: Math.floor((subject.timeAllocation * 60) / subject.questionCount)
        });
      }
    }

    return {
      id: `mock_${exam.id}_${Date.now()}`,
      quiz: questions,
      title: exam.title,
      description: exam.description,
      timeLimit: exam.timeLimit,
      totalQuestions: exam.totalQuestions,
      passingScore: exam.passingScore
    };
  };

  const startExam = () => {
    if (!selectedExam) return;
    
    const quiz = generateMockQuiz(selectedExam);
    setCurrentQuiz(quiz);
    setExamState('in-progress');
    setShowConfirmStart(false);
  };

  const handleExamComplete = (attempt: any) => {
    if (!selectedExam || !currentQuiz) return;

    // Analyze results by subject
    const subjectBreakdown = selectedExam.subjects.map(subject => {
      const subjectQuestions = attempt.questions.filter((q: QuestionAttempt) => 
        currentQuiz.quiz.find(quiz_q => quiz_q.id === q.questionId)?.subject === subject.name
      );
      const correct = subjectQuestions.filter((q: QuestionAttempt) => q.isCorrect).length;
      const timeSpent = subjectQuestions.reduce((sum: number, q: QuestionAttempt) => sum + q.timeSpent, 0);

      return {
        subject: subject.name,
        correct,
        total: subjectQuestions.length,
        percentage: subjectQuestions.length > 0 ? Math.round((correct / subjectQuestions.length) * 100) : 0,
        timeSpent: Math.round(timeSpent / 1000 / 60) // Convert to minutes
      };
    });

    // Identify strengths and weaknesses
    const strengths = subjectBreakdown.filter(s => s.percentage >= 80).map(s => s.subject);
    const weaknesses = subjectBreakdown.filter(s => s.percentage < 70).map(s => s.subject);
    
    // Generate recommendations
    const recommendations = [];
    if (weaknesses.length > 0) {
      recommendations.push(`Focus on improving ${weaknesses.join(', ')} with additional study time.`);
    }
    if (attempt.timeSpent > selectedExam.timeLimit * 60 * 1000 * 0.9) {
      recommendations.push('Practice time management by taking more timed quizzes.');
    }
    if (attempt.percentage < selectedExam.passingScore) {
      recommendations.push('Review fundamental concepts and take practice tests regularly.');
    }

    const results: ExamResults = {
      examId: selectedExam.id,
      examTitle: selectedExam.title,
      totalQuestions: attempt.total,
      correctAnswers: attempt.score,
      percentage: attempt.percentage,
      timeSpent: Math.round(attempt.timeSpent / 1000 / 60), // Convert to minutes
      timeLimit: selectedExam.timeLimit,
      subjectBreakdown,
      questionsAnalysis: attempt.questions,
      strengths,
      weaknesses,
      recommendations,
      passingGrade: attempt.percentage >= selectedExam.passingScore,
      completedAt: new Date()
    };

    setExamResults(results);
    setExamState('results');
  };

  const resetExam = () => {
    setSelectedExam(null);
    setCurrentQuiz(null);
    setExamResults(null);
    setExamState('selection');
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Exam Selection Screen
  if (examState === 'selection') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mock Exam Center</h1>
          <p className="text-muted-foreground">
            Practice with realistic exam simulations to boost your confidence and performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockExams.map(exam => (
            <Card key={exam.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{exam.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      {exam.description}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {exam.totalQuestions} items
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(exam.timeLimit)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="w-4 h-4" />
                    <span>Passing: {exam.passingScore}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span>{exam.subjects.length} subjects</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Subject Distribution:</h4>
                  <div className="space-y-1">
                    {exam.subjects.map(subject => (
                      <div key={subject.name} className="flex justify-between text-xs">
                        <span>{subject.name}</span>
                        <span>{subject.questionCount} items</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto">
                  <Button 
                    className="w-full"
                    onClick={() => {
                      setSelectedExam(exam);
                      setExamState('instructions');
                    }}
                  >
                    Start Exam
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Instructions Screen
  if (examState === 'instructions' && selectedExam) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6" />
              {selectedExam.title} - Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This is a timed examination. Once you start, the timer will begin and cannot be paused. 
                Make sure you have sufficient time and a stable internet connection.
              </AlertDescription>
            </Alert>

            <div className="prose max-w-none">
              <h3>Examination Details</h3>
              <ul>
                <li><strong>Total Questions:</strong> {selectedExam.totalQuestions}</li>
                <li><strong>Time Limit:</strong> {formatTime(selectedExam.timeLimit)}</li>
                <li><strong>Passing Score:</strong> {selectedExam.passingScore}%</li>
                <li><strong>Question Types:</strong> Multiple Choice</li>
              </ul>

              <h3>Subject Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left">Subject</th>
                      <th className="border border-gray-300 p-2 text-center">Questions</th>
                      <th className="border border-gray-300 p-2 text-center">Time Allocation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedExam.subjects.map(subject => (
                      <tr key={subject.name}>
                        <td className="border border-gray-300 p-2">{subject.name}</td>
                        <td className="border border-gray-300 p-2 text-center">{subject.questionCount}</td>
                        <td className="border border-gray-300 p-2 text-center">{subject.timeAllocation} min</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3>Instructions</h3>
              <p>{selectedExam.instructions}</p>
              
              <h3>Important Reminders</h3>
              <ul>
                <li>Read each question carefully before selecting your answer</li>
                <li>You can flag questions for review and return to them later</li>
                <li>Manage your time wisely - you have approximately {Math.round(selectedExam.timeLimit / selectedExam.totalQuestions * 100) / 100} minutes per question</li>
                <li>All questions must be answered to submit the exam</li>
                <li>Once submitted, you cannot change your answers</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => setExamState('selection')}
              >
                Back to Selection
              </Button>
              
              <AlertDialog open={showConfirmStart} onOpenChange={setShowConfirmStart}>
                <Button 
                  className="flex-1"
                  onClick={() => setShowConfirmStart(true)}
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Start Examination
                </Button>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Start Examination</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you ready to begin? The timer will start immediately and cannot be paused. 
                      Make sure you have {formatTime(selectedExam.timeLimit)} available to complete the exam.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={startExam}>
                      Yes, Start Exam
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Exam in Progress
  if (examState === 'in-progress' && currentQuiz) {
    return (
      <div>
        <AlertDialog open={showConfirmExit} onOpenChange={setShowConfirmExit}>
          <div className="mb-4">
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmExit(true)}
            >
              Exit Exam
            </Button>
          </div>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Exit Examination</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to exit? Your progress will be lost and you'll need to start over.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Continue Exam</AlertDialogCancel>
              <AlertDialogAction onClick={resetExam}>
                Yes, Exit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <EnhancedQuiz
          quiz={currentQuiz}
          onFinish={handleExamComplete}
          mode="timed"
          timeLimit={selectedExam?.timeLimit}
          showExplanations={false}
        />
      </div>
    );
  }

  // Results Screen
  if (examState === 'results' && examResults) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  {examResults.passingGrade ? (
                    <Award className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  )}
                  Exam Results: {examResults.examTitle}
                </CardTitle>
                <p className="text-muted-foreground">
                  Completed on {examResults.completedAt.toLocaleDateString()}
                </p>
              </div>
              
              <div className="text-right">
                <div className={cn(
                  "text-4xl font-bold",
                  examResults.passingGrade ? "text-green-600" : "text-red-600"
                )}>
                  {examResults.percentage}%
                </div>
                <p className="text-sm text-muted-foreground">
                  {examResults.correctAnswers}/{examResults.totalQuestions} correct
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <Badge 
                variant={examResults.passingGrade ? "default" : "destructive"}
                className="text-sm"
              >
                {examResults.passingGrade ? "PASSED" : "NEEDS IMPROVEMENT"}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Subject</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {examResults.subjectBreakdown.map(subject => (
                    <div key={subject.subject} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{subject.subject}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            {subject.correct}/{subject.total}
                          </span>
                          <Badge 
                            variant={subject.percentage >= 80 ? "default" : subject.percentage >= 70 ? "secondary" : "destructive"}
                          >
                            {subject.percentage}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={subject.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Time Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {examResults.timeSpent}m
                    </div>
                    <p className="text-sm text-blue-800">Time Used</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">
                      {examResults.timeLimit}m
                    </div>
                    <p className="text-sm text-gray-800">Time Allowed</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Time Utilization</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round((examResults.timeSpent / examResults.timeLimit) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(examResults.timeSpent / examResults.timeLimit) * 100} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations & Actions */}
          <div className="space-y-6">
            {examResults.strengths.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {examResults.strengths.map(strength => (
                      <li key={strength} className="text-sm">
                        • {strength}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {examResults.weaknesses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {examResults.weaknesses.map(weakness => (
                      <li key={weakness} className="text-sm">
                        • {weakness}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {examResults.recommendations.map((rec, index) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button className="w-full" onClick={resetExam}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Take Another Exam
              </Button>
              
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              
              <Button variant="outline" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share Results
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}