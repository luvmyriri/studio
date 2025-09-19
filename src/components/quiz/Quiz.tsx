'use client';

import { useState } from 'react';
import type { Quiz as QuizType } from '@/lib/types';
import { QuestionCard } from './QuestionCard';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface QuizProps {
  quiz: QuizType;
  onFinish: (score: number, total: number) => void;
}

export function Quiz({ quiz, onFinish }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);

  const questions = quiz.quiz;
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const handleCorrectAnswer = () => {
    setScore(prevScore => prevScore + 1);
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      onFinish(score, totalQuestions);
    }
  };

  const progressValue = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8 animate-fade-in">
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </p>
          <p className="text-sm font-bold text-primary">Score: {score}</p>
        </div>
        <Progress value={progressValue} className="w-full" />
      </div>

      <QuestionCard
        key={currentQuestionIndex}
        question={currentQuestion}
        onCorrectAnswer={handleCorrectAnswer}
        onAnswered={() => setIsAnswered(true)}
      />

      <div className="flex justify-end mt-4">
        <Button onClick={handleNextQuestion} disabled={!isAnswered}>
          {currentQuestionIndex < totalQuestions - 1
            ? 'Next Question'
            : 'Finish Quiz'}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
