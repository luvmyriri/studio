'use client';

import { Award, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

interface QuizResultsProps {
  score: number;
  total: number;
  onRestart: () => void;
}

export function QuizResults({ score, total, onRestart }: QuizResultsProps) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  let feedback = {
    title: '',
    description: '',
  };

  if (percentage >= 80) {
    feedback = { title: 'Excellent!', description: 'You have a strong grasp of the material!' };
  } else if (percentage >= 50) {
    feedback = {
      title: 'Good Job!',
      description: 'You have a solid knowledge base. Keep reviewing!',
    };
  } else {
    feedback = {
      title: 'Keep Practicing!',
      description: "Don't worry, every attempt is a learning opportunity.",
    };
  }

  return (
    <Card className="max-w-2xl mx-auto text-center animate-fade-in">
      <CardHeader>
        <Award className="mx-auto w-16 h-16 text-primary" />
        <CardTitle className="text-4xl font-bold mt-4">
          {feedback.title}
        </CardTitle>
        <CardDescription className="text-lg">
          {feedback.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-muted-foreground">Your Score</p>
          <p className="text-6xl font-bold">
            {score}{' '}
            <span className="text-3xl text-muted-foreground">/ {total}</span>
          </p>
          <p className="text-2xl font-semibold text-primary mt-2">{percentage}%</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={onRestart} className="w-full">
            <RotateCw className="mr-2 h-4 w-4" />
            Take Another Quiz
          </Button>
           <Button asChild variant="secondary" className="w-full">
              <Link href="/">Back to Home</Link>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
