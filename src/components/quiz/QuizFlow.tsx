'use client';

import { useState } from 'react';
import type { Quiz as QuizType } from '@/lib/types';
import { QuizGenerator } from './QuizGenerator';
import { Quiz } from './Quiz';
import { QuizResults } from './QuizResults';
import { QuizModeSelector } from './QuizModeSelector';
import { useSearchParams } from 'next/navigation';

export function QuizFlow() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get('topic');
  
  const getInitialMode = () => {
    if (initialTopic) return 'ai';
    return 'selector';
  }

  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [results, setResults] = useState<{ score: number; total: number } | null>(
    null
  );
  const [mode, setMode] = useState<'selector' | 'ai' | 'mock'>(getInitialMode());
  const [key, setKey] = useState(Date.now());


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
    window.history.pushState(null, '', '/');
    setKey(Date.now());
  };
  
  const handleSetMode = (newMode: 'ai' | 'mock') => {
    setMode(newMode);
    setKey(Date.now());
  }


  if (results) {
    return (
      <QuizResults
        key={key}
        score={results.score}
        total={results.total}
        onRestart={handleRestart}
      />
    );
  }

  if (quiz) {
    return <Quiz key={key} quiz={quiz} onFinish={handleQuizFinished} />;
  }

  if (mode === 'selector') {
    return <QuizModeSelector key={key} setMode={handleSetMode} onQuizGenerated={handleQuizGenerated} />;
  }

  if (mode === 'ai') {
    return <QuizGenerator key={key} onQuizGenerated={handleQuizGenerated} initialTopic={initialTopic || undefined}/>;
  }
  
  // This will handle the mock quiz mode
  if (mode === 'mock') {
     return <QuizModeSelector key={key} setMode={handleSetMode} onQuizGenerated={handleQuizGenerated} />;
  }


  return <QuizGenerator key={key} onQuizGenerated={handleQuizGenerated} />;
}
