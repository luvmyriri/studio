'use client';

import { useState } from 'react';
import type { Quiz as QuizType } from '@/lib/types';
import { QuizGenerator } from './QuizGenerator';
import { Quiz } from './Quiz';
import { QuizResults } from './QuizResults';
import { QuizModeSelector } from './QuizModeSelector';

export function QuizFlow() {
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [results, setResults] = useState<{ score: number; total: number } | null>(
    null
  );
  const [mode, setMode] = useState<'selector' | 'ai' | 'mock'>('selector');

  const handleQuizGenerated = (generatedQuiz: QuizType) => {
    setQuiz(generatedQuiz);
    setResults(null);
  };

  const handleQuizFinished = (score: number, total: number) => {
    setResults({ score, total });
    setQuiz(null);
  };

  const handleRestart = () => {
    setQuiz(null);
    setResults(null);
    setMode('selector');
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

  if (mode === 'selector') {
    return <QuizModeSelector setMode={setMode} onQuizGenerated={handleQuizGenerated} />;
  }

  if (mode === 'ai') {
    return <QuizGenerator onQuizGenerated={handleQuizGenerated} />;
  }

  return <QuizGenerator onQuizGenerated={handleQuizGenerated} />;
}
