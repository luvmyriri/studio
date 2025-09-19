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

  // By combining the mode and topic into a key, we can force a re-render
  // when the user clicks a different topic from the sidebar.
  const componentKey = `${initialModeParam}-${initialTopic}`;

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
  };

  const handleSetMode = (newMode: 'ai' | 'mock') => {
    if (newMode === 'mock') {
      const mockQuiz: QuizType = mockQuizData as QuizType;
      setQuiz(mockQuiz);
      setMode('mock');
    } else {
      setMode(newMode);
    }
  };

  if (results) {
    return (
      <QuizResults
        key={componentKey}
        score={results.score}
        total={results.total}
        onRestart={handleRestart}
      />
    );
  }

  if (quiz) {
    return <Quiz key={componentKey} quiz={quiz} onFinish={handleQuizFinished} />;
  }

  if (mode === 'selector') {
    return <QuizModeSelector key={componentKey} setMode={handleSetMode} />;
  }

  if (mode === 'ai') {
    return (
      <QuizGenerator
        key={componentKey}
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
