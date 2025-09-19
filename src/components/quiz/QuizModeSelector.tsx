'use client';

import { BrainCircuit, Cpu, FileText } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QuizModeSelectorProps {
  setMode: (mode: 'ai' | 'mock') => void;
}

export function QuizModeSelector({ setMode }: QuizModeSelectorProps) {

  return (
    <Card className="max-w-2xl mx-auto animate-fade-in bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <BrainCircuit className="mx-auto w-16 h-16 text-primary" />
        <CardTitle className="text-3xl font-bold mt-4">
          Choose Your Review Mode
        </CardTitle>
        <CardDescription>
          Select how you want to practice for the exam.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Button
            variant="outline"
            className="h-auto p-6 flex flex-col gap-2 hover:bg-primary/10"
            onClick={() => setMode('mock')}
          >
            <FileText className="w-10 h-10 text-primary" />
            <span className="text-lg font-semibold">Mock Exam</span>
            <p className="text-sm text-muted-foreground">
              Take a pre-made 20-item quiz.
            </p>
          </Button>
          <Button
            variant="outline"
            className="h-auto p-6 flex flex-col gap-2 hover:bg-accent/10"
            onClick={() => setMode('ai')}
          >
            <Cpu className="w-10 h-10 text-accent" />
            <span className="text-lg font-semibold">AI-Generated Quiz</span>
            <p className="text-sm text-muted-foreground">
              Customize a quiz to your needs.
            </p>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
