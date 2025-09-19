'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Flag, Clock, Lightbulb } from 'lucide-react';
import type { Question } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface EnhancedQuestionCardProps {
  question: Question;
  questionIndex: number;
  selectedAnswer?: string;
  isFlagged?: boolean;
  onAnswerSelect: (answer: string) => void;
  onToggleFlag: () => void;
  showExplanation?: boolean;
  isReviewMode?: boolean;
  isPaused?: boolean;
}

export function EnhancedQuestionCard({
  question,
  questionIndex,
  selectedAnswer,
  isFlagged = false,
  onAnswerSelect,
  onToggleFlag,
  showExplanation = false,
  isReviewMode = false,
  isPaused = false,
}: EnhancedQuestionCardProps) {
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [questionStartTime] = useState(Date.now());

  useEffect(() => {
    setShuffledAnswers([...question.answers].sort(() => Math.random() - 0.5));
  }, [question]);

  const handleAnswerClick = (answer: string) => {
    if (isPaused) return;
    onAnswerSelect(answer);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getAnswerButtonStyle = (answer: string) => {
    const isSelected = answer === selectedAnswer;
    const isCorrect = answer === question.correctAnswer;
    const isIncorrect = isSelected && !isCorrect;

    if (isReviewMode || showExplanation) {
      if (isCorrect) {
        return 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200';
      }
      if (isIncorrect) {
        return 'bg-red-100 border-red-300 text-red-800 hover:bg-red-200';
      }
      if (selectedAnswer && !isSelected && !isCorrect) {
        return 'opacity-60 bg-gray-50 text-gray-500';
      }
    } else if (isSelected) {
      return 'bg-primary border-primary text-primary-foreground';
    }

    return 'hover:bg-accent/20 border-border';
  };

  if (!shuffledAnswers.length) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary">
                Question {questionIndex + 1}
              </Badge>
              {question.difficulty && (
                <Badge 
                  variant="outline" 
                  className={getDifficultyColor(question.difficulty)}
                >
                  {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                </Badge>
              )}
              {question.subject && (
                <Badge variant="outline">
                  {question.subject}
                </Badge>
              )}
              {question.timeLimit && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {question.timeLimit}s
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl md:text-2xl">
              {question.question}
            </CardTitle>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleFlag}
            className={cn(
              "ml-4 shrink-0",
              isFlagged && "text-yellow-600 hover:text-yellow-700"
            )}
          >
            <Flag className={cn("w-4 h-4", isFlagged && "fill-current")} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shuffledAnswers.map((answer, index) => {
            const isSelected = answer === selectedAnswer;
            const isCorrect = answer === question.correctAnswer;
            const isIncorrect = isSelected && !isCorrect;

            return (
              <Button
                key={index}
                onClick={() => handleAnswerClick(answer)}
                disabled={isPaused || (selectedAnswer && !isReviewMode)}
                className={cn(
                  'justify-start text-left h-auto py-4 px-4 whitespace-normal transition-all duration-300 relative',
                  getAnswerButtonStyle(answer)
                )}
                variant="outline"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="flex-1 text-sm md:text-base">
                    <span className="font-medium mr-2">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {answer}
                  </span>
                  
                  {(isReviewMode || showExplanation) && (
                    <div className="ml-2 shrink-0">
                      {isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                      {isIncorrect && (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  )}
                </div>
              </Button>
            );
          })}
        </div>

        {/* Question Tags */}
        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {question.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Explanation */}
        {showExplanation && question.explanation && selectedAnswer && (
          <Alert className="mt-6">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Explanation:</strong> {question.explanation}
            </AlertDescription>
          </Alert>
        )}

        {/* Performance Feedback */}
        {isReviewMode && selectedAnswer && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className={cn(
                  "font-medium",
                  selectedAnswer === question.correctAnswer ? "text-green-600" : "text-red-600"
                )}>
                  {selectedAnswer === question.correctAnswer ? "Correct!" : "Incorrect"}
                </span>
                {selectedAnswer !== question.correctAnswer && (
                  <span className="text-muted-foreground">
                    Correct answer: <strong>{question.correctAnswer}</strong>
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span className="text-xs">
                  {Math.round((Date.now() - questionStartTime) / 1000)}s
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Pause Overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
            <div className="bg-background p-4 rounded-lg shadow-lg">
              <p className="text-center font-medium">Quiz Paused</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}