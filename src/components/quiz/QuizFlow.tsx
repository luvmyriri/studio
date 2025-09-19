'use client';

import { useState, Suspense } from 'react';
import type { Quiz as QuizType } from '@/lib/types';
import { QuizGenerator } from './QuizGenerator';
import { Quiz } from './Quiz';
import { QuizResults } from './QuizResults';
import { QuizModeSelector } from './QuizModeSelector';
import { AIQuizGenerator } from './AIQuizGenerator';
import { useSearchParams } from 'next/navigation';
import { QuizService } from '@/lib/quiz-service';
import mockQuizData from '@/lib/mock-quiz.json';

function QuizFlowContent() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get('topic');
  const initialModeParam = searchParams.get('mode');
  const aiGenerated = searchParams.get('aiGenerated');
  const numQuestions = searchParams.get('numQuestions');
  const difficulty = searchParams.get('difficulty');
  const userContext = searchParams.get('userContext');

  // By combining the mode and topic into a key, we can force a re-render
  // when the user clicks a different topic from the sidebar.
  const componentKey = `${initialModeParam}-${initialTopic}-${aiGenerated}`;

  const getInitialMode = () => {
    if (initialModeParam === 'mock') return 'mock';
    if (initialModeParam === 'ai' || initialTopic || aiGenerated === 'true') return 'ai';
    return 'selector';
  };

  const [quiz, setQuiz] = useState<QuizType | null>(
    getInitialMode() === 'mock' ? (mockQuizData as QuizType) : null
  );
  const [results, setResults] = useState<{ score: number; total: number } | null>(null);
  const [mode, setMode] = useState<'selector' | 'ai' | 'ai-personalized' | 'mock'>(getInitialMode());
  const [aiMode, setAIMode] = useState<'generator' | 'personalized'>('generator');
  

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
      setAIMode('generator'); // Default to generator mode
    }
  };

  const handleAIModeSwitch = (newAIMode: 'generator' | 'personalized') => {
    setAIMode(newAIMode);
    if (newAIMode === 'personalized') {
      setMode('ai-personalized');
    } else {
      setMode('ai');
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
      <div className="space-y-6">
        {/* AI Mode Selector */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleAIModeSwitch('generator')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              aiMode === 'generator'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Custom Quiz Generator
          </button>
          <button
            onClick={() => handleAIModeSwitch('personalized')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              aiMode === 'personalized'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            AI-Personalized Suggestions
          </button>
        </div>
        
        {aiMode === 'generator' ? (
          <QuizGenerator
            key={componentKey}
            onQuizGenerated={handleQuizGenerated}
            initialTopic={initialTopic || undefined}
            aiGenerated={aiGenerated === 'true'}
            initialNumQuestions={numQuestions ? parseInt(numQuestions) : undefined}
            initialDifficulty={difficulty as 'easy' | 'medium' | 'hard' | undefined}
            userContext={userContext ? JSON.parse(userContext) : undefined}
          />
        ) : (
          <AIQuizGenerator
            key={componentKey}
            onQuizGenerated={handleQuizGenerated}
          />
        )}
      </div>
    );
  }
  
  if (mode === 'ai-personalized') {
    return (
      <AIQuizGenerator
        key={componentKey}
        onQuizGenerated={handleQuizGenerated}
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
