'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, BookOpen, Calculator, FlaskConical, Globe, Languages, ScanText, Gavel } from 'lucide-react';
import Link from 'next/link';

const subjects = [
  { name: 'Mathematics', icon: Calculator, query: 'Mathematics', path: 'mathematics', description: 'Sharpen your problem-solving skills.' },
  { name: 'Vocabulary', icon: Languages, query: 'Vocabulary (English and Tagalog)', path: 'vocabulary', description: 'Expand your word knowledge.' },
  { name: 'Clerical Analysis', icon: ScanText, query: 'Clerical Analysis', path: 'clerical-analysis', description: 'Improve your filing and data entry accuracy.' },
  { name: 'Science', icon: FlaskConical, query: 'Science', path: 'science', description: 'Review fundamental scientific concepts.' },
  { name: 'General Information', icon: Globe, query: 'General Information', path: 'general-information', description: 'Test your knowledge on various topics.' },
  { name: 'Philippine Constitution', icon: Gavel, query: 'Philippine Constitution', path: 'philippine-constitution', description: 'Understand the supreme law of the land.' },
];

export function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center animate-fade-in space-y-12">
      <div className="text-center space-y-4">
        <BrainCircuit className="mx-auto w-24 h-24 text-primary animate-pulse" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
          Your AI-Powered Civil Service Reviewer
        </h1>
        <p className="max-w-3xl mx-auto text-muted-foreground md:text-xl">
          Ace the Philippine Civil Service Exam with personalized quizzes and comprehensive reviewers, all in one place.
        </p>
         <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg">
              <Link href="/quiz?mode=mock">Start Mock Exam</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/quiz?mode=ai">Create AI Quiz</Link>
            </Button>
          </div>
      </div>

      <div className="w-full max-w-6xl space-y-8">
        <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter">Explore Subjects</h2>
            <p className="text-muted-foreground">Dive into reviewers or generate a quiz for a specific topic.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Card key={subject.name} className="flex flex-col hover:border-primary/50 transition-colors group">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <subject.icon className="w-10 h-10 text-primary" />
                  <div>
                    <CardTitle className="text-xl">{subject.name}</CardTitle>
                    <CardDescription>{subject.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end">
                <div className="flex flex-col sm:flex-row gap-2">
                   <Button asChild variant="secondary" className="w-full group-hover:bg-accent/20">
                     <Link href={`/resources/${subject.path}`}><BookOpen/> Reviewer</Link>
                   </Button>
                   <Button asChild variant="outline" className="w-full">
                     <Link href={`/quiz?topic=${encodeURIComponent(subject.query)}`}>Start Quiz</Link>
                   </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
