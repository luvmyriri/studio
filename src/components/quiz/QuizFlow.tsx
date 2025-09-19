'use client';

import { useState, Suspense } from 'react';
import type { Quiz as QuizType } from '@/lib/types';
import { QuizGenerator } from './QuizGenerator';
import { Quiz } from './Quiz';
import { QuizResults } from './QuizResults';
import { QuizModeSelector } from './QuizModeSelector';
import { useSearchParams } from 'next/navigation';
import mockQuizData from '@/lib/mock-quiz.json';

function QuizFlowContent() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get('topic');
  const initialModeParam = searchParams.get('mode');

  const getInitialMode = () => {
    if (initialModeParam === 'mock') return 'mock';
    if (initialModeParam === 'ai' || initialTopic) return 'ai';
    return 'selector';
  };

  const [quiz, setQuiz] = useState<QuizType | null>(
    getInitialMode() === 'mock' ? (mockQuizData as QuizType) : null
  );
  const [results, setResults] = useState<{ score: number; total: number } | null>(null);
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
    // Use Next.js router to navigate without a full page reload
    window.history.pushState(null, '', '/quiz');
    setKey(Date.now());
  };

  const handleSetMode = (newMode: 'ai' | 'mock') => {
    if (newMode === 'mock') {
      const mockQuiz: QuizType = mockQuizData as QuizType;
      setQuiz(mockQuiz);
      setMode('mock');
    } else {
      setMode(newMode);
    }
    setKey(Date.now());
  };

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
    return <QuizModeSelector key={key} setMode={handleSetMode} />;
  }

  if (mode === 'ai') {
    return (
      <QuizGenerator
        key={key}
        onQuizGenerated={handleQuizGenerated}
        initialTopic={initialTopic || undefined}
      />
    );
  }

  return null; // Should not be reached
}


export function QuizFlow() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizFlowContent />
    </Suspense>
  )
}
