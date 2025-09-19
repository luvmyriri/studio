'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Cpu, FileText } from 'lucide-react';
import Link from 'next/link';

export function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center animate-fade-in space-y-8">
      <div className="text-center space-y-4">
        <BrainCircuit className="mx-auto w-24 h-24 text-primary" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
          Your AI-Powered Civil Service Reviewer
        </h1>
        <p className="max-w-2xl mx-auto text-muted-foreground md:text-xl">
          Ace the Philippine Civil Service Exam with personalized quizzes and comprehensive reviewers, all in one place.
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="flex items-center gap-4">
               <FileText className="w-12 h-12 text-primary" />
               <div>
                <CardTitle className="text-2xl">Mock Exam</CardTitle>
                <CardDescription>Simulate the real test</CardDescription>
               </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Take a comprehensive mock exam with 20 questions covering all major subjects to test your knowledge and readiness.
            </p>
            <Button asChild className="w-full">
              <Link href="/quiz?mode=mock">Start Mock Exam</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:border-accent/50 transition-colors">
           <CardHeader>
            <div className="flex items-center gap-4">
               <Cpu className="w-12 h-12 text-accent" />
               <div>
                <CardTitle className="text-2xl">AI-Generated Quiz</CardTitle>
                <CardDescription>Tailored to your needs</CardDescription>
               </div>
            </div>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground mb-6">
              Customize your practice sessions. Choose a subject, number of questions, and difficulty to focus on your weak spots.
            </p>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/quiz?mode=ai">Create AI Quiz</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
