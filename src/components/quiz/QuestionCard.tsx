'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { Question } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

interface QuestionCardProps {
  question: Question;
  onCorrectAnswer: () => void;
  onAnswered: () => void;
}

export function QuestionCard({
  question,
  onCorrectAnswer,
  onAnswered,
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);

  useEffect(() => {
    setShuffledAnswers([...question.answers].sort(() => Math.random() - 0.5));
  }, [question]);

  const handleAnswerClick = (answer: string) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);
    onAnswered();

    if (answer === question.correctAnswer) {
      onCorrectAnswer();
    }
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
        <CardTitle className="text-xl md:text-2xl">{question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shuffledAnswers.map((answer, index) => {
            const isCorrect = answer === question.correctAnswer;
            const isSelected = answer === selectedAnswer;

            return (
              <Button
                key={index}
                onClick={() => handleAnswerClick(answer)}
                disabled={isAnswered}
                className={cn(
                  'justify-start text-left h-auto py-3 px-4 whitespace-normal transition-all duration-300',
                  {
                    'hover:bg-accent/20': !isAnswered,
                    'bg-primary border-primary text-primary-foreground animate-pulse':
                      isAnswered && isCorrect,
                    'bg-destructive border-destructive text-destructive-foreground':
                      isAnswered && isSelected && !isCorrect,
                    'opacity-60': isAnswered && !isSelected && !isCorrect,
                  }
                )}
                variant="outline"
              >
                <div className="flex items-center justify-between w-full">
                  <span>{answer}</span>
                  {isAnswered && (
                    <>
                      {isCorrect && (
                        <CheckCircle2 className="w-5 h-5 ml-2 shrink-0" />
                      )}
                      {isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 ml-2 shrink-0" />
                      )}
                    </>
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
