'use client';

import { useState } from 'react';
import type { Quiz as QuizType } from '@/lib/types';
import { QuizGenerator } from './QuizGenerator';
import { Quiz } from './Quiz';
import { QuizResults } from './QuizResults';

export function QuizFlow() {
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [results, setResults] = useState<{ score: number; total: number } | null>(
    null
  );

  const handleQuizGenerated = (generatedQuiz: QuizType) => {
    setQuiz(generatedQuiz);
    setResults(null);
  };

  const handleQuizFinished = (score: number, total: number) => {
    setResults({ score, total });
    setQuiz(null); // Clear quiz to show results
  };

  const handleRestart = () => {
    setQuiz(null);
    setResults(null);
  };

  if (results) {
    return (
      <QuizResults
        score={results.score}
        total={results.total}
        onRestart={handleRestart}
      />
    );
  }

  if (quiz) {
    return <Quiz quiz={quiz} onFinish={handleQuizFinished} />;
  }

  return <QuizGenerator onQuizGenerated={handleQuizGenerated} />;
}
