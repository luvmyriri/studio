'use client';

import { useState } from 'react';
import { EnhancedQuiz } from '@/components/quiz/EnhancedQuiz';
import { QuizResults } from '@/components/quiz/QuizResults';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, RotateCcw } from 'lucide-react';
import type { Quiz, QuestionAttempt } from '@/lib/types';

interface QuizAttemptResult {
  score: number;
  total: number;
  percentage: number;
  timeSpent: number;
  questions: QuestionAttempt[];
  flaggedQuestions: number[];
}

// Sample quiz data for demo
const sampleQuiz: Quiz = {
  quiz: [
    {
      id: 'q1',
      question: 'What is the capital of the Philippines?',
      answers: ['Manila', 'Cebu', 'Davao', 'Quezon City'],
      correctAnswer: 'Manila',
      subject: 'General Information',
      difficulty: 'easy',
      explanation: 'Manila is the national capital and second most populous city of the Philippines.',
      tags: ['geography', 'philippines', 'capital']
    },
    {
      id: 'q2',
      question: 'Solve: 2x + 5 = 17',
      answers: ['x = 6', 'x = 8', 'x = 10', 'x = 12'],
      correctAnswer: 'x = 6',
      subject: 'Mathematics',
      difficulty: 'medium',
      explanation: 'Subtract 5 from both sides: 2x = 12, then divide by 2: x = 6',
      tags: ['algebra', 'equations']
    },
    {
      id: 'q3',
      question: 'Which branch of government interprets the law?',
      answers: ['Executive', 'Legislative', 'Judicial', 'Administrative'],
      correctAnswer: 'Judicial',
      subject: 'Philippine Constitution',
      difficulty: 'medium',
      explanation: 'The judicial branch is responsible for interpreting laws and ensuring they comply with the Constitution.',
      tags: ['government', 'branches', 'constitution']
    },
    {
      id: 'q4',
      question: 'What is the synonym of "beautiful"?',
      answers: ['Ugly', 'Attractive', 'Plain', 'Simple'],
      correctAnswer: 'Attractive',
      subject: 'Vocabulary (English and Tagalog)',
      difficulty: 'easy',
      explanation: 'Attractive is a synonym for beautiful, meaning pleasing in appearance.',
      tags: ['synonyms', 'vocabulary', 'english']
    },
    {
      id: 'q5',
      question: 'Which of the following is a primary color?',
      answers: ['Green', 'Orange', 'Red', 'Purple'],
      correctAnswer: 'Red',
      subject: 'Science',
      difficulty: 'easy',
      explanation: 'Red is one of the three primary colors, along with blue and yellow.',
      tags: ['colors', 'science', 'basic']
    }
  ],
  title: 'Sample Practice Quiz',
  description: 'A comprehensive practice quiz covering multiple subjects'
};

export default function QuizPage() {
  const [currentQuiz] = useState<Quiz>(sampleQuiz);
  const [quizResult, setQuizResult] = useState<QuizAttemptResult | null>(null);
  const [showQuiz, setShowQuiz] = useState(true);

  const handleQuizFinish = (result: QuizAttemptResult) => {
    setQuizResult(result);
    setShowQuiz(false);
  };

  const resetQuiz = () => {
    setQuizResult(null);
    setShowQuiz(true);
  };

  if (!showQuiz && quizResult) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Quiz Complete!</CardTitle>
            <div className="flex justify-center gap-4 mt-4">
              <Badge className="text-lg px-4 py-2">
                Score: {quizResult.score}/{quizResult.total}
              </Badge>
              <Badge 
                variant={quizResult.percentage >= 70 ? "default" : "destructive"}
                className="text-lg px-4 py-2"
              >
                {quizResult.percentage}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{quizResult.score}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-red-600">{quizResult.total - quizResult.score}</div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{Math.round(quizResult.timeSpent / 1000)}s</div>
                <div className="text-sm text-muted-foreground">Time Spent</div>
              </div>
            </div>
            
            <div className="flex justify-center gap-4 pt-6">
              <Button onClick={resetQuiz} className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Practice Quiz</h1>
        <p className="text-muted-foreground mt-2">
          Test your knowledge with this comprehensive practice quiz
        </p>
      </div>
      
      <EnhancedQuiz 
        quiz={currentQuiz}
        onFinish={handleQuizFinish}
        mode="practice"
        showExplanations={true}
      />
    </div>
  );
}
