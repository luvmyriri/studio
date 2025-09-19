'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { Quiz as QuizType, Question, QuestionAttempt } from '@/lib/types';
import { EnhancedQuestionCard } from './EnhancedQuestionCard';
import { QuizTimer } from './QuizTimer';
import { QuizNavigation } from './QuizNavigation';
import { QuizResults } from './QuizResults';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Clock, 
  Flag, 
  CheckCircle, 
  Circle, 
  RotateCcw, 
  Eye,
  PlayCircle,
  PauseCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { saveQuizAttempt } from '@/lib/user-data';

interface EnhancedQuizProps {
  quiz: QuizType;
  onFinish: (attempt: QuizAttemptResult) => void;
  mode?: 'practice' | 'timed' | 'review';
  timeLimit?: number; // in minutes
  showExplanations?: boolean;
}

interface QuizAttemptResult {
  score: number;
  total: number;
  percentage: number;
  timeSpent: number;
  questions: QuestionAttempt[];
  flaggedQuestions: number[];
}

export function EnhancedQuiz({ 
  quiz, 
  onFinish, 
  mode = 'practice',
  timeLimit,
  showExplanations = true
}: EnhancedQuizProps) {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [startTime] = useState(Date.now());
  const [timeRemaining, setTimeRemaining] = useState(timeLimit ? timeLimit * 60 : null);
  const [isPaused, setIsPaused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [questionTimes, setQuestionTimes] = useState<{ [key: number]: number }>({});
  const [isReviewMode, setIsReviewMode] = useState(false);

  const questions = quiz.quiz;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const progressValue = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Timer effect
  useEffect(() => {
    if (mode === 'timed' && timeRemaining && timeRemaining > 0 && !isPaused && !showResults) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && mode === 'timed') {
      handleFinishQuiz();
    }
  }, [timeRemaining, isPaused, showResults, mode]);

  // Track question time
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  const handleAnswerSelect = useCallback((answer: string) => {
    const timeSpent = Date.now() - questionStartTime;
    
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
    setQuestionTimes(prev => ({ ...prev, [currentQuestionIndex]: timeSpent }));
    
    // Auto-advance in practice mode after selection
    if (mode === 'practice' && !isReviewMode) {
      setTimeout(() => {
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        }
      }, 1000);
    }
  }, [currentQuestionIndex, questionStartTime, mode, isReviewMode, totalQuestions]);

  const toggleFlag = useCallback((questionIndex: number) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex);
      } else {
        newSet.add(questionIndex);
      }
      return newSet;
    });
  }, []);

  const navigateToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < totalQuestions) {
      // Record time for current question
      const timeSpent = Date.now() - questionStartTime;
      setQuestionTimes(prev => ({ ...prev, [currentQuestionIndex]: timeSpent }));
      
      setCurrentQuestionIndex(index);
    }
  }, [currentQuestionIndex, questionStartTime, totalQuestions]);

  const handleFinishQuiz = useCallback(async () => {
    const totalTimeSpent = Date.now() - startTime;
    const questionAttempts: QuestionAttempt[] = questions.map((question, index) => {
      const selectedAnswer = answers[index] || '';
      const isCorrect = selectedAnswer === question.correctAnswer;
      
      return {
        questionId: question.id || `q_${index}`,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        timeSpent: questionTimes[index] || 0,
        flagged: flaggedQuestions.has(index),
      };
    });

    const score = questionAttempts.filter(q => q.isCorrect).length;
    const percentage = Math.round((score / totalQuestions) * 100);

    const result: QuizAttemptResult = {
      score,
      total: totalQuestions,
      percentage,
      timeSpent: totalTimeSpent,
      questions: questionAttempts,
      flaggedQuestions: Array.from(flaggedQuestions),
    };

    // Save quiz attempt to Firebase
    if (currentUser) {
      try {
        await saveQuizAttempt(currentUser.uid, {
          quizId: quiz.id || `quiz_${Date.now()}`,
          quizTitle: quiz.title || 'Practice Quiz',
          subject: questions[0]?.subject || 'General',
          questions: questionAttempts.map(q => ({
            questionId: q.questionId,
            selectedAnswer: q.selectedAnswer,
            correctAnswer: q.correctAnswer,
            isCorrect: q.isCorrect,
            timeSpent: q.timeSpent,
          })),
          score,
          totalQuestions,
          percentage,
          timeSpent: totalTimeSpent,
          completedAt: new Date(),
        });
        
        toast({
          title: "Quiz Completed!",
          description: `Your score has been saved. You got ${score}/${totalQuestions} correct (${percentage}%)`,
        });
      } catch (error) {
        console.error('Error saving quiz attempt:', error);
        toast({
          title: "Quiz Completed",
          description: `You got ${score}/${totalQuestions} correct (${percentage}%), but there was an issue saving your progress.`,
          variant: "destructive",
        });
      }
    }

    setShowResults(true);
    onFinish(result);
  }, [
    startTime, 
    questions, 
    answers, 
    questionTimes, 
    flaggedQuestions, 
    totalQuestions, 
    currentUser, 
    quiz,
    onFinish,
    toast
  ]);

  const getQuestionStatus = useCallback((index: number) => {
    if (answers[index]) return 'answered';
    if (flaggedQuestions.has(index)) return 'flagged';
    return 'unanswered';
  }, [answers, flaggedQuestions]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const toggleReviewMode = () => {
    setIsReviewMode(!isReviewMode);
  };

  if (showResults) {
    // Results will be handled by parent component
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Quiz Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">
                {quiz.title || 'Practice Quiz'}
              </CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="secondary">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </Badge>
                {mode === 'timed' && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Time Limited
                  </Badge>
                )}
                {flaggedQuestions.size > 0 && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Flag className="w-3 h-3" />
                    {flaggedQuestions.size} Flagged
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {mode === 'timed' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={togglePause}
                    className="flex items-center gap-1"
                  >
                    {isPaused ? (
                      <PlayCircle className="w-4 h-4" />
                    ) : (
                      <PauseCircle className="w-4 h-4" />
                    )}
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                  {timeRemaining && (
                    <QuizTimer 
                      timeRemaining={timeRemaining}
                      isPaused={isPaused}
                      onTimeUp={handleFinishQuiz}
                    />
                  )}
                </>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleReviewMode}
                className={cn(
                  "flex items-center gap-1",
                  isReviewMode && "bg-primary text-primary-foreground"
                )}
              >
                <Eye className="w-4 h-4" />
                {isReviewMode ? 'Exit Review' : 'Review Mode'}
              </Button>
            </div>
          </div>
          
          <Progress value={progressValue} className="mt-4" />
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Navigation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <QuizNavigation
              totalQuestions={totalQuestions}
              currentQuestion={currentQuestionIndex}
              onNavigate={navigateToQuestion}
              getQuestionStatus={getQuestionStatus}
            />
          </CardContent>
        </Card>

        {/* Main Question Area */}
        <div className="lg:col-span-3">
          <EnhancedQuestionCard
            question={currentQuestion}
            questionIndex={currentQuestionIndex}
            selectedAnswer={answers[currentQuestionIndex]}
            isFlagged={flaggedQuestions.has(currentQuestionIndex)}
            onAnswerSelect={handleAnswerSelect}
            onToggleFlag={() => toggleFlag(currentQuestionIndex)}
            showExplanation={isReviewMode && showExplanations}
            isReviewMode={isReviewMode}
            isPaused={isPaused}
          />

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              onClick={() => navigateToQuestion(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0 || isPaused}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => toggleFlag(currentQuestionIndex)}
                className={cn(
                  "flex items-center gap-1",
                  flaggedQuestions.has(currentQuestionIndex) && "bg-yellow-100 text-yellow-800 border-yellow-300"
                )}
              >
                <Flag className="w-4 h-4" />
                {flaggedQuestions.has(currentQuestionIndex) ? 'Unflag' : 'Flag'}
              </Button>

              {currentQuestionIndex === totalQuestions - 1 ? (
                <Button
                  onClick={handleFinishQuiz}
                  disabled={isPaused}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Finish Quiz
                </Button>
              ) : (
                <Button
                  onClick={() => navigateToQuestion(currentQuestionIndex + 1)}
                  disabled={isPaused}
                >
                  Next
                </Button>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          {isReviewMode && (
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {Object.values(answers).filter((answer, index) => 
                        answer === questions[index]?.correctAnswer
                      ).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Correct</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">
                      {Object.keys(answers).length - Object.values(answers).filter((answer, index) => 
                        answer === questions[index]?.correctAnswer
                      ).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Incorrect</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {flaggedQuestions.size}
                    </div>
                    <div className="text-sm text-muted-foreground">Flagged</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}